import api from './api'

export async function getQuestions(filters={page:1,limit:20}){
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k,v])=>{ if(v !== undefined && v !== null && v !== '') params.append(k,v) })
  const path = `/questions?${params.toString()}`
  return api.request(path)
}

export async function getQuestion(id){
  return api.request(`/questions/${encodeURIComponent(id)}`)
}

export async function attemptQuestion(id, payload){
  return api.request(`/attempts/${encodeURIComponent(id)}`, { method: 'POST', body: payload })
}
