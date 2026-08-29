import React, {useState} from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage(){
  const { login } = useAuth()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)

  async function submit(e){
    e.preventDefault()
    setLoading(true); setError(null)
    const res = await login(email,password)
    setLoading(false)
    if(!res.success) setError(res.error?res.error.message:'Login failed')
  }

  return (
    <div style={{maxWidth:400}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Email<input value={email} onChange={e=> setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={e=> setPassword(e.target.value)} /></label>
        <div style={{marginTop:8}}>
          <button disabled={loading}>{loading? 'Logging in...':'Login'}</button>
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  )
}
