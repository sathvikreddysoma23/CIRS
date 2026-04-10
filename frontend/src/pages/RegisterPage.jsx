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
    department: '',
    secret_key: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset sensitive fields if switching roles
      ...(name === 'role' && value === 'student' ? { secret_key: '', department: '' } : {}),
      ...(name === 'role' && value === 'admin' ? { department: '' } : {}),
      ...(name === 'role' && value === 'driver' ? { department: '' } : {})
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    try {
      // Clean data before sending
      const submissionData = { ...formData }
      if (submissionData.role === 'student') {
        delete submissionData.secret_key
        delete submissionData.department
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
      background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
      padding: '2rem'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: 520,
        width: '100%',
        padding: '2.5rem',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: '#eff6ff',
            color: '#2563EB',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.025em' }}>Create Account</h2>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>Access the CIRS Digital Infrastructure</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: '#fef2f2',
            color: '#dc2626',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            border: '1px solid #fee2e2'
          }}>
            <AlertCircle size={18} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginLeft: '0.25rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input name="name" type="text" placeholder="John Doe" required value={formData.name} onChange={handleInputChange} 
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
                <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginLeft: '0.25rem' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input name="phone" type="tel" placeholder="+91 98765..." required value={formData.phone} onChange={handleInputChange} 
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
                <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginLeft: '0.25rem' }}>University Email</label>
            <div style={{ position: 'relative' }}>
              <input name="email" type="email" placeholder="student@university.edu" required value={formData.email} onChange={handleInputChange} 
                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginLeft: '0.25rem' }}>System Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.875rem', backgroundColor: '#fff', outline: 'none' }}>
                  <option value="student">Student</option>
                  <option value="department">Staff/Faculty</option>
                  <option value="driver">Bus Driver</option>
                  <option value="admin">Administrator</option>
                </select>
             </div>
             
             {formData.role === 'department' && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginLeft: '0.25rem' }}>Department</label>
                  <select name="department" value={formData.department} required onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.875rem', backgroundColor: '#fff', outline: 'none' }}>
                    <option value="">Select Dept</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="transportation">Transportation</option>
                    <option value="security">Security</option>
                  </select>
               </div>
             )}

             {formData.role === 'admin' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginLeft: '0.25rem' }}>System Key</label>
                  <input name="secret_key" type="password" placeholder="Admin PIN" required value={formData.secret_key} onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
                </div>
             )}
          </div>

          {formData.role === 'department' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginLeft: '0.25rem' }}>Staff Verification Key</label>
              <input name="secret_key" type="password" placeholder="Enter staff secret key" required value={formData.secret_key} onChange={handleInputChange} 
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
            </div>
          )}

          {formData.role === 'driver' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginLeft: '0.25rem' }}>Driver Verification Key</label>
              <input name="secret_key" type="password" placeholder="Enter driver secret key" required value={formData.secret_key} onChange={handleInputChange} 
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginLeft: '0.25rem' }}>Account Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleInputChange} 
                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              fontSize: '0.9375rem', 
              fontWeight: 700,
              borderRadius: '12px', 
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account? <Link to="/login" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
export default RegisterPage


