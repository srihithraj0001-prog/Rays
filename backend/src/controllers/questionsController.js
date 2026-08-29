const db = require('../db/queries')

function list(req,res){
  const {exam,year,subject,chapter,topic,difficulty,limit,offset} = req.query
  let sql = `SELECT * FROM questions WHERE 1=1`
  const params = []
  if(exam){ sql += ` AND exam = ?`; params.push(exam) }
  if(year){ sql += ` AND year = ?`; params.push(Number(year)) }
  if(subject){ sql += ` AND subject = ?`; params.push(subject) }
  if(chapter){ sql += ` AND chapter = ?`; params.push(chapter) }
  sql += ` ORDER BY imported_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit||100), Number(offset||0))
  db.all(sql, params, (err,rows)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    rows = rows.map(r=> ({...r, options: r.options ? JSON.parse(r.options) : []}))
    res.json({success:true,data:rows})
  })
}

function get(req,res){
  const id = req.params.id
  db.get(`SELECT * FROM questions WHERE id = ?`, [id], (err,row)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    if(!row) return res.status(404).json({success:false,error:{message:'Not found'}})
    row.options = row.options ? JSON.parse(row.options) : []
    res.json({success:true,data:row})
  })
}

module.exports = { list, get }
