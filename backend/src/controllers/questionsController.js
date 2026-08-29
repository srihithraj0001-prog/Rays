const db = require('../db/queries')
const { v4: uuidv4 } = require('uuid')
const validator = require('../utils/validator')
const dedupe = require('../utils/dedupe')

function list(req,res){
  const {exam,year,subject,chapter,topic,difficulty,limit,offset} = req.query
  let sql = `SELECT * FROM questions WHERE 1=1`
  const params = []
  if(exam){ sql += ` AND exam = ?`; params.push(exam) }
  if(year){ sql += ` AND year = ?`; params.push(Number(year)) }
  if(subject){ sql += ` AND subject = ?`; params.push(subject) }
  if(chapter){ sql += ` AND chapter = ?`; params.push(chapter) }
  sql += ` ORDER BY imported_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit||100), Number(offset||0))
  db.all(sql, params, (err,rows)=>{
    if(err) return res.status(500).json({error:err.message})
    // parse options
    rows = rows.map(r=> ({...r, options: r.options ? JSON.parse(r.options) : []}))
    res.json(rows)
  })
}

function get(req,res){
  const id = req.params.id
  db.get(`SELECT * FROM questions WHERE id = ?`, [id], (err,row)=>{
    if(err) return res.status(500).json({error:err.message})
    if(!row) return res.status(404).json({error:'Not found'})
    row.options = row.options ? JSON.parse(row.options) : []
    res.json(row)
  })
}

function create(req,res){
  const payload = req.body
  const v = validator.validateQuestion(payload)
  if(!v.valid) return res.status(400).json({errors:v.errors})
  const id = payload.id || uuidv4()
  // dedupe by id
  db.get(`SELECT id FROM questions WHERE id = ?`, [id], (err,row)=>{
    if(err) return res.status(500).json({error:err.message})
    if(row) return res.status(409).json({error:'Duplicate id'})
    const sql = `INSERT INTO questions (id,exam,year,session,subject,chapter,topic,question,options,answer,solution,difficulty,questionType,source,sourceUrl,officialQuestion,officialSolution,imported_from,imported_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    const params = [id,payload.exam,payload.year,payload.session,payload.subject,payload.chapter,payload.topic,payload.question,JSON.stringify(payload.options||[]),payload.answer,payload.solution,payload.difficulty,payload.questionType,payload.source,payload.sourceUrl,payload.officialQuestion?1:0,payload.officialSolution?1:0,'api',Date.now()]
    db.run(sql, params, function(err){
      if(err) return res.status(500).json({error:err.message})
      res.json({id})
    })
  })
}

module.exports = { list, get, create }
