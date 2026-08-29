export function loadDemoData(){
  // noop for now; placeholder for future data loading from /data
}

export function getProgress(){
  const raw = localStorage.getItem('rays.progress')
  return raw ? JSON.parse(raw) : {Physics:72,Chemistry:64,Mathematics:81}
}

export function saveAttempt(id, attempt){
  const key = 'rays.attempts.'+id
  localStorage.setItem(key, JSON.stringify(attempt))
}
export function getAttempt(id){
  const raw = localStorage.getItem('rays.attempts.'+id)
  return raw ? JSON.parse(raw) : null
}
