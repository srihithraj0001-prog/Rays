import React, {createContext, useContext, useEffect, useState} from 'react'

const AuthContext = createContext()

export function AuthProvider({children}){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ refreshUser() }, [])

  async function refreshUser(){
    setLoading(true)
    try{
      const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/auth/me', { credentials: 'include' })
      const json = await res.json()
      if(json.success && json.data && json.data.user){ setUser(json.data.user) } else setUser(null)
    }catch(e){ setUser(null) }
    finally{ setLoading(false) }
  }

  async function login(email,password){
    const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}), credentials:'include' })
    const json = await res.json()
    if(json.success) setUser(json.data.user)
    return json
  }

  async function register(name,email,password){
    const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name,email,password}), credentials:'include' })
    const json = await res.json()
    if(json.success) setUser(json.data.user)
    return json
  }

  async function logout(){
    await fetch((import.meta.env.VITE_API_URL || '/api') + '/auth/logout', { method:'POST', credentials:'include' })
    setUser(null)
  }

  return <AuthContext.Provider value={{user,loading,login,register,logout,refreshUser}}>{children}</AuthContext.Provider>
}

export function useAuth(){ return useContext(AuthContext) }
