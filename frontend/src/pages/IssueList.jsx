import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreVertical, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { complaintService } from '../services/api'

const IssueList = () => {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock issues
    setIssues([
      { id: 'CIRS-001', title: 'Water Leakage in Block A', category: 'Maintenance', status: 'Pending', priority: 'High', date: '2024-04-06', reporter: 'John Doe' },
      { id: 'CIRS-002', title: 'Bus Timing Delay', category: 'Transport', status: 'In Progress', priority: 'Medium', date: '2024-04-05', reporter: 'Jane Smith' },
      { id: 'CIRS-003', title: 'Library AC Not Working', category: 'Infrastructure', status: 'Resolved', priority: 'High', date: '2024-04-04', reporter: 'Bob Brown' },
      { id: 'CIRS-004', title: 'Wifi Connectivity Issues', category: 'IT Support', status: 'Pending', priority: 'Low', date: '2024-04-04', reporter: 'Alice Green' },
      { id: 'CIRS-005', title: 'Lab Equipment Maintenance', category: 'Academic', status: 'In Progress', priority: 'Medium', date: '2024-04-03', reporter: 'Charlie Davis' },
    ])
    setLoading(false)
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ marginBottom: '0.25rem' }}>Issue Management</h1>
          <p style={{ color: 'var(--text-light)' }}>Monitor, assign, and resolve campus concerns.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Report New Issue
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <input type="text" placeholder="Search by title, ID, or reporter..." style={{ width: '100%', paddingLeft: '2.5rem' }} />
            <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <select style={{ minWidth: '150px' }}>
            <option>All Categories</option>
            <option>Maintenance</option>
            <option>Transport</option>
            <option>IT Support</option>
            <option>Security</option>
          </select>
          <select style={{ minWidth: '150px' }}>
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--background)' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Issue ID</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Concern / Title</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Reporter</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Priority</th>
              <th style={{ textAlign: 'center', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} style={{ borderTop: '1px solid var(--border)', transition: 'var(--transition)' }} className="table-row">
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, fontSize: '0.8125rem', color: 'var(--secondary)' }}>{issue.id}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{issue.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{issue.category} • {issue.date}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>{issue.reporter}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: issue.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : issue.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: issue.status === 'Resolved' ? 'var(--accent)' : issue.status === 'Pending' ? 'var(--warning)' : 'var(--secondary)',
                  }}>
                    {issue.status === 'Resolved' ? <CheckCircle size={14} /> : issue.status === 'Pending' ? <Clock size={14} /> : <AlertTriangle size={14} />}
                    {issue.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                    backgroundColor: issue.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : issue.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                    color: issue.priority === 'High' ? 'var(--error)' : issue.priority === 'Medium' ? 'var(--warning)' : 'var(--text-light)',
                  }}>
                    {issue.priority}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                  <button style={{ color: 'var(--text-light)', padding: '0.25rem' }}><MoreVertical size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Showing 5 of 156 issues</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled>Previous</button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueList
