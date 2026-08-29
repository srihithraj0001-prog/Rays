const db = require('../db/queries')

function list(req,res){
  const sql = `SELECT id,title,subject,chapter,type,source,sourceUrl,year,license,stored,file_path FROM pdfs ORDER BY imported_at DESC LIMIT 500`
  db.all(sql, [], (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    res.json({success:true,data:rows})
  })
}

function get(req,res){
  const id = req.params.id
  db.get(`SELECT * FROM pdfs WHERE id = ?`, [id], (err,row)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    if(!row) return res.status(404).json({success:false,error:{message:'Not found'}})
    res.json({success:true,data:row})
  })
}

module.exports = { list, get }
