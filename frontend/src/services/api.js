// update api request to include credentials and proper base
const BASE = import.meta.env.VITE_API_URL || (location.origin + '/api')

async function request(path, {method='GET', body, headers={}} = {}){
  const opts = { method, headers: {...headers}, credentials: 'include' }
  if(body && typeof body === 'object' && !(body instanceof FormData)){
    opts.body = JSON.stringify(body)
    opts.headers['Content-Type'] = 'application/json'
  } else if(body instanceof FormData){
    opts.body = body
  }
  const res = await fetch(BASE + path, opts)
  const text = await res.text()
  let json = null
  try{ json = text ? JSON.parse(text) : null }catch(e){ json = {success:false,error:{message:'Invalid JSON response'}} }
  if(!res.ok) throw {status: res.status, body: json}
  return json
}

export default { request }
