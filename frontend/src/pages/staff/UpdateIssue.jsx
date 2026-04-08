import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Image as ImageIcon,
  User,
  Shield,
  MapPin,
  Calendar,
  AlertTriangle,
  History,
  Loader2
} from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { complaintService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const UpdateIssue = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [issue, setIssue] = useState(null)
  const [status, setStatus] = useState('pending')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  const fetchIssue = async () => {
    setLoading(true)
    try {
      const response = await complaintService.detail(id)
      setIssue(response.data)
      setStatus(response.data.status)
    } catch (err) {
      console.error('Error fetching task details:', err)
      setError('Task not found or access denied.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssue()
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setError('')
    try {
      await complaintService.updateStatus(id, status, comment)
      navigate('/staff/assigned')
    } catch (err) {
      console.error('Update failed:', err)
      setError(err.response?.data?.detail || 'Failed to update issue status.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-light)' }}>Fetching task details...</p>
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <AlertCircle size={48} style={{ color: 'var(--error)', marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{error || 'Task Not Found'}</h2>
        <Link to="/staff/assigned" className="btn btn-secondary">Back to Tasks</Link>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/staff/assigned" style={{ color: 'var(--text-light)' }}><ArrowLeft size={24} /></Link>
        <div>
          <h1 className="title" style={{ margin:0 }}>Update Issue</h1>
          <p style={{ color: 'var(--text-light)' }}>Issue #{issue._id.slice(-8).toUpperCase()} • Detailed View</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  background: 'var(--background)', 
                  color: 'var(--secondary)',
                  marginBottom: '1rem',
                  display: 'inline-block',
                  textTransform: 'capitalize'
                }}>
                  {issue.category}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>{issue.title}</h2>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {new Date(issue.created_at).toLocaleDateString()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {issue.location || 'Not Specified'}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.875rem', 
                  fontWeight: 700, 
                  background: 'rgba(245, 158, 11, 0.1)', 
                  color: 'var(--warning)',
                  display: 'inline-block',
                  marginBottom: '0.5rem',
                  textTransform: 'capitalize'
                }}>
                  {issue.status.replace('_', ' ')}
                </span>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  justifyContent: 'flex-end', 
                  fontSize: '0.875rem', 
                  color: (issue.priority === 'high' || issue.priority === 'critical') ? 'var(--error)' : 'var(--text-light)',
                  textTransform: 'capitalize'
                }}>
                  <AlertTriangle size={16} /> {issue.priority} Priority
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Description</h3>
              <p style={{ lineHeight: 1.6, color: 'var(--text)', marginBottom: '2rem' }}>
                {issue.description}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <History size={20} color="var(--primary)" />
              Update Progress
            </h3>
            
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Change Status</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[
                    { id: 'pending', label: 'Pending' },
                    { id: 'in_progress', label: 'In Progress' },
                    { id: 'resolved', label: 'Resolved' }
                  ].map((s) => (
                    <button 
                      key={s.id}
                      type="button"
                      onClick={() => setStatus(s.id)}
                      style={{ 
                        flex: 1,
                        padding: '0.75rem', 
                        borderRadius: 'var(--radius)', 
                        fontSize: '0.875rem', 
                        fontWeight: 600,
                        transition: 'var(--transition)',
                        background: status === s.id ? 'var(--primary)' : 'var(--background)',
                        color: status === s.id ? 'white' : 'var(--text-light)',
                        border: '1px solid var(--border)'
                      }}
                      className="hover-lift"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Official Resolution Note</label>
                <textarea 
                  required 
                  rows={4} 
                  placeholder="Provide an update on the resolution progress..." 
                  style={{ width: '100%', resize: 'none' }}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              {error && (
                <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
                disabled={updating}
              >
                {updating ? 'Updating Status...' : (
                  <>
                    <CheckCircle size={18} />
                    Update Issue
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Student Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}>
                  {issue.student_name ? issue.student_name.charAt(0) : 'S'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{issue.student_name || 'Anonymous Student'}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>University Student</p>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Email Address</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{issue.student_email || 'Not available'}</p>
                </div>
              </div>
              
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <MessageSquare size={16} /> Chat Available Soon
              </button>
            </div>
          </div>

          <div className="card" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--secondary)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Shield size={18} /> Department Policy
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
              Standard resolution time for IT issues is 24-48 hours. Please update the student regularly to maintain satisfaction levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateIssue
