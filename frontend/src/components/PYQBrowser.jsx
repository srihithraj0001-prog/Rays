import React, { useEffect, useState } from 'react'
import demoPyqs from '../data/demo_pyqs.json'

function QuestionCard({q, onAnswer}){
  return (
    <div className="question-card">
      <div className="q-text">{q.question}</div>
      <div className="options">
        {q.options.map((opt,i)=> (
          <button key={i} onClick={()=>onAnswer(i)}>{opt}</button>
        ))}
      </div>
    </div>
  )
}

export default function PYQBrowser({onStartPractice}){
  const [pyqs,setPyqs] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(()=>{
    setPyqs(demoPyqs)
  },[])

  function onAnswer(q, idx){
    alert('Selected option '+idx+". Correct answer: " + q.answer)
  }

  return (
    <div>
      <h2>PYQ Browser</h2>
      <div className="pyq-controls">
        <input placeholder="Search PYQs" value={filter} onChange={(e)=>setFilter(e.target.value)} />
        <button onClick={onStartPractice}>Start Practice</button>
      </div>
      <div className="pyq-list">
        {pyqs.filter(p=>p.question.toLowerCase().includes(filter.toLowerCase())).map(q=> (
          <QuestionCard key={q.id} q={q} onAnswer={(i)=>onAnswer(q,i)} />
        ))}
      </div>
    </div>
  )
}
