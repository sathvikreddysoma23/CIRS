import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
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
      background: 'linear-gradient(135deg, #111827 0%, #2563EB 100%)',
      padding: '2rem'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: 420,
        width: '100%',
        padding: '3rem 2rem',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            borderRadius: '12px',
            background: '#eff6ff',
            color: '#2563EB',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Digital Portal</h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Secure system authorization</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: '#fee2e2',
            color: '#ef4444',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>University Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="university@email.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.875rem'
                }}
              />
              <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>System Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.875rem'
                }}
              />
              <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              fontSize: '0.9375rem', 
              borderRadius: '10px', 
              backgroundColor: '#2563EB',
              color: 'white',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Identity'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            New user? <Link to="/register" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Initialize Access</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

