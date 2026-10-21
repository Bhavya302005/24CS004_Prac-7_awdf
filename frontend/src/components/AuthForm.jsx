import React, { useState } from 'react'
import { login, register } from '../api'

function AuthForm({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let data
      if (isRegister) {
        data = await register(email, password)
      } else {
        data = await login(email, password)
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onLoginSuccess(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card card">
      <div className="auth-tabs">
        <button
          className={!isRegister ? 'tab-btn active' : 'tab-btn'}
          onClick={() => {
            setIsRegister(false)
            setError(null)
          }}
        >
          Login
        </button>
        <button
          className={isRegister ? 'tab-btn active' : 'tab-btn'}
          onClick={() => {
            setIsRegister(true)
            setError(null)
          }}
        >
          Register
        </button>
      </div>

      <h2>{isRegister ? 'Create an Account' : 'Welcome Back'}</h2>
      <p className="subtitle">
        {isRegister
          ? 'Enter your email and a password of at least 6 characters.'
          : 'Login with your credentials to manage your tasks.'}
      </p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default AuthForm
