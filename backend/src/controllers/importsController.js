const db = require('../db/queries')
const multer = require('multer')
const csv = require('csv-parse')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const validator = require('../utils/validator')
const dedupe = require('../utils/dedupe')

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(),'uploads')
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, {recursive:true})

function insertQuestion(q){
  return new Promise((resolve,reject)=>{
    const sql = `INSERT INTO questions (id,exam,year,session,subject,chapter,topic,question,options,answer,solution,difficulty,questionType,source,sourceUrl,officialQuestion,officialSolution,imported_from,imported_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    const params = [q.id,q.exam,q.year,q.session,q.subject,q.chapter,q.topic,q.question,JSON.stringify(q.options||[]),q.answer,q.solution,q.difficulty,q.questionType,q.source,q.sourceUrl,q.officialQuestion?1:0,q.officialSolution?1:0,'import',Date.now()]
    db.run(sql, params, function(err){ if(err) reject(err); else resolve(this.lastID) })
  })
}

async function importPYQs(req,res){
  const jobId = uuidv4()
  try{
    let rows = []
    if(req.is('application/json') && req.body && Object.keys(req.body).length){ rows = Array.isArray(req.body) ? req.body : [req.body] }
    else if(req.files && req.files.file){
      const up = req.files.file[0]
      const raw = fs.readFileSync(up.path)
      if(up.mimetype === 'application/json' || up.originalname.match(/\.json$/)){ rows = JSON.parse(raw.toString()) }
      else { rows = await new Promise((resolve, reject)=>{ csv(raw, {columns:true, trim:true}, (err, output)=> err ? reject(err) : resolve(output)) }) }
    } else if(req.body.csv){ rows = await new Promise((resolve,reject)=> csv(req.body.csv, {columns:true,trim:true}, (e,o)=> e?reject(e):resolve(o))) }
    else { return res.status(400).json({success:false,error:{message:'No input data'}}) }

    const errors = []
    let inserted = 0, duplicates = 0
    for(const r of rows){
      const mapped = r
      const v = validator.validateQuestion(mapped)
      if(!v.valid){ errors.push({row: mapped, errors: v.errors}); continue }
      const existing = await new Promise((res,rej)=> db.get(`SELECT id FROM questions WHERE id = ?`, [mapped.id], (err,row)=> err?rej(err):res(row)))
      if(existing){ duplicates++; continue }
      const fuzzy = await dedupe.findDuplicate(db, mapped)
      if(fuzzy){ duplicates++; continue }
      await insertQuestion(mapped)
      inserted++
    }

    db.run(`INSERT INTO imports_log (job_id,status,errors,inserted_count,duplicates_count,raw_filename,created_at) VALUES (?,?,?,?,?,?,?)`, [jobId, 'done', JSON.stringify(errors), inserted, duplicates, req.files && req.files.file ? req.files.file[0].originalname : 'inline', Date.now()])
    res.json({success:true,data:{job_id: jobId, inserted, duplicates, errors}})
  }catch(err){
    console.error(err)
    db.run(`INSERT INTO imports_log (job_id,status,errors,inserted_count,duplicates_count,raw_filename,created_at) VALUES (?,?,?,?,?,?,?)`, [jobId, 'failed', JSON.stringify([err.message]), 0, 0, 'error', Date.now()])
    res.status(500).json({success:false,error:{message:err.message}})
  }
}

async function importPDFManifest(req,res){
  const jobId = uuidv4()
  try{
    let rows = []
    if(req.is('application/json') && req.body && Object.keys(req.body).length){ rows = Array.isArray(req.body) ? req.body : [req.body] }
    else if(req.files && req.files.file){ const up = req.files.file[0]; const raw = fs.readFileSync(up.path); if(up.mimetype === 'application/json' || up.originalname.match(/\.json$/)){ rows = JSON.parse(raw.toString()) } else { rows = await new Promise((resolve,reject)=> csv(raw, {columns:true, trim:true}, (err, output)=> err ? reject(err) : resolve(output))) } }
    else { return res.status(400).json({success:false,error:{message:'No input data'}}) }

    let inserted=0, duplicates=0, errors=[]
    for(const r of rows){
      if(!r.title || !r.source){ errors.push({row:r,error:'missing title or source'}); continue }
      const exists = await new Promise((res,rej)=> db.get(`SELECT id FROM pdfs WHERE sourceUrl = ?`, [r.sourceUrl], (err,row)=> err?rej(err):res(row)))
      if(exists){ duplicates++; continue }
      const sql = `INSERT INTO pdfs (title,subject,chapter,type,source,sourceUrl,year,license,file_path,stored,imported_from,imported_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
      const params = [r.title,r.subject||'',r.chapter||'',r.type||'',r.source,r.sourceUrl||'',r.year||'',r.license||'',r.file||'',0,'manifest',Date.now()]
      await new Promise((res,rej)=> db.run(sql, params, function(err){ if(err)rej(err); else res(this.lastID) }))
      inserted++
    }
    db.run(`INSERT INTO imports_log (job_id,status,errors,inserted_count,duplicates_count,raw_filename,created_at) VALUES (?,?,?,?,?,?,?)`, [jobId, 'done', JSON.stringify(errors), inserted, duplicates, req.files && req.files.file ? req.files.file[0].originalname : 'inline-manifest', Date.now()])
    res.json({success:true,data:{job_id:jobId, inserted, duplicates, errors}})
  }catch(err){
    console.error(err)
    db.run(`INSERT INTO imports_log (job_id,status,errors,inserted_count,duplicates_count,raw_filename,created_at) VALUES (?,?,?,?,?,?,?)`, [jobId, 'failed', JSON.stringify([err.message]), 0, 0, 'error', Date.now()])
    res.status(500).json({success:false,error:{message:err.message}})
  }
}

function logs(req,res){
  db.all(`SELECT * FROM imports_log ORDER BY created_at DESC LIMIT 200`, [], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
}

module.exports = { importPYQs, importPDFManifest, logs }
