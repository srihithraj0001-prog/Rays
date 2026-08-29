const db = require('../db/queries')

// subject-level analytics
function subjects(req,res){
  const userId = req.user.id
  const sql = `SELECT q.subject, SUM(a.correct) as correct, COUNT(a.id) as attempts, ROUND(100.0 * SUM(a.correct)/COUNT(a.id),2) as accuracy FROM question_attempts a JOIN questions q ON a.question_id = q.id WHERE a.user_id = ? GROUP BY q.subject`
  db.all(sql, [userId], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
}

function chapters(req,res){
  const userId = req.user.id
  const sql = `SELECT q.chapter, SUM(a.correct) as correct, COUNT(a.id) as attempts, ROUND(100.0 * SUM(a.correct)/COUNT(a.id),2) as accuracy FROM question_attempts a JOIN questions q ON a.question_id = q.id WHERE a.user_id = ? GROUP BY q.chapter`
  db.all(sql, [userId], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
}

module.exports = { subjects, chapters }
