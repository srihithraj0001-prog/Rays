import React from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import PYQBrowser from './components/PYQBrowser'
import PDFsPage from './components/PDFsPage'
import PracticeInterface from './components/PracticeInterface'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppInner(){
  const { user, loading } = useAuth()
  const [route, setRoute] = React.useState(window.location.hash.replace('#','') || 'dashboard')
  React.useEffect(()=>{
    const onHash = ()=> setRoute(window.location.hash.replace('#','') || 'dashboard')
    window.addEventListener('hashchange', onHash)
    return ()=> window.removeEventListener('hashchange', onHash)
  },[])

  // protected routes list
  const protectedRoutes = ['dashboard','practice','bookmarks','analytics']
  if(!loading && protectedRoutes.includes(route) && !user){ window.location.hash = 'login'; return null }

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
          {route === 'login' && <LoginPage />}
          {route === 'register' && <RegisterPage />}
          {route === 'about' && <div style={{padding:20}}>About / Admin demo</div>}
        </main>
      </div>
    </div>
  )
}

export default function App(){
  return <AuthProvider><AppInner /></AuthProvider>
}
