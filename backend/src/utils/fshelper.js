const fs = require('fs')
const path = require('path')

// helper to ensure uploads dir exists - called on server start
function ensureUploads(dir){
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true})
}

module.exports = { ensureUploads }
