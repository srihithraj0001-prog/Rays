import React, {useState} from 'react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage(){
  const { register } = useAuth()
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirm,setConfirm] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)

  async function submit(e){
    e.preventDefault()
    setError(null)
    if(password !== confirm){ setError('Passwords do not match'); return }
    setLoading(true)
    const res = await register(name,email,password)
    setLoading(false)
    if(!res.success) setError(res.error?res.error.message:'Registration failed')
  }

  return (
    <div style={{maxWidth:480}}>
      <h2>Create account</h2>
      <form onSubmit={submit}>
        <label>Name<input value={name} onChange={e=> setName(e.target.value)} /></label>
        <label>Email<input value={email} onChange={e=> setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={e=> setPassword(e.target.value)} /></label>
        <label>Confirm Password<input type="password" value={confirm} onChange={e=> setConfirm(e.target.value)} /></label>
        <div style={{marginTop:8}}>
          <button disabled={loading}>{loading? 'Creating...':'Create account'}</button>
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  )
}
