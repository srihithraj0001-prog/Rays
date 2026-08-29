import React, {useEffect, useState} from 'react'
import demo from '../data/demo_pyqs.json'

export default function PYQBrowser(){
  const [qset, setQset] = useState([])
  const [filter, setFilter] = useState({subject:'',chapter:'',difficulty:''})
  useEffect(()=> setQset(demo),[])

  const filtered = qset.filter(q=>{
    if(filter.subject && q.subject !== filter.subject) return false
    if(filter.chapter && q.chapter !== filter.chapter) return false
    if(filter.difficulty && q.difficulty !== filter.difficulty) return false
    return true
  })
  return (
    <div>
      <h2>PYQ Browser</h2>
      <div style={{display:'flex',gap:12,marginBottom:12}}>
        <select onChange={e=> setFilter({...filter,subject:e.target.value})}>
          <option value="">All Subjects</option>
          <option>Physics</option>
          <option>Chemistry</option>
          <option>Mathematics</option>
        </select>
        <select onChange={e=> setFilter({...filter,difficulty:e.target.value})}>
          <option value="">All Difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
      {filtered.map(q=> (
        <div key={q.id} className="question-card">
          <div><strong>{q.subject} — {q.chapter}</strong></div>
          <div style={{marginTop:8}}>{q.question}</div>
          <div style={{marginTop:8,display:'flex',gap:8}}>
            {q.options.map((o,i)=> <div key={i} style={{padding:'6px 10px',border:'1px solid rgba(0,0,0,0.06)',borderRadius:6}}>{o}</div>)}
          </div>
          <div style={{marginTop:8,fontSize:13,color:'var(--muted)'}}>Source: {q.source || 'Unknown'}</div>
        </div>
      ))}
    </div>
  )
}
