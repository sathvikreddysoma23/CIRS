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
  ExternalLink
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { complaintService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const IssueDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
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
    // In a real app, this would be an API call to save the comment
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
          <p style={{ color: 'var(--text-light)' }}>Issue #{issue._id.slice(-8).toUpperCase()}</p>
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
              Resolution Notes & AI Analysis
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              {issue.resolution_note ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--secondary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {issue.assigned_department ? issue.assigned_department[0] : 'D'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '0 12px 12px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{issue.assigned_department} Staff</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Resolved Note</span>
                      </div>
                      <p style={{ fontSize: '0.875rem' }}>{issue.resolution_note}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1.5rem', background: 'var(--background)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    {issue.status === 'pending' ? 'Issue is waiting for review.' : 'Staff is currently working on this issue.'}
                  </p>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.8 }}>
                  <div style={{ padding: '0.25rem 0.5rem', background: 'var(--secondary-light)', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)' }}>AI CLASSIFIER</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    Identified Category: <strong style={{ color: 'var(--primary)' }}>{issue.ai_category}</strong> with {Math.round(issue.ai_confidence * 100)}% confidence.
                  </p>
                </div>
              </div>
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
              <ClipboardList size={18} /> Resolution Timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'var(--border)' }}></div>

              {/* Submission Entry (Initial) */}
              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Ticket Created</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{new Date(issue.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Dynamic History */}
              {issue.status_history && issue.status_history.map((h, i) => {
                const stepStatus = getStatusInfo(h.status)
                return (
                  <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'white',
                      border: `2px solid ${stepStatus.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stepStatus.color
                    }}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>{stepStatus.text}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{new Date(h.updated_at).toLocaleString()}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', fontStyle: 'italic' }}>{h.note}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Support Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Handled By</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{issue.assigned_to ? 'Staff Member' : 'System AI'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Department</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{issue.assigned_department || issue.category || 'Triage'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueDetails
