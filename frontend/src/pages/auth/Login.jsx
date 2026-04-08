import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'department') navigate('/staff')
      else navigate('/student')
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'department') navigate('/staff')
      else navigate('/student')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      padding: '1.5rem'
    }} className="animate-in fade-in duration-500">
      <div className="card" style={{
        maxWidth: 420,
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: 'var(--secondary-light)',
            color: 'var(--primary)',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={36} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>CIRS Login</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Campus Issue Resolution System</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            background: '#FEF2F2',
            color: 'var(--error)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>University Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="uXXXX@university.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
               Tip: use 'admin@university.edu' for admin role, 'staff@university.edu' for staff.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
              <a href="#" style={{ fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 500 }}>Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '1rem' }}
          >
            {loading ? 'Authenticating...' : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
            New user? <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
