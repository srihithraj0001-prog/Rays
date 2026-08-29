import api from './api'

export async function getBookmarks(){
  return api.request('/bookmarks')
}
export async function addBookmark(type, ref_id){
  return api.request('/bookmarks', { method: 'POST', body: { type, ref_id } })
}
export async function removeBookmark(refId){
  return api.request(`/bookmarks/${encodeURIComponent(refId)}`, { method: 'DELETE' })
}
