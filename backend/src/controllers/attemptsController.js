const db = require('../db/queries')

function recordAttempt(req,res){
  const userId = req.header('x-user-id') || process.env.DEMO_USER_ID || 'demo-user'
  const questionId = req.params.questionId
  const {selectedAnswer, timeTaken} = req.body
  if(!questionId || (selectedAnswer === undefined)) return res.status(400).json({success:false,error:{message:'questionId and selectedAnswer required'}})

  // fetch correct answer
  db.get(`SELECT answer FROM questions WHERE id = ?`, [questionId], (err,row)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    if(!row) return res.status(404).json({success:false,error:{message:'Question not found', code:'QUESTION_NOT_FOUND'}})
    const correct = (String(selectedAnswer).trim() === String(row.answer).trim()) ? 1 : 0
    const sql = `INSERT INTO question_attempts (user_id,question_id,answer,correct,time_taken,created_at) VALUES (?,?,?,?,?,?)`
    db.run(sql, [userId, questionId, selectedAnswer, correct, timeTaken||0, Date.now()], function(err){
      if(err) return res.status(500).json({success:false,error:{message:err.message}})
      res.json({success:true,data:{attemptId:this.lastID, questionId, correct: !!correct}})
    })
  })
}

function listAttempts(req,res){
  const userId = req.header('x-user-id') || process.env.DEMO_USER_ID || 'demo-user'
  db.all(`SELECT * FROM question_attempts WHERE user_id = ? ORDER BY created_at DESC LIMIT 500`, [userId], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
}

module.exports = { recordAttempt, listAttempts }
