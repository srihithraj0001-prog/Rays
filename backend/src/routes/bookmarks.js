const express = require('express')
const router = express.Router()
const db = require('../db/queries')

// simple bookmarks endpoints (no auth)
router.get('/', (req,res)=>{
  const sql = `SELECT * FROM bookmarks ORDER BY created_at DESC LIMIT 200`;
  db.all(sql, [], (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json(rows);
  })
})

router.post('/', (req,res)=>{
  const {user_id, type, ref_id} = req.body
  const sql = `INSERT INTO bookmarks (user_id,type,ref_id,created_at) VALUES (?,?,?,?)`
  db.run(sql, [user_id||'local', type, ref_id, Date.now()], function(err){
    if(err) return res.status(500).json({error:err.message})
    res.json({id:this.lastID})
  })
})

module.exports = router
