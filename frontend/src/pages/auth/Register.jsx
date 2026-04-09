import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldPlus, User, Mail, Lock, Building2, UserCircle, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
    department: '',
    secret_key: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      // Clean up data based on role
      const submissionData = { ...formData }
      if (submissionData.role === 'student') {
        submissionData.department = ""
        submissionData.secret_key = ""
      } else if (submissionData.role === 'admin') {
        submissionData.department = ""
      }

      await register(submissionData)
      navigate('/login?msg=registered')
    } catch (err) {
      console.error('Registration error detail:', err.response?.data)
      const detail = err.response?.data?.detail
      const errors = err.response?.data?.errors
      
      if (Array.isArray(errors)) {
        setError(errors.map(e => `${e.loc[e.loc.length-1]}: ${e.msg}`).join(', '))
      } else {
        setError(detail || 'Registration failed. Please check your inputs.')
      }
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
      backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      padding: '2rem 1.5rem'
    }} className="animate-in fade-in duration-500">
      <div className="card" style={{
        maxWidth: 500,
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
        background: 'white',
        borderRadius: '20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '14px',
            background: '#f1f5f9',
            color: '#2563eb',
            marginBottom: '0.75rem'
          }}>
            <ShieldPlus size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>Join CIRS</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Create your institutional profile</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#FEF2F2', color: '#dc2626', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #fee2e2' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}
              />
              <UserCircle size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@univ.edu"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                />
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Phone</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder="9876543210"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                />
                <ShieldPlus size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Role</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { label: 'Student', val: 'student' },
                { label: 'Staff', val: 'department' },
                { label: 'Admin', val: 'admin' }
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setFormData({...formData, role: r.val, secret_key: '', department: ''})}
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: formData.role === r.val ? '#2563eb' : '#fff',
                    color: formData.role === r.val ? 'white' : '#64748b',
                    border: '1px solid' + (formData.role === r.val ? '#2563eb' : '#e2e8f0'),
                    cursor: 'pointer'
                  }}
                >
                   {r.label}
                </button>
              ))}
            </div>
          </div>

          {formData.role === 'department' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Department</label>
              <div style={{ position: 'relative' }}>
                <select
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', appearance: 'none', background: '#fff' }}
                  value={formData.department}
                  required
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="transportation">Transportation</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="security">Security</option>
                </select>
                <Building2 size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          {formData.role !== 'student' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Secret Key</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="Verification Key"
                  required
                  value={formData.secret_key}
                  onChange={(e) => setFormData({...formData, secret_key: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                />
                <ShieldPlus size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}
              />
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '0.875rem', 
              fontSize: '1rem',
              fontWeight: 700,
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? 'Processing...' : (
              <>
                Confirm Registration <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Already registered? <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Register
