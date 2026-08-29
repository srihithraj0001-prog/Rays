import React from 'react'
import DarkModeToggle from './DarkModeToggle'

export default function Header(){
  return (
    <header className="header">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <strong>Rays</strong>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <DarkModeToggle />
        <div>Profile</div>
      </div>
    </header>
  )
}
