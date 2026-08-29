const express = require('express')
const router = express.Router()
const db = require('../db/queries')

// subject-level analytics
router.get('/subjects', (req,res)=>{
  const userId = req.header('x-user-id') || process.env.DEMO_USER_ID || 'demo-user'
  const sql = `SELECT q.subject, SUM(a.correct) as correct, COUNT(a.id) as attempts, ROUND(100.0 * SUM(a.correct)/COUNT(a.id),2) as accuracy FROM question_attempts a JOIN questions q ON a.question_id = q.id WHERE a.user_id = ? GROUP BY q.subject`
  db.all(sql, [userId], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
})

router.get('/chapters', (req,res)=>{
  const userId = req.header('x-user-id') || process.env.DEMO_USER_ID || 'demo-user'
  const sql = `SELECT q.chapter, SUM(a.correct) as correct, COUNT(a.id) as attempts, ROUND(100.0 * SUM(a.correct)/COUNT(a.id),2) as accuracy FROM question_attempts a JOIN questions q ON a.question_id = q.id WHERE a.user_id = ? GROUP BY q.chapter`
  db.all(sql, [userId], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
})

module.exports = router
