import React, { useState, useEffect } from 'react'
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileSearch,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  ClipboardCheck,
  Calendar,
  Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { complaintService } from '../../services/api'

const StaffDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    assigned: 0,
    pending: 0,
    completed: 0
  })
  const [assignedTasks, setAssignedTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStaffData = async () => {
    setLoading(true)
    try {
      const response = await complaintService.list({ limit: 10 })
      const allTasks = response.data.complaints
      
      setStats({
        assigned: response.data.total,
        pending: allTasks.filter(t => t.status === 'pending' || t.status === 'assigned').length,
        completed: allTasks.filter(t => t.status === 'resolved').length
      })
      
      setAssignedTasks(allTasks)
    } catch (err) {
      console.error('Staff dashboard stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffData()
  }, [])

  return (
    <div className="animate-in fade-in duration-500">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ marginBottom: '0.25rem' }}>Welcome, {user?.name || 'Staff User'}!</h1>
          <p style={{ color: 'var(--text-light)' }}>Manage your assigned campus issues efficiently.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">
             <Calendar size={18} /> Schedule Tasks
          </button>
          <Link to="/staff/assigned" className="btn btn-primary">
            <ClipboardCheck size={18} /> View Tasks
          </Link>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {[
          { label: 'Assigned Tasks', value: stats.assigned, icon: <Users size={24} />, color: 'var(--primary)', bg: 'rgba(30, 58, 138, 0.05)' },
          { label: 'Pending Action', value: stats.pending, icon: <Clock size={24} />, color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.05)' },
          { label: 'Cases Resolved', value: stats.completed, icon: <CheckCircle size={24} />, color: 'var(--accent)', bg: 'rgba(16, 185, 129, 0.05)' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.75rem'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '12px',
              backgroundColor: stat.bg,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-light)' }}>{stat.label}</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Active Tasks</h3>
            <Link to="/staff/assigned" style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600 }}>View All</Link>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Task Details</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Location</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                    <Loader2 size={32} className="animate-spin" style={{ color: 'var(--secondary)', margin: 'auto' }} />
                  </td>
                </tr>
              ) : assignedTasks.length > 0 ? assignedTasks.map((task) => (
                <tr key={task._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '0.875rem', margin:0 }}>{task.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Student: {task.student_name}</p>
                  </td>
                  <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>{task.location || 'N/A'}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      background: task.status === 'resolved' ? 'rgba(16, 185, 129, 0.1)' : task.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: task.status === 'resolved' ? 'var(--accent)' : task.status === 'pending' ? 'var(--warning)' : 'var(--secondary)',
                    }}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <Link to={`/staff/update/${task._id}`} style={{ color: 'var(--secondary)' }}><ArrowRight size={18} /></Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                    No tasks currently assigned to you.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Urgent Alert</h3>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertTriangle size={24} color="var(--warning)" />
              <div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.5, opacity: 0.9 }}>
                  3 high-priority issues have been pending for more than 48 hours. Please check.
                </p>
                <button style={{ 
                  marginTop: '1rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: 'var(--radius)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}>
                  Resolve Now
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <FileSearch size={18} /> Generate Stats
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <MessageSquare size={18} /> Team Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard
