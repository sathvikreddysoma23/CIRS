import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, User, Phone, GraduationCap, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
    department: 'General'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your inputs.')
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
        maxWidth: 520,
        width: '100%',
        padding: '3rem 2.5rem',
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Join the Network</h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Create your institutional profile</p>
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
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input name="name" type="text" placeholder="Authorized Personnel" required onChange={handleInputChange} 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '0.875rem' }} />
              <User size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>University Email</label>
            <div style={{ position: 'relative' }}>
              <input name="email" type="email" placeholder="user@university.edu" required onChange={handleInputChange} 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '0.875rem' }} />
              <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Role</label>
                <select name="role" required onChange={handleInputChange} 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '0.875rem' }}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff</option>
                </select>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Status Set</label>
                <div style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', background: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#6B7280' }}>
                  Standard
                </div>
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Account Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type="password" placeholder="••••••••" required onChange={handleInputChange} 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '0.875rem' }} />
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
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Registration'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Access authorized? <Link to="/login" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Login to System</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage


