import React from 'react'
import DarkModeToggle from './DarkModeToggle'

export default function Header(){
  return (
    <header className="header">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <strong>Rays</strong>
        <input placeholder="Search..." onFocus={()=> window.location.hash='pyqs'} />
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <DarkModeToggle />
        <div>Profile</div>
      </div>
    </header>
  )
}
