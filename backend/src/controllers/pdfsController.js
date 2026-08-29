const db = require('../db/queries')
const path = require('path')

function list(req,res){
  const sql = `SELECT id,title,subject,chapter,type,source,sourceUrl,year,license,stored,file_path FROM pdfs ORDER BY imported_at DESC LIMIT 500`
  db.all(sql, [], (err,rows)=>{
    if(err) return res.status(500).json({error:err.message})
    res.json(rows)
  })
}

function get(req,res){
  const id = req.params.id
  db.get(`SELECT * FROM pdfs WHERE id = ?`, [id], (err,row)=>{
    if(err) return res.status(500).json({error:err.message})
    if(!row) return res.status(404).json({error:'Not found'})
    res.json(row)
  })
}

function upload(req,res){
  // multer saved file in req.file
  if(!req.file) return res.status(400).json({error:'No file'})
  const body = req.body
  const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', req.file.filename)
  const sql = `INSERT INTO pdfs (title,subject,chapter,type,source,sourceUrl,year,license,file_path,stored,imported_from,imported_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
  const params = [body.title||req.file.originalname, body.subject||'', body.chapter||'', body.type||'', body.source||'', body.sourceUrl||'', body.year||'', body.license||'', filePath, 1, 'upload', Date.now()]
  db.run(sql, params, function(err){
    if(err) return res.status(500).json({error:err.message})
    res.json({id: this.lastID})
  })
}

module.exports = { list, get, upload }
