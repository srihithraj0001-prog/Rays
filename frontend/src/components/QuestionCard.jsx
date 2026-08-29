import React from 'react'

export default function QuestionCard({q}){
  return (
    <div className="question-card">
      <div><strong>{q.subject} — {q.chapter}</strong></div>
      <div style={{marginTop:8}}>{q.question}</div>
      <div style={{marginTop:8,fontSize:13,color:'var(--muted)'}}>Source: {q.source}</div>
    </div>
  )
}
