import React, {useEffect, useState} from 'react'
import demo from '../data/demo_pyqs.json'
import { saveAttempt, getAttempt } from '../utils/storage'

export default function PracticeInterface(){
  const [qs, setQs] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showSolution, setShowSolution] = useState(false)

  useEffect(()=> setQs(demo),[])
  useEffect(()=>{
    const a = getAttempt(qs[index]?.id)
    if(a) setSelected(a.answer)
  },[qs,index])

  if(!qs.length) return <div>Loading...</div>
  const q = qs[index]
  function submit(){
    saveAttempt(q.id, {answer:selected, correct: selected===q.answer, time:30})
    setShowSolution(true)
  }
  return (
    <div>
      <h2>Practice</h2>
      <div className="question-card">
        <div>Question {index+1} / {qs.length}</div>
        <div style={{marginTop:8}}>{q.question}</div>
        <div style={{marginTop:8}}>
          {q.options.map(o=> (
            <div key={o} style={{marginTop:6}}>
              <label><input type="radio" name="opt" checked={selected===o} onChange={()=> setSelected(o)} /> {o}</label>
            </div>
          ))}
        </div>
        <div style={{marginTop:12}}>
          <button onClick={submit}>Submit</button>
          <button style={{marginLeft:8}} onClick={()=>{ setIndex(Math.max(0,index-1)); setShowSolution(false); setSelected(null)}}>Previous</button>
          <button style={{marginLeft:8}} onClick={()=>{ setIndex(Math.min(qs.length-1,index+1)); setShowSolution(false); setSelected(null)}}>Next</button>
        </div>
        {showSolution && (
          <div style={{marginTop:12,background:'#f7f9fb',padding:10,borderRadius:6}}>
            <div><strong>Correct answer:</strong> {q.answer}</div>
            <div style={{marginTop:6}}><strong>Solution:</strong> {q.solution}</div>
            <div style={{marginTop:6,color:'var(--muted)'}}>Source: {q.source}</div>
          </div>
        )}
      </div>
    </div>
  )
}
