const normalize = s=> (s||'').replace(/\s+/g,' ').trim().toLowerCase()

async function findDuplicate(db, q){
  // look for identical question text + same source/year
  const text = normalize(q.question)
  return new Promise((res,rej)=>{
    db.get(`SELECT id,question FROM questions WHERE lower(trim(question)) = ? LIMIT 1`, [q.question.trim().toLowerCase()], (err,row)=>{
      if(err) return rej(err)
      if(row) return res(row)
      // otherwise check fuzzy by LIKE
      db.get(`SELECT id,question FROM questions WHERE question LIKE ? LIMIT 1`, ['%'+(q.question.split(' ').slice(0,6).join(' '))+'%'], (e,r2)=>{
        if(e) return rej(e)
        res(r2)
      })
    })
  })
}

module.exports = { findDuplicate }
