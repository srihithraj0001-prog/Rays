import React, {useEffect, useState} from 'react'
import { getQuestion, attemptQuestion } from '../services/questions'
import { addBookmark, removeBookmark, getBookmarks } from '../services/bookmarks'

export default function PracticeInterface(){
  const [qs, setQs] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showSolution, setShowSolution] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookmarks, setBookmarks] = useState([])

  useEffect(()=>{ loadQuestions() ; loadBookmarks() }, [])
  async function loadQuestions(){
    setLoading(true)
    try{
      const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/questions?limit=20')
      const json = await res.json()
      setQs(json.data || [])
    }catch(e){ setError(e); console.error(e) }
    finally{ setLoading(false) }
  }
  async function loadBookmarks(){
    try{ const res = await getBookmarks(); setBookmarks(res.data || []) }catch(e){ console.error(e) }
  }

  if(loading) return <div>Loading...</div>
  if(error) return <div>Error loading questions <button onClick={loadQuestions}>Retry</button></div>
  if(!qs.length) return <div>No questions available</div>

  const q = qs[index]
  async function submit(){
    try{
      const start = Date.now()
      const payload = { selectedAnswer: selected, timeTaken: 30 }
      const res = await attemptQuestion(q.id, payload)
      setShowSolution(true)
      // refresh bookmarks
      loadBookmarks()
    }catch(e){ console.error(e); alert('Error submitting') }
  }

  async function toggleBookmark(){
    const exists = bookmarks.find(b=> b.ref_id === q.id)
    try{
      if(exists){ await removeBookmark(q.id) } else { await addBookmark('question', q.id) }
      loadBookmarks()
    }catch(e){ console.error(e) }
  }

  return (
    <div>
      <h2>Practice</h2>
      <div className="question-card">
        <div>Question {index+1} / {qs.length}</div>
        <div style={{marginTop:8}}>{q.question}</div>
        <div style={{marginTop:8}}>
          {q.options.map((o,i)=> (
            <div key={i} style={{marginTop:6}}>
              <label><input type="radio" name="opt" checked={selected===o} onChange={()=> setSelected(o)} /> {o}</label>
            </div>
          ))}
        </div>
        <div style={{marginTop:12}}>
          <button onClick={submit}>Submit</button>
          <button style={{marginLeft:8}} onClick={()=>{ setIndex(Math.max(0,index-1)); setShowSolution(false); setSelected(null)}}>Previous</button>
          <button style={{marginLeft:8}} onClick={()=>{ setIndex(Math.min(qs.length-1,index+1)); setShowSolution(false); setSelected(null)}}>Next</button>
          <button style={{marginLeft:8}} onClick={toggleBookmark}>{bookmarks.find(b=> b.ref_id === q.id) ? 'Unbookmark' : 'Bookmark'}</button>
        </div>
        {showSolution && (
          <div style={{marginTop:12,background:'#f7f9fb',padding:10,borderRadius:6}}>
            <div><strong>Correct answer:</strong> {q.answer}</div>
            <div style={{marginTop:6}}><strong>Solution:</strong> {q.solution}</div>
            <div style={{marginTop:6,color:'var(--muted)'}}>Source: {q.source} {q.sourceUrl ? <a href={q.sourceUrl} target="_blank">(link)</a>:null}</div>
          </div>
        )}
      </div>
    </div>
  )
}
