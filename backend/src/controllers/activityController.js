const db = require('../db/queries')

function recent(req,res){
  const userId = req.user.id
  const sql = `SELECT 'attempt' as type, a.id, a.question_id, a.answer, a.correct, a.time_taken, a.created_at FROM question_attempts a WHERE a.user_id = ? UNION SELECT 'bookmark' as type, b.id, b.ref_id, null, null, b.created_at FROM bookmarks b WHERE b.user_id = ? ORDER BY created_at DESC LIMIT 50`
  db.all(sql, [userId,userId], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
}

module.exports = { recent }
