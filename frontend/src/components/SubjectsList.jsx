import React from 'react'
import syllabus from '../data/syllabus.json'

export default function SubjectsList({syllabus,onOpenChapter}){
  return (
    <div>
      <h2>Subjects</h2>
      <div className="subjects-grid">
        {Object.keys(syllabus).map(sub=> (
          <div key={sub} className="subject-card">
            <h3>{sub}</h3>
            <ul>
              {syllabus[sub].slice(0,6).map(ch=> <li key={ch}>{ch}</li>)}
            </ul>
            <button onClick={()=>onOpenChapter()}>Open</button>
          </div>
        ))}
      </div>
    </div>
  )
}
