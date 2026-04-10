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
  X,
  FileText,
  User,
  History,
  Activity,
  Image as ImageIcon,
  UserCog,
  Trash2
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
  
  // Modals State
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
    // Pre-select current staff or first staff of same dept
    if (issue.assigned_to) {
      setSelectedStaffId(issue.assigned_to._id || issue.assigned_to)
    } else {
      const sameDeptStaff = staff.find(s => s.department?.toLowerCase() === issue.category?.toLowerCase())
      setSelectedStaffId(sameDeptStaff ? sameDeptStaff._id : (staff[0]?._id || ''))
    }
    setShowAssignModal(true)
  }

  const handleOpenDetail = (issue) => {
    setSelectedIssue(issue)
    setShowDetailModal(true)
  }

  const handleAssign = async () => {
    if (!selectedStaffId || !selectedIssue) return
    setAssigning(true)
    try {
      await complaintService.assign(selectedIssue._id, selectedStaffId)
      setShowAssignModal(false)
      setShowDetailModal(false) // Close detail if it was open
      fetchAllIssues() // Refresh list
      alert('Issue assigned/re-assigned successfully!')
    } catch (err) {
      console.error('Assignment failed:', err)
      alert('Failed to assign issue. Please try again.')
    } finally {
      setAssigning(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedIssue) return
    if (!window.confirm("Are you sure you want to delete this complaint? This action cannot be undone and should only be used if the complaint is not genuine.")) {
      return
    }
    
    setDeleting(true)
    try {
      await complaintService.delete(selectedIssue._id)
      setShowDetailModal(false)
      fetchAllIssues() // Refresh list
      alert('Complaint deleted successfully.')
    } catch (err) {
      console.error('Deletion failed:', err)
      alert('Failed to delete complaint. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          issue._id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const departments = ['All', 'Infrastructure', 'Hostel', 'Healthcare', 'Transport', 'Housekeeping', 'Maintenance', 'Canteen', 'IT Support']

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--accent)' };
      case 'pending': return { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning)' };
      case 'in_progress': return { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--secondary)' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', text: 'var(--text-light)' };
    }
  }

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
                { id: 'assigned', label: 'Assigned' },
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
                      background: getStatusColor(issue.status).bg,
                      color: getStatusColor(issue.status).text,
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
                      <button 
                        onClick={() => handleOpenDetail(issue)}
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface)' }}
                      >
                        <ArrowRight size={16} />
                      </button>
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

      {/* Detail Modal */}
      {showDetailModal && selectedIssue && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="card animate-in zoom-in duration-300" style={{ maxWidth: 800, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: getStatusColor(selectedIssue.status).bg,
                    color: getStatusColor(selectedIssue.status).text,
                  }}>
                    {selectedIssue.status.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>ID: #{selectedIssue._id.toUpperCase()}</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>{selectedIssue.title}</h2>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                style={{ background: 'var(--background)', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    <FileText size={18} color="var(--secondary)" /> Issue Description
                  </h4>
                  <p style={{ color: 'var(--text)', lineHeight: 1.6, fontSize: '0.925rem', whiteSpace: 'pre-wrap', background: 'var(--background)', padding: '1.25rem', borderRadius: '12px' }}>
                    {selectedIssue.description || 'No description provided.'}
                  </p>
                </div>

                {selectedIssue.image_url && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                      <ImageIcon size={18} color="var(--secondary)" /> Attached Media
                    </h4>
                    <img 
                      src={selectedIssue.image_url} 
                      alt="Attachment" 
                      style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border)' }} 
                    />
                  </div>
                )}

                <div>
                   <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    <History size={18} color="var(--secondary)" /> Activity Log
                  </h4>
                  <div style={{ borderLeft: '2px dashed var(--border)', marginLeft: '0.5rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {selectedIssue.status_history?.map((log, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-1.95rem', top: '0.25rem', width: 12, height: 12, borderRadius: '50%', background: 'var(--secondary)', border: '2px solid white' }}></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', fontWeight: 700 }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                          Status changed to <span style={{ color: 'var(--secondary)', textTransform: 'capitalize' }}>{log.status.replace('_', ' ')}</span>
                        </p>
                        {log.note && <p style={{ fontSize: '0.825rem', color: 'var(--text-light)', marginTop: '0.25rem', fontStyle: 'italic' }}>"{log.note}"</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="card" style={{ background: 'var(--background)', border: 'none', marginBottom: '1.5rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.925rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                    <User size={18} color="var(--primary)" /> Requester Details
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                     <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', border: '1px solid var(--border)' }}>
                       {selectedIssue.student_name?.charAt(0)}
                     </div>
                     <div>
                       <p style={{ fontWeight: 700, margin: 0 }}>{selectedIssue.student_name}</p>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>Student ID: {selectedIssue.student_id?.slice(-8)}</p>
                     </div>
                  </div>
                </div>

                <div className="card" style={{ background: 'white', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.925rem', fontWeight: 700, margin: 0 }}>
                      <Activity size={18} color="var(--accent)" /> Work Status
                    </h4>
                    {selectedIssue.status !== 'resolved' && (
                      <button 
                        onClick={() => handleOpenAssign(selectedIssue)}
                        className="hover-lift"
                        style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--secondary)', background: 'var(--secondary-light)', border: 'none', cursor: 'pointer' }}
                      >
                        <UserCog size={16} />
                      </button>
                    )}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem', fontWeight: 600 }}>Assignment:</p>
                    {selectedIssue.assigned_to_name ? (
                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{selectedIssue.assigned_to_name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedIssue.status === 'in_progress' ? 'var(--accent)' : 'var(--warning)' }}></div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>
                            {selectedIssue.status === 'in_progress' ? 'Currently Working' : 'Waiting to Start'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '1rem', textAlign: 'center', borderRadius: '10px', border: '2px dashed var(--border)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>No handler assigned yet.</p>
                      </div>
                    )}
                  </div>

                  {selectedIssue.status === 'resolved' && (
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <CheckCircle size={20} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Task Completed Successfully</span>
                    </div>
                  )}
                  
                  {selectedIssue.status !== 'resolved' && (
                    <button 
                      onClick={() => handleOpenAssign(selectedIssue)}
                      className="btn btn-primary" 
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {selectedIssue.assigned_to_name ? 'Change Handler' : 'Assign Handler'}
                    </button>
                  )}

                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                     <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--error)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <AlertTriangle size={16} /> Danger Zone
                     </h4>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                       If you think this complaint is not genuine or spam, you can remove it from the system.
                     </p>
                     <button 
                        onClick={handleDelete}
                        disabled={deleting}
                        className="btn" 
                        style={{ 
                          width: '100%', 
                          justifyContent: 'center', 
                          background: 'rgba(239, 68, 68, 0.1)', 
                          color: 'var(--error)', 
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          gap: '0.5rem'
                        }}
                      >
                        <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete Complaint'}
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
          zIndex: 1100, // Higher than detail modal
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card animate-in scale-in duration-300" style={{ maxWidth: 450, width: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                {selectedIssue.assigned_to_name ? 'Re-assign Issue' : 'Assign Handler'}
              </h3>
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
                <option value="">-- Choose Staff --</option>
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
              <p style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>The staff member will receive a notification immediately.</p>
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
                {assigning ? 'Updating...' : selectedIssue.assigned_to_name ? 'Update Handler' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllIssues

