const express = require('express')
const router = express.Router()
const db = require('../db/queries')

// public question list endpoints (no auth required)
router.get('/', (req,res)=>{
  const {exam,year,subject,chapter,topic,difficulty,questionType,page,limit} = req.query
  let sql = `SELECT id,exam,year,session,subject,chapter,topic,question,options,difficulty,questionType,source,sourceUrl FROM questions WHERE 1=1`
  const params = []
  if(exam){ sql += ` AND exam = ?`; params.push(exam) }
  if(year){ sql += ` AND year = ?`; params.push(Number(year)) }
  if(subject){ sql += ` AND subject = ?`; params.push(subject) }
  if(chapter){ sql += ` AND chapter = ?`; params.push(chapter) }
  const p = Number(page||1)
  const l = Number(limit||20)
  sql += ` ORDER BY imported_at DESC LIMIT ? OFFSET ?`
  params.push(l, (p-1)*l)
  db.all(sql, params, (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    rows = rows.map(r=> ({...r, options: r.options ? JSON.parse(r.options) : []}))
    res.json({success:true,data:rows,meta:{page:p,limit:l}})
  })
})

router.get('/:id', (req,res)=>{
  const id = req.params.id
  db.get(`SELECT * FROM questions WHERE id = ?`, [id], (err,row)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    if(!row) return res.status(404).json({success:false,error:{message:'Not found', code:'QUESTION_NOT_FOUND'}})
    row.options = row.options ? JSON.parse(row.options) : []
    // do not include answer/solution unless caller is allowed? For now include
    res.json({success:true,data:row})
  })
})

module.exports = router
