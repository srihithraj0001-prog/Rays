import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import SubjectsList from './components/SubjectsList'
import PYQBrowser from './components/PYQBrowser'
import PDFsPage from './components/PDFsPage'
import PracticeInterface from './components/PracticeInterface'
import { loadSyllabus } from './data/syllabus'

export default function App(){
  const [page, setPage] = useState('home')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const syllabus = loadSyllabus()

  useEffect(()=>{
    document.title = 'Rays — JEE Prep'
  },[])

  return (
    <div className="app-root">
      <Header onNavigate={setPage} />
      <div className="app-body">
        <Sidebar onNavigate={setPage} />
        <main className="content">
          {page==='home' && <Dashboard onOpenSubject={(sub)=>{setSelectedSubject(sub); setPage('subjects')}} />}
          {page==='subjects' && <SubjectsList syllabus={syllabus} onOpenChapter={()=>setPage('chapter')} />}
          {page==='pyqs' && <PYQBrowser onStartPractice={()=>setPage('practice')} />}
          {page==='pdfs' && <PDFsPage />}
          {page==='practice' && <PracticeInterface />}
          {/* Simple admin/demo page could go here */}
        </main>
      </div>
    </div>
  )
}
