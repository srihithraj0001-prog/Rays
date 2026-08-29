const express = require('express')
const router = express.Router()
const db = require('../db/queries')
const { requireAuth } = require('../middleware/auth')

router.use(requireAuth)

router.get('/', (req,res)=>{
  const userId = req.user.id
  const sql = `SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC LIMIT 200`
  db.all(sql, [userId], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
})

router.post('/', (req,res)=>{
  const userId = req.user.id
  const {type, ref_id} = req.body
  if(!type || !ref_id) return res.status(400).json({success:false,error:{message:'type and ref_id required'}})
  const sql = `INSERT INTO bookmarks (user_id,type,ref_id,created_at) VALUES (?,?,?,?)`
  db.run(sql, [userId,type,ref_id,Date.now()], function(err){ if(err) return res.status(500).json({success:false,error:{message:err.message}}); res.json({success:true,data:{id:this.lastID}}) })
})

router.delete('/:refId', (req,res)=>{
  const userId = req.user.id
  const refId = req.params.refId
  const sql = `DELETE FROM bookmarks WHERE user_id = ? AND ref_id = ?`
  db.run(sql, [userId, refId], function(err){ if(err) return res.status(500).json({success:false,error:{message:err.message}}); res.json({success:true,data:{deleted:this.changes}}) })
})

module.exports = router
