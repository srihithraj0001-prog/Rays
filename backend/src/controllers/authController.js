// authentication controller
const db = require('../db/queries')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

async function register(req,res){
  const { name, email, password } = req.body
  if(!name || !email || !password) return res.status(400).json({success:false,error:{message:'name,email,password required'}})
  if(password.length < 6) return res.status(400).json({success:false,error:{message:'password too short'}})
  // check existing
  db.get(`SELECT id FROM users WHERE email = ?`, [email], (err,row)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    if(row) return res.status(409).json({success:false,error:{message:'Email already registered'}})
    const id = uuidv4()
    const hash = bcrypt.hashSync(password, 10)
    db.run(`INSERT INTO users (id,name,email,password_hash,role,created_at,updated_at) VALUES (?,?,?,?,?,?,?)`, [id,name,email,hash,'student',Date.now(),Date.now()], function(err){
      if(err) return res.status(500).json({success:false,error:{message:err.message}})
      // set session
      req.session.regenerate((e)=>{
        if(e) return res.status(500).json({success:false,error:{message:'Session error'}})
        req.session.userId = id
        res.json({success:true,data:{user:{id,name,email,role:'student'}}})
      })
    })
  })
}

function login(req,res){
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({success:false,error:{message:'email and password required'}})
  db.get(`SELECT id,name,email,password_hash,role FROM users WHERE email = ?`, [email], (err,row)=>{
    if(err) return res.status(500).json({success:false,error:{message:err.message}})
    if(!row) return res.status(401).json({success:false,error:{message:'Invalid credentials'}})
    if(!row.password_hash) return res.status(401).json({success:false,error:{message:'Invalid credentials'}})
    const ok = bcrypt.compareSync(password, row.password_hash)
    if(!ok) return res.status(401).json({success:false,error:{message:'Invalid credentials'}})
    req.session.regenerate((e)=>{
      if(e) return res.status(500).json({success:false,error:{message:'Session error'}})
      req.session.userId = row.id
      res.json({success:true,data:{user:{id:row.id,name:row.name,email:row.email,role:row.role}}})
    })
  })
}

function logout(req,res){
  req.session.destroy((err)=>{
    res.clearCookie('connect.sid')
    if(err) return res.status(500).json({success:false,error:{message:'Logout failed'}})
    res.json({success:true})
  })
}

function me(req,res){
  if(!req.user) return res.status(401).json({success:false,error:{code:'UNAUTHORIZED',message:'Authentication required'}})
  const u = req.user
  res.json({success:true,data:{user:{id:u.id,name:u.name,email:u.email,role:u.role}}})
}

module.exports = { register, login, logout, me }
