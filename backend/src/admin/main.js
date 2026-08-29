async function postFile(endpoint, fileInput){
  const f = fileInput.files[0]
  if(!f) return {error:'no file selected'}
  const fd = new FormData();
  fd.append('file', f)
  const res = await fetch(endpoint, {method:'POST', body: fd})
  return res.json()
}

document.getElementById('pyq-form').addEventListener('submit', async (e)=>{
  e.preventDefault()
  const file = document.getElementById('pyq-file').files[0]
  if(!file) return alert('select a file')
  const fd = new FormData(); fd.append('file', file)
  const res = await fetch('/api/imports/pyqs', {method:'POST', body: fd})
  const json = await res.json()
  document.getElementById('pyq-result').textContent = JSON.stringify(json, null, 2)
})

document.getElementById('pdf-manifest-form').addEventListener('submit', async (e)=>{
  e.preventDefault()
  const file = document.getElementById('pdf-manifest-file').files[0]
  if(!file) return alert('select a file')
  const fd = new FormData(); fd.append('file', file)
  const res = await fetch('/api/imports/pdfs-manifest', {method:'POST', body: fd})
  const json = await res.json()
  document.getElementById('pdf-manifest-result').textContent = JSON.stringify(json, null, 2)
})

document.getElementById('pdf-upload-form').addEventListener('submit', async (e)=>{
  e.preventDefault()
  const file = document.getElementById('pdf-file').files[0]
  if(!file) return alert('select a file')
  const fd = new FormData(); fd.append('pdf', file)
  fd.append('title', document.getElementById('pdf-title').value)
  fd.append('source', document.getElementById('pdf-source').value)
  fd.append('sourceUrl', document.getElementById('pdf-sourceUrl').value)
  const res = await fetch('/api/pdfs/upload', {method:'POST', body: fd})
  const json = await res.json()
  document.getElementById('pdf-upload-result').textContent = JSON.stringify(json, null, 2)
})
