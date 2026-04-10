import React, { useState } from 'react'
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Building2, 
  Edit2, 
  Save, 
  Settings,
  Bell,
  Trash2,
  AlertCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'

const Profile = () => {
  const { user, logout, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    phone: user?.phone || '',
    email: user?.email || '',
    role: user?.role || ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPass, setShowPass] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState('')

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await authService.updateProfile({
        name: formData.name,
        department: formData.department,
        phone: formData.phone
      })
      updateUser(response.data)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPassError('')
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassError('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setPassError('Password must be at least 6 characters')
      return
    }

    setPassLoading(true)
    try {
      await authService.changePassword(passwordData.oldPassword, passwordData.newPassword)
      alert('Password updated successfully!')
      setShowPasswordModal(false)
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPassError(err.response?.data?.detail || 'Failed to change password')
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin:0 }}>User Profile</h1>
          <p style={{ color: 'var(--text-light)' }}>Manage your personal account settings and security.</p>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="btn btn-secondary">
          {isEditing ? 'Cancel Edit' : <><Edit2 size={18} /> Edit Profile</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Column: Avatar & Quick Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <div style={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: 900,
                boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.2)'
              }}>
                {formData.name.charAt(0)}
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>{formData.name}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>{formData.role}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              {(formData.role === 'department') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                  <Building2 size={16} /> {formData.department}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                <Mail size={16} /> {formData.email}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} /> Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}><Bell size={18} /> Notifications</button>
               <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--error)' }} onClick={logout}><Trash2 size={18} /> Sign Out</button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <form className="card" onSubmit={handleUpdate} style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem' }}>Account Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    style={{ 
                      paddingLeft: '3rem', 
                      backgroundColor: !isEditing ? '#F3F4F6' : 'white',
                      cursor: !isEditing ? 'not-allowed' : 'text',
                      color: !isEditing ? '#6B7280' : '#111827'
                    }}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                </div>
              </div>
              <div>
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    disabled={true}
                    style={{ 
                      paddingLeft: '3rem', 
                      backgroundColor: '#F3F4F6',
                      cursor: 'not-allowed',
                      color: '#6B7280'
                    }}
                    value={formData.email}
                  />
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label>Institutional Role</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    disabled={true}
                    style={{ 
                      paddingLeft: '3rem', 
                      backgroundColor: '#F3F4F6',
                      cursor: 'not-allowed',
                      color: '#6B7280',
                      textTransform: 'capitalize'
                    }}
                    value={formData.role}
                  />
                  <Shield size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                </div>
              </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    style={{ 
                      paddingLeft: '3rem', 
                      backgroundColor: !isEditing ? '#F3F4F6' : 'white',
                      cursor: !isEditing ? 'not-allowed' : 'text',
                      color: !isEditing ? '#6B7280' : '#111827'
                    }}
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <Settings size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                </div>
              </div>
              {formData.role === 'department' && (
                <div>
                  <label>Department</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      style={{ 
                        paddingLeft: '3rem', 
                        backgroundColor: !isEditing ? '#F3F4F6' : 'white',
                        cursor: !isEditing ? 'not-allowed' : 'text',
                        color: !isEditing ? '#6B7280' : '#111827'
                      }}
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    />
                    <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
                style={{ width: '100%', padding: '1rem', borderRadius: '10px' }}
              >
                {loading ? 'Saving Changes...' : <><Save size={18} /> Update Profile</>}
              </button>
            )}
          </form>


          <div className="card">
             <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Security Settings</h3>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.925rem' }}>Account Password</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Change your password to keep your account secure.</p>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="btn btn-secondary"
                >
                  <Lock size={16} /> Update
                </button>
             </div>
             
             <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid var(--warning)', padding: '1rem', borderRadius: 'var(--radius)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <AlertCircle size={20} color="var(--warning)" />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>Two-Factor Authentication</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.4 }}>Add an extra layer of security to your account by enabling 2FA.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1.5rem'
        }}>
          <div className="card animate-in zoom-in duration-300" style={{ maxWidth: 400, width: '100%', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Update Password</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
              >
                <X size={24} />
              </button>
            </div>

            {passError && (
              <div style={{ padding: '0.75rem', background: '#FEF2F2', color: 'var(--error)', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <AlertCircle size={18} /> {passError}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPass ? "text" : "password"}
                    required
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPass ? "text" : "password"}
                    required
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPass ? "text" : "password"}
                    required
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={passLoading}
                >
                  {passLoading ? 'Updating...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
