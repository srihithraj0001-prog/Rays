import React from 'react'

export default function Sidebar({onNavigate}){
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li onClick={()=>onNavigate('home')}>Dashboard</li>
          <li onClick={()=>onNavigate('subjects')}>Subjects</li>
          <li onClick={()=>onNavigate('pyqs')}>PYQs</li>
          <li onClick={()=>onNavigate('pdfs')}>PDF Library</li>
          <li onClick={()=>onNavigate('practice')}>Practice</li>
        </ul>
      </nav>
    </aside>
  )
}
