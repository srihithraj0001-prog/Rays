import api from './api'

export async function getPDFs(){
  return api.request('/pdfs')
}
export async function getPDF(id){
  return api.request(`/pdfs/${encodeURIComponent(id)}`)
}
