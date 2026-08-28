import React from 'react'
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale)

export default function Dashboard(){
  const data = [72,64,81]
  return (
    <div>
      <h2>Good evening, Student</h2>
      <section className="progress-overview">
        <div className="subject">Physics<br/><strong>{data[0]}%</strong></div>
        <div className="subject">Chemistry<br/><strong>{data[1]}%</strong></div>
        <div className="subject">Mathematics<br/><strong>{data[2]}%</strong></div>
      </section>
      <section className="continue-learning">
        <h3>Continue Learning</h3>
        <div>Physics → Rotational Motion</div>
      </section>
    </div>
  )
}
