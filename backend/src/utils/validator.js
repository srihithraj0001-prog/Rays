// basic validation helpers

function validateQuestion(q){
  const errors = []
  if(!q.id) errors.push('id missing')
  if(!q.exam) errors.push('exam missing')
  if(!q.year || isNaN(Number(q.year))) errors.push('year missing or invalid')
  if(!q.subject) errors.push('subject missing')
  if(!q.question) errors.push('question text missing')
  if(!q.answer) errors.push('answer missing')
  if(!q.source) errors.push('source missing')
  return { valid: errors.length === 0, errors }
}

module.exports = { validateQuestion }
