// Basic admin auth middleware using HTTP Basic Auth
const dotenv = require('dotenv')
const auth = require('basic-auth')
dotenv.config()

const ADMIN_USER = process.env.ADMIN_USER || 'admin@example.com'
const ADMIN_PASS = process.env.ADMIN_PASS || 'ChangeMe123'

module.exports = function(req,res,next){
  const user = auth(req)
  if(!user || user.name !== ADMIN_USER || user.pass !== ADMIN_PASS){
    res.set('WWW-Authenticate', 'Basic realm="Rays Admin"')
    return res.status(401).json({success:false, error:{message:'Unauthorized', code:'UNAUTHORIZED'}})
  }
  next()
}
