const express = require('express')
const router = express.Router()
const db = require('../db/queries')
const multer = require('multer')
const path = require('path')
const { requireAdmin } = require('../middleware/auth')

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(),'uploads')
const storage = multer.diskStorage({ destination: (req,file,cb)=> cb(null, uploadDir), filename: (req,file,cb)=> cb(null, Date.now() + '-' + file.originalname) })
const upload = multer({ storage })

router.get('/', (req,res)=>{
  const sql = `SELECT id,title,subject,chapter,type,source,sourceUrl,year,license,stored,file_path FROM pdfs ORDER BY imported_at DESC LIMIT 500`
  db.all(sql, [], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
})

router.get('/:id', (req,res)=>{
  const id = req.params.id
  db.get(`SELECT * FROM pdfs WHERE id = ?`, [id], (err,row)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    if(!row) return res.status(404).json({success:false,error:{message:'Not found'}})
    res.json({success:true,data:row})
  })
})

router.post('/upload', requireAdmin, upload.single('pdf'), (req,res)=>{
  if(!req.file) return res.status(400).json({success:false,error:{message:'No file'}})
  const body = req.body
  const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', req.file.filename)
  const sql = `INSERT INTO pdfs (title,subject,chapter,type,source,sourceUrl,year,license,file_path,stored,imported_from,imported_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
  const params = [body.title||req.file.originalname, body.subject||'', body.chapter||'', body.type||'', body.source||'', body.sourceUrl||'', body.year||'', body.license||'', filePath, 1, 'upload', Date.now()]
  db.run(sql, params, function(err){ if(err) return res.status(500).json({success:false,error:{message:err.message}}); res.json({success:true,data:{id:this.lastID}}) })
})

module.exports = router
