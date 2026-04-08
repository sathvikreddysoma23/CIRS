import React, { useState, useEffect } from 'react'
import { 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Building2,
  Calendar,
  AlertTriangle,
  ClipboardList,
  Loader2,
  UserPlus,
  X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { complaintService, adminService } from '../../services/api'

const AllIssues = () => {
  const [issues, setIssues] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  
  // Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [assigning, setAssigning] = useState(false)

  const fetchAllIssues = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter !== 'all') params.status = filter
      if (deptFilter !== 'All') params.category = deptFilter.toLowerCase()
      
      const response = await complaintService.list(params)
      setIssues(response.data.complaints)
    } catch (err) {
      console.error('Failed to fetch all issues:', err)
      setError('Could not load system-wide issues.')
    } finally {
      setLoading(false)
    }
  }

  const fetchStaff = async () => {
    try {
      const response = await adminService.listUsers({ role: 'department' })
      setStaff(response.data.users)
    } catch (err) {
      console.error('Failed to fetch staff:', err)
    }
  }

  useEffect(() => {
    fetchAllIssues()
  }, [filter, deptFilter])

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleOpenAssign = (issue) => {
    setSelectedIssue(issue)
    // Pre-select first staff of the same department if possible
    const sameDeptStaff = staff.find(s => s.department?.toLowerCase() === issue.category?.toLowerCase())
    setSelectedStaffId(sameDeptStaff ? sameDeptStaff._id : (staff[0]?._id || ''))
    setShowAssignModal(true)
  }

  const handleAssign = async () => {
    if (!selectedStaffId || !selectedIssue) return
    setAssigning(true)
    try {
      await complaintService.assign(selectedIssue._id, selectedStaffId)
      setShowAssignModal(false)
      fetchAllIssues() // Refresh list
      alert('Issue assigned successfully!')
    } catch (err) {
      console.error('Assignment failed:', err)
      alert('Failed to assign issue. Please try again.')
    } finally {
      setAssigning(false)
    }
  }

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          issue._id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const departments = ['All', 'Infrastructure', 'Hostel', 'Healthcare', 'Transport', 'Housekeeping', 'Maintenance', 'Canteen', 'IT Support']

  return (
    <div className="animate-in fade-in duration-500">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin:0 }}>System-wide Issues</h1>
          <p style={{ color: 'var(--text-light)' }}>Monitor and assign all issues across the entire campus ecosystem.</p>
        </div>
        <button className="btn btn-primary">
          <ClipboardList size={18} /> Export Records
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 2 }}>
              <input 
                type="text" 
                placeholder="Search by title, student or ID..." 
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
                    padding: '0.625rem 1rem', 
                    borderRadius: '20px', 
                    fontSize: '0.875rem', 
                    fontWeight: 700,
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
             <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building2 size={16} /> Department:</span>
             <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
               {departments.map((d) => (
                 <button 
                  key={d}
                  onClick={() => setDeptFilter(d)}
                  style={{ 
                    whiteSpace: 'nowrap',
                    padding: '0.4rem 1rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    transition: 'var(--transition)',
                    background: deptFilter === d ? 'var(--secondary)' : 'transparent',
                    color: deptFilter === d ? 'white' : 'var(--text-light)',
                    border: `1px solid ${deptFilter === d ? 'var(--secondary)' : 'var(--border)'}`,
                  }}
                  className="hover-lift"
                >
                  {d}
                </button>
               ))}
             </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-light)' }}>Loading system issues...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--background)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Issue Details</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Department</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length > 0 ? filteredIssues.map((issue) => (
                <tr key={issue._id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-lift">
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '10px', 
                        background: (issue.priority === 'high' || issue.priority === 'critical') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 58, 138, 0.05)',
                        color: (issue.priority === 'high' || issue.priority === 'critical') ? 'var(--error)' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Shield size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '0.925rem', marginBottom: '0.25rem' }}>{issue.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          ID: #{issue._id.slice(-6).toUpperCase()} • Student: {issue.student_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      background: issue.status === 'resolved' ? 'rgba(16, 185, 129, 0.1)' : issue.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: issue.status === 'resolved' ? 'var(--accent)' : issue.status === 'pending' ? 'var(--warning)' : 'var(--secondary)',
                    }}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'capitalize' }}>
                    {issue.category}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      {issue.status === 'pending' && (
                        <button 
                          onClick={() => handleOpenAssign(issue)}
                          className="btn btn-primary" 
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', gap: '0.4rem' }}
                        >
                          <UserPlus size={14} /> Assign
                        </button>
                      )}
                      <Link to={`/student/issue/${issue._id}`} className="btn btn-secondary" style={{ padding: '0.5rem', border: '1px solid var(--border)' }}>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-light)' }}>
                    No system-wide issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedIssue && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card animate-in scale-in duration-300" style={{ maxWidth: 450, width: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>Assign Handler</h3>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-light)' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius)' }}>
               <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>{selectedIssue.title}</h4>
               <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Category: {selectedIssue.category}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Select Staff Member</label>
              <select 
                style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem' }}
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
              >
                {staff.length > 0 ? (
                  staff.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.department || 'No Dept'})
                    </option>
                  ))
                ) : (
                  <option value="">No staff accounts found</option>
                )}
              </select>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>The staff member will receive a notification immediately upon assignment.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleAssign}
                disabled={assigning || !selectedStaffId}
              >
                {assigning ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllIssues

