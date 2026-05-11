import React, { useState, useEffect } from 'react'
import { 
  Filter, 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  ClipboardList,
  AlertTriangle,
  Loader2,
  MapPin,
  Calendar
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { complaintService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const AssignedIssues = () => {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchAssignedIssues = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (filter !== 'all') params.status = filter
      
      const response = await complaintService.list(params)
      setIssues(response.data.complaints)
    } catch (err) {
      console.error('Failed to fetch assigned issues:', err)
      setError('Could not fetch your assigned tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignedIssues()
  }, [filter])

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = (issue.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (issue.student_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (issue._id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="animate-in fade-in duration-500">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin:0 }}>Assigned Issues</h1>
          <p style={{ color: 'var(--text-light)' }}>Manage and resolve issues assigned to you.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn btn-secondary">
             <ClipboardList size={18} /> Export List
           </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 2 }}>
            <input 
              type="text" 
              placeholder="Search by title or student name..." 
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

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-light)' }}>Loading your tasks...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--background)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Issue & Student</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Location</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Priority</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length > 0 ? filteredIssues.map((issue) => (
                <tr key={issue._id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-lift">
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{issue.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>ID: #{issue._id.slice(-6).toUpperCase()} • {issue.student_name}</p>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{issue.location || 'N/A'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      fontSize: '0.75rem', 
                      color: (issue.priority === 'high' || issue.priority === 'critical') ? 'var(--error)' : 'var(--warning)', 
                      fontWeight: 600,
                      textTransform: 'capitalize' 
                    }}>
                      {(issue.priority === 'high' || issue.priority === 'critical') && <AlertTriangle size={14} />}
                      {issue.priority}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      background: issue.status === 'resolved' ? 'rgba(16, 185, 129, 0.1)' : issue.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: issue.status === 'resolved' ? 'var(--accent)' : issue.status === 'pending' ? 'var(--warning)' : 'var(--secondary)',
                    }}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Link to={`/staff/update/${issue._id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                        Update <ArrowRight size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <ClipboardList size={48} style={{ color: 'var(--border)' }} />
                    </div>
                    <h3 style={{ color: 'var(--text-light)', fontWeight: 500 }}>No assigned issues found matching your criteria.</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AssignedIssues
