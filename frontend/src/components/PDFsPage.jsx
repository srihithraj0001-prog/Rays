import React, {useEffect, useState} from 'react'
import { getPDFs } from '../services/pdfs'
import PDFViewer from './PDFViewer'

export default function PDFsPage(){
  const [list, setList] = useState([])
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{ fetchPDFs() }, [])
  async function fetchPDFs(){
    setLoading(true); setError(null)
    try{
      const res = await getPDFs()
      setList(res.data || [])
    }catch(e){ setError(e); console.error(e) }
    finally{ setLoading(false) }
  }

  return (
    <div>
      <h2>PDF Library</h2>
      {loading && <div>Loading PDFs...</div>}
      {error && <div>Error loading PDFs <button onClick={fetchPDFs}>Retry</button></div>}
      <div style={{display:'flex',gap:12}}>
        <div style={{width:320}}>
          {list.map((p,i)=> (
            <div key={i} className="card" style={{marginBottom:8}}>
              <div><strong>{p.title}</strong></div>
              <div style={{fontSize:13,color:'var(--muted)'}}>{p.subject} — {p.type}</div>
              <div style={{marginTop:8}}><button onClick={()=> setOpen(p)}>{p.stored ? 'Open (uploaded)' : 'Open source'}</button></div>
              <div style={{marginTop:8,fontSize:13,color:'var(--muted)'}}>Source: {p.source} {p.sourceUrl ? <a href={p.sourceUrl} target="_blank">(link)</a>:null}</div>
            </div>
          ))}
        </div>
        <div style={{flex:1}}>
          {open ? (
            open.stored && open.file_path ? <PDFViewer src={(import.meta.env.VITE_API_URL||'/api').replace('/api','') + open.file_path.replace(/^[.\\/]+/, '')} /> : (open.sourceUrl ? <iframe src={open.sourceUrl} style={{width:'100%',height:600}} /> : <div>No PDF available</div>)
          ) : <div>Select a PDF to preview</div>}
        </div>
      </div>
    </div>
  )
}
