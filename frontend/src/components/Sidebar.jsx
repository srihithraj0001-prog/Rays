import React from 'react'

export default function Sidebar({route}){
  const links = [
    ['dashboard','Dashboard'],
    ['pyqs','PYQs'],
    ['pdfs','PDFs'],
    ['practice','Practice'],
    ['about','About']
  ]
  return (
    <aside className="sidebar">
      <div style={{marginBottom:16}}><strong>Rays</strong></div>
      {links.map(l=> (
        <a key={l[0]} className={"navlink "+(route===l[0]? 'active':'')} href={'#'+l[0]}>{l[1]}</a>
      ))}
    </aside>
  )
}
