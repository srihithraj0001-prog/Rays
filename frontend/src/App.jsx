import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import PYQBrowser from './components/PYQBrowser'
import PDFsPage from './components/PDFsPage'
import PracticeInterface from './components/PracticeInterface'
import { loadDemoData } from './utils/storage'

export default function App(){
  const [route, setRoute] = useState(window.location.hash.replace('#','') || 'dashboard')
  useEffect(()=>{
    const onHash = ()=> setRoute(window.location.hash.replace('#','') || 'dashboard')
    window.addEventListener('hashchange', onHash)
    return ()=> window.removeEventListener('hashchange', onHash)
  },[])

  useEffect(()=>{ loadDemoData() }, [])

  return (
    <div className="app">
      <Header />
      <div className="layout">
        <Sidebar route={route} setRoute={setRoute} />
        <main className="content">
          {route === 'dashboard' && <Dashboard />}
          {route === 'pyqs' && <PYQBrowser />}
          {route === 'pdfs' && <PDFsPage />}
          {route.startsWith('practice') && <PracticeInterface />}
          {route === 'about' && <div style={{padding:20}}>About / Admin demo</div>}
        </main>
      </div>
    </div>
  )
}
