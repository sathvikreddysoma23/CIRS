import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldPlus, User, Mail, Lock, Building2, UserCircle, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Engineering',
    secret_key: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(formData)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'department') navigate('/staff')
      else navigate('/student')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
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
      padding: '2rem 1.5rem'
    }} className="animate-in fade-in duration-500">
      <div className="card" style={{
        maxWidth: 500,
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '14px',
            background: 'var(--secondary-light)',
            color: 'var(--primary)',
            marginBottom: '0.75rem'
          }}>
            <ShieldPlus size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}>Join the Campus Resolution System</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#FEF2F2', color: 'var(--error)', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <UserCircle size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@univ.edu"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Role</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['student', 'department', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({...formData, role: r})}
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    background: formData.role === r ? 'var(--primary)' : 'var(--background)',
                    color: formData.role === r ? 'white' : 'var(--text-light)',
                    border: '1px solid var(--border)'
                  }}
                  className="hover-lift"
                >
                   {r === 'department' ? 'staff' : r}
                </button>
              ))}
            </div>
          </div>

          {formData.role !== 'student' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Department</label>
              <div style={{ position: 'relative' }}>
                <select
                  style={{ width: '100%', paddingLeft: '2.5rem', appearance: 'none' }}
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Hostel">Hostel Management</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Library">Library</option>
                  <option value="Security">Security</option>
                </select>
                <Building2 size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          {formData.role !== 'student' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Secret Key</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="Enter role security key"
                  required
                  value={formData.secret_key}
                  onChange={(e) => setFormData({...formData, secret_key: e.target.value})}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <ShieldPlus size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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
            {loading ? 'Processing...' : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
