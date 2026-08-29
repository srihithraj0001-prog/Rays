const db = require('../db/queries')

// middleware to attach user from session, and requireAuth / requireAdmin
function attachUser(req,res,next){
  if(req.session && req.session.userId){
    db.get(`SELECT id,name,email,role FROM users WHERE id = ?`, [req.session.userId], (err,row)=>{
      if(err) return next(err)
      if(row){ req.user = row }
      next()
    })
  } else next()
}

function requireAuth(req,res,next){
  if(req.user) return next()
  return res.status(401).json({success:false,error:{code:'UNAUTHORIZED',message:'Authentication required'}})
}

function requireAdmin(req,res,next){
  if(req.user && req.user.role === 'admin') return next()
  return res.status(403).json({success:false,error:{code:'FORBIDDEN',message:'Admin role required'}})
}

module.exports = { attachUser, requireAuth, requireAdmin }
