import React, { useState, useEffect } from 'react'
import demoPyqs from '../data/demo_pyqs.json'
import pdfs from '../data/pdfs.json'

export default function PracticeInterface(){
  const [questions,setQuestions] = useState([])
  const [index,setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])

  useEffect(()=>{
    setQuestions(demoPyqs)
    setResults(Array(demoPyqs.length).fill(null))
  },[])

  function selectOption(i){
    const q = questions[index]
    const newResults = [...results]
    newResults[index] = {selected:i, correct: i===q.answer}
    setResults(newResults)
    setSelected(i)
  }

  if(questions.length===0) return <div>Loading...</div>

  const q = questions[index]

  return (
    <div className="practice">
      <h3>Practice — {q.subject} / {q.chapter}</h3>
      <div>Question {index+1} / {questions.length}</div>
      <div className="q-box">{q.question}</div>
      <div className="opts">
        {q.options.map((o,i)=> (
          <button key={i} onClick={()=>selectOption(i)} className={selected===i? 'sel':''}>{o}</button>
        ))}
      </div>
      <div className="practice-controls">
        <button onClick={()=>setIndex(Math.max(0,index-1))}>Previous</button>
        <button onClick={()=>setIndex(Math.min(questions.length-1,index+1))}>Next</button>
      </div>
      <section className="solution">
        {results[index] && (
          <div>
            <div>Correct answer: {q.options[q.answer]}</div>
            <div>Your answer: {results[index].selected!==null? q.options[results[index].selected] : 'Unattempted'}</div>
            <div>Solution: {q.solution}</div>
          </div>
        )}
      </section>
      <aside className="pdf-sample">
        <h4>Sample PDF</h4>
        <a href={pdfs[0].file} target="_blank">Open sample PDF (external)</a>
      </aside>
    </div>
  )
}
