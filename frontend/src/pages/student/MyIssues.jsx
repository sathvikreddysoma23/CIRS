import React, { useState, useEffect } from 'react'
import { 
  Filter, 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  Plus,
  Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { complaintService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const MyIssues = () => {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchIssues = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter !== 'all') params.status = filter
      
      const response = await complaintService.list(params)
      setIssues(response.data.complaints)
    } catch (err) {
      console.error('Failed to fetch issues:', err)
      setError('Could not load your issues. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [filter])

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'var(--accent)'
      case 'pending': return 'var(--warning)'
      case 'assigned': return 'var(--secondary)'
      case 'in_progress': return 'var(--secondary)'
      case 'closed': return 'var(--text-light)'
      default: return 'var(--text-light)'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'resolved': return 'rgba(16, 185, 129, 0.1)'
      case 'pending': return 'rgba(245, 158, 11, 0.1)'
      case 'assigned': return 'rgba(59, 130, 246, 0.1)'
      case 'in_progress': return 'rgba(59, 130, 246, 0.1)'
      case 'closed': return 'rgba(107, 114, 128, 0.1)'
      default: return 'rgba(107, 114, 128, 0.1)'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'var(--error)'
      case 'high': return 'var(--error)'
      case 'medium': return 'var(--warning)'
      case 'low': return 'var(--accent)'
      default: return 'var(--secondary)'
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-500">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin:0 }}>My Submitted Issues</h1>
          <p style={{ color: 'var(--text-light)' }}>View and track the status of your reported problems.</p>
        </div>
        <Link to="/student/raise-issue" className="btn btn-primary">
          <Plus size={18} />
          Raise New Issue
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 2 }}>
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              style={{ width: '100%', paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'resolved', label: 'Resolved' }
            ].map((f) => (
              <button 
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.875rem', 
                  fontWeight: 600,
                  transition: 'var(--transition)',
                  background: filter === f.id ? 'var(--primary)' : 'var(--background)',
                  color: filter === f.id ? 'white' : 'var(--text-light)',
                }}
                className="hover-lift"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#FEF2F2', color: 'var(--error)', borderRadius: 'var(--radius)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-light)' }}>Fetching your issues...</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredIssues.map((issue) => (
            <div key={issue._id} className="card hover-lift" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative',
              borderTop: `4px solid ${getPriorityColor(issue.priority)}`
            }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <button style={{ color: 'var(--text-light)' }}><MoreVertical size={18} /></button>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.625rem', 
                    fontWeight: 700, 
                    background: 'var(--background)',
                    color: 'var(--text-light)',
                    textTransform: 'uppercase'
                  }}>
                    {issue.category}
                  </span>
                  <span style={{ 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.625rem', 
                    fontWeight: 700, 
                    background: getStatusBg(issue.status),
                    color: getStatusColor(issue.status),
                    textTransform: 'uppercase'
                  }}>
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary)' }}>{issue.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                  Ref ID: #{issue._id.slice(-6).toUpperCase()}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.75rem' }}>
                  <Clock size={14} />
                  <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                </div>
                <Link to={`/student/issue/${issue._id}`} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: 'var(--secondary)' 
                }}>
                  Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}

          {filteredIssues.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <Search size={48} style={{ color: 'var(--border)' }} />
              </div>
              <h3 style={{ color: 'var(--text-light)', fontWeight: 500 }}>No issues found matching your criteria.</h3>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MyIssues
