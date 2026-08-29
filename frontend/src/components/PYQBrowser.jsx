import React, {useEffect, useState} from 'react'
import { getQuestions } from '../services/questions'
import QuestionCard from './QuestionCard'

export default function PYQBrowser(){
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [qs, setQs] = useState([])
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({})

  useEffect(()=>{ fetchPage(1) }, [])

  async function fetchPage(p){
    setLoading(true); setError(null)
    try{
      const res = await getQuestions({...filters, page:p, limit:20})
      setQs(res.data || [])
      setPage(p)
    }catch(e){ setError(e); console.error(e) }
    finally{ setLoading(false) }
  }

  return (
    <div>
      <h2>PYQ Browser</h2>
      <div style={{display:'flex',gap:12,marginBottom:12}}>
        <select onChange={e=> setFilters({...filters,subject:e.target.value})}>
          <option value="">All Subjects</option>
          <option>Physics</option>
          <option>Chemistry</option>
          <option>Mathematics</option>
        </select>
        <select onChange={e=> setFilters({...filters,difficulty:e.target.value})}>
          <option value="">All Difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button onClick={()=> fetchPage(1)}>Apply</button>
      </div>
      {loading && <div>Loading questions...</div>}
      {error && <div>Error loading questions <button onClick={()=> fetchPage(page)}>Retry</button></div>}
      {!loading && !error && qs.length === 0 && <div>No questions found</div>}
      {qs.map(q=> <QuestionCard key={q.id} q={q} />)}
      <div style={{marginTop:12}}>
        <button onClick={()=> fetchPage(Math.max(1,page-1))}>Previous</button>
        <span style={{margin:'0 8px'}}>Page {page}</span>
        <button onClick={()=> fetchPage(page+1)}>Next</button>
      </div>
    </div>
  )
}
