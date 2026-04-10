import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  User,
  MessageSquare,
  FileText,
  MapPin,
  Calendar,
  AlertTriangle,
  ClipboardList,
  Loader2,
  Shield,
  ExternalLink,
  Image as ImageIcon // Alias Image to ImageIcon to match previous usage correctly
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { complaintService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const StatusStepper = ({ currentStatus }) => {
  const stages = [
    { id: 'raised', label: 'Issue Raised', icon: <FileText size={18} /> },
    { id: 'pending', label: 'Pending', icon: <Clock size={18} /> },
    { id: 'assigned', label: 'Assigned', icon: <User size={18} /> },
    { id: 'in_progress', label: 'In Progress', icon: <ClipboardList size={18} /> },
    { id: 'resolved', label: 'Solved', icon: <CheckCircle size={18} /> }
  ]

  const getStatusIndex = (status) => {
    switch (status) {
      case 'pending': return 1
      case 'assigned': return 2
      case 'in_progress': return 3
      case 'resolved': return 4
      case 'closed': return 4
      default: return 0
    }
  }

  const currentIndex = getStatusIndex(currentStatus)

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Clock size={20} color="var(--secondary)" />
        Issue Tracking
      </h3>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        position: 'relative',
        padding: '0 1rem'
      }}>
        {/* Connection Lines */}
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '2rem', 
          right: '2rem', 
          height: '2px', 
          background: 'var(--border)', 
          zIndex: 0 
        }}>
          <div style={{ 
            height: '100%', 
            background: 'var(--secondary)', 
            width: `${(currentIndex / (stages.length - 1)) * 100}%`,
            transition: 'width 0.5s ease'
          }}></div>
        </div>

        {stages.map((stage, index) => {
          const isActive = index <= currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <div key={stage.id} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              zIndex: 1,
              position: 'relative'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: isActive ? 'var(--secondary)' : 'white', 
                border: `2px solid ${isActive ? 'var(--secondary)' : 'var(--border)'}`,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: isActive ? 'white' : 'var(--text-light)',
                transition: 'all 0.3s ease',
                boxShadow: isCurrent ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none'
              }}>
                {stage.icon}
              </div>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: isActive ? 700 : 500, 
                marginTop: '0.75rem',
                color: isActive ? 'var(--primary)' : 'var(--text-light)',
                textAlign: 'center',
                maxWidth: '60px'
              }}>
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const IssueDetails = () => {
  const { id } = useParams()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comment, setComment] = useState('')

  const fetchIssueDetails = async () => {
    setLoading(true)
    try {
      const response = await complaintService.detail(id)
      setIssue(response.data)
    } catch (err) {
      console.error('Error fetching issue:', err)
      setError('Issue not found or access denied.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchIssueDetails()
  }, [id])

  const handleSendComment = (e) => {
    e.preventDefault()
    if (!comment) return
    console.log('Sending comment:', comment)
    setComment('')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-light)' }}>Loading issue details...</p>
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <AlertCircle size={48} style={{ color: 'var(--error)', marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{error || 'Issue Not Found'}</h2>
        <Link to="/student/my-issues" className="btn btn-secondary">Back to My Issues</Link>
      </div>
    )
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'resolved': return { color: 'var(--accent)', bg: 'rgba(16, 185, 129, 0.1)', text: 'Resolved' }
      case 'pending': return { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)', text: 'Pending' }
      case 'assigned': return { color: 'var(--secondary)', bg: 'rgba(59, 130, 246, 0.1)', text: 'Assigned' }
      case 'in_progress': return { color: 'var(--secondary)', bg: 'rgba(59, 130, 246, 0.1)', text: 'In Progress' }
      case 'closed': return { color: 'var(--text-light)', bg: 'rgba(107, 114, 128, 0.1)', text: 'Closed' }
      case 'rejected': return { color: 'var(--error)', bg: 'rgba(239, 68, 68, 0.1)', text: 'Rejected' }
      default: return { color: 'var(--text-light)', bg: 'rgba(107, 114, 128, 0.1)', text: status }
    }
  }

  const statusInfo = getStatusInfo(issue.status)

  return (
    <div className="animate-in fade-in duration-500">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/student/my-issues" style={{ color: 'var(--text-light)' }}><ArrowLeft size={24} /></Link>
        <div>
          <h1 className="title" style={{ margin: 0 }}>Issue Details</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <p style={{ color: 'var(--text-light)' }}>Issue #{issue._id.slice(-8).toUpperCase()}</p>
            <span style={{ 
              fontSize: '0.75rem', 
              padding: '0.125rem 0.5rem', 
              background: 'var(--background)', 
              borderRadius: '4px',
              color: 'var(--text-light)'
            }}>
              {issue.status}
            </span>
          </div>
        </div>
      </div>

      <StatusStepper currentStatus={issue.status} />

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
                  background: statusInfo.bg,
                  color: statusInfo.color,
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}>
                  {statusInfo.text}
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

              {issue.image_urls && issue.image_urls.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ImageIcon size={16} /> Evidence ({issue.image_urls.length})
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {issue.image_urls.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={{ position: 'relative' }}>
                        <img
                          src={url}
                          alt={`Evidence ${idx + 1}`}
                          style={{
                            width: 120,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 5,
                          right: 5,
                          background: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          padding: '2px',
                          borderRadius: '4px'
                        }}>
                          <ExternalLink size={12} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MessageSquare size={20} color="var(--primary)" />
              Resolution Notes & Status Updates
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              {issue.status_history && issue.status_history.length > 0 ? (
                issue.status_history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ 
                      width: 40, height: 40, 
                      background: 'var(--secondary-light)', 
                      color: 'var(--primary)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      <User size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '0 12px 12px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Status: {h.status.replace('_', ' ')}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{new Date(h.updated_at).toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: '0.875rem' }}>{h.note || 'No additional notes provided.'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1.5rem', background: 'var(--background)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    {issue.status === 'pending' ? 'Issue is waiting for review.' : 'No status updates yet.'}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Ask for an update..."
                style={{ flex: 1 }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} /> Admin Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Assigned Staff</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{issue.assigned_to ? 'Department Specialist' : 'Not yet assigned'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Department</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{issue.assigned_department || 'General Admin'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
             <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Need Help?</h3>
             <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
               If you have urgent questions regarding this issue, please contact the campus support desk.
             </p>
             <button className="btn btn-secondary" style={{ width: '100%' }}>Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueDetails
