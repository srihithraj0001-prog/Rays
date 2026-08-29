import React, {useEffect, useState} from 'react'
import { getProgress, getSubjectAnalytics } from '../services/progress'

export default function Dashboard(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subjects, setSubjects] = useState([])

  useEffect(()=>{ fetchData() }, [])
  async function fetchData(){
    setLoading(true); setError(null)
    try{
      const subjectRes = await getSubjectAnalytics()
      setSubjects(subjectRes.data || [])
    }catch(err){
      setError(err); console.error(err)
    }finally{ setLoading(false) }
  }

  if(loading) return <div>Loading dashboard...</div>
  if(error) return <div>Error loading dashboard <button onClick={fetchData}>Retry</button></div>

  return (
    <div>
      <h2>Good evening, Student</h2>
      <div className="card">
        <h3>Subject performance</h3>
        {subjects.length === 0 ? <div>No activity yet</div> : (
          <ul>
            {subjects.map(s=> (
              <li key={s.subject}>{s.subject} — Accuracy: {s.accuracy || 0}% ({s.attempts} attempts)</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
