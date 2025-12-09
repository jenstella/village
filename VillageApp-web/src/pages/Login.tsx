import { useState } from 'react'
import '../App.css'

type LoginProps = {
  onLogin: () => void
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="page" style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back</h1>
          <p className="page-subtitle">
            Log in to your Village Hub prototype. (No real auth yet.)
          </p>
        </div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="button" type="submit">
          Continue
        </button>
        <p className="page-subtitle">
          This is a clickable prototype: nothing is stored or sent.
        </p>
      </form>
    </div>
  )
}

export default Login

