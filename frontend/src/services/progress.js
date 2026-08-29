import api from './api'

export async function getProgress(){
  return api.request('/activity/recent')
}

export async function getSubjectAnalytics(){
  return api.request('/analytics/subjects')
}

export async function getChapterAnalytics(){
  return api.request('/analytics/chapters')
}
