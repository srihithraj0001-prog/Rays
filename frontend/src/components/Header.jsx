import React from 'react'

export default function Header({onNavigate}){
  return (
    <header className="app-header">
      <div className="logo">Rays — JEE Prep (Demo)</div>
      <div className="header-actions">
        <button onClick={()=>onNavigate('home')}>Home</button>
        <button onClick={()=>onNavigate('subjects')}>Subjects</button>
        <button onClick={()=>onNavigate('pyqs')}>PYQs</button>
        <button onClick={()=>onNavigate('pdfs')}>PDFs</button>
      </div>
    </header>
  )
}
