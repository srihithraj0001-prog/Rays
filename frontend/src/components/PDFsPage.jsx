import React, {useEffect, useState} from 'react'
import pdfs from '../data/pdfs.json'
import PDFViewer from './PDFViewer'

export default function PDFsPage(){
  const [list, setList] = useState([])
  const [open, setOpen] = useState(null)
  useEffect(()=> setList(pdfs),[])
  return (
    <div>
      <h2>PDF Library</h2>
      <div style={{display:'flex',gap:12}}>
        <div style={{width:320}}>
          {list.map((p,i)=> (
            <div key={i} className="card" style={{marginBottom:8}}>
              <div><strong>{p.title}</strong></div>
              <div style={{fontSize:13,color:'var(--muted)'}}>{p.subject} — {p.type}</div>
              <div style={{marginTop:8}}><button onClick={()=> setOpen(p.file)}>Open PDF</button></div>
              <div style={{marginTop:8,fontSize:13,color:'var(--muted)'}}>Source: {p.source} {p.sourceUrl ? <a href={p.sourceUrl} target="_blank">(link)</a>:null}</div>
            </div>
          ))}
        </div>
        <div style={{flex:1}}>
          {open ? <PDFViewer src={open} /> : <div>Select a PDF to preview</div>}
        </div>
      </div>
    </div>
  )
}
