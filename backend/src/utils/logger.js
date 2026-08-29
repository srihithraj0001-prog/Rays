const fs = require('fs')
function logImport(db, jobId, status, errors, inserted, duplicates, filename){
  db.run(`INSERT INTO imports_log (job_id,status,errors,inserted_count,duplicates_count,raw_filename,created_at) VALUES (?,?,?,?,?,?,?)`, [jobId,status,JSON.stringify(errors||[]), inserted||0, duplicates||0, filename||'', Date.now()])
}
module.exports = { logImport }
