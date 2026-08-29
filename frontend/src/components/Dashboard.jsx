import React from 'react'
import { getProgress } from '../utils/storage'

export default function Dashboard(){
  const progress = getProgress()
  return (
    <div>
      <h2>Good evening, Student</h2>
      <div className="card">
        <h3>Today's Progress</h3>
        <div style={{display:'flex',gap:12}}>
          <div>Physics <strong>{progress.Physics||0}%</strong></div>
          <div>Chemistry <strong>{progress.Chemistry||0}%</strong></div>
          <div>Mathematics <strong>{progress.Mathematics||0}%</strong></div>
        </div>
      </div>
      <div className="card">
        <h3>Continue Learning</h3>
        <div>Physics → Rotational Motion</div>
      </div>
    </div>
  )
}
