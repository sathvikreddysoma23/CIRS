import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Loader2,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { complaintService } from '../../services/api'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  })
  const [recentIssues, setRecentIssues] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await complaintService.list({ limit: 5 })
      const allIssues = response.data.complaints
      
      setStats({
        total: response.data.total,
        pending: allIssues.filter(i => i.status === 'pending').length,
        resolved: allIssues.filter(i => i.status === 'resolved').length
      })
      
      setRecentIssues(allIssues.slice(0, 5))
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="animate-in">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '2.5rem',
        padding: '0 0.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
             <Sparkles size={18} color="var(--secondary)" />
             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student Workspace</span>
          </div>
          <h1 className="title" style={{ marginBottom: 0, fontSize: '2.25rem' }}>Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>You have {stats.pending} issues requiring attention today.</p>
        </div>
        <Link to="/student/raise-issue" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', borderRadius: '14px' }}>
          <Plus size={20} />
          <span>Raise New Issue</span>
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {[
          { label: 'Total Submissions', value: stats.total, icon: <FileText size={24} />, color: 'var(--primary)', bg: 'rgba(30, 27, 75, 0.04)' },
          { label: 'Pending Review', value: stats.pending, icon: <Clock size={24} />, color: 'var(--warning)', bg: 'rgba(217, 119, 6, 0.04)' },
          { label: 'Successfully Resolved', value: stats.resolved, icon: <CheckCircle size={24} />, color: 'var(--accent)', bg: 'rgba(5, 150, 105, 0.04)' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '2rem',
            borderBottom: `4px solid ${stat.color}`
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '16px',
              backgroundColor: stat.bg,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)'
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.025em', marginBottom: '0.25rem' }}>{stat.label}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
            <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>Recent Activities</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Latest updates on your reported issues</p>
            </div>
            <Link to="/student/my-issues" className="btn btn-ghost" style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                View All History <ChevronRight size={16} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentIssues.length > 0 ? recentIssues.map((issue) => (
              <Link key={issue._id} to={`/student/issue/${issue._id}`} style={{ 
                padding: '1.25rem', 
                borderRadius: '16px', 
                border: '1.5px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'var(--transition)',
                textDecoration: 'none',
                color: 'inherit'
              }} className="hover-lift">
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                   <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                      <FileText size={20} color="var(--primary)" />
                   </div>
                   <div>
                     <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>{issue.title}</h4>
                     <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                       <span style={{ textTransform: 'capitalize' }}>{issue.category}</span>
                       <span style={{ opacity: 0.3 }}>|</span>
                       <span>Reported on {new Date(issue.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                     </div>
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <span className={`badge badge-${issue.status === 'in_progress' ? 'progress' : issue.status}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  <div style={{ color: 'var(--text-light)' }}>
                    <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            )) : (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-light)' }}>
                <FileText size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <p style={{ fontWeight: 600 }}>No issues reported recently.</p>
                <p style={{ fontSize: '0.875rem' }}>Raise a new issue to see it here.</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card glass-dark" style={{ color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'var(--secondary)', filter: 'blur(60px)', opacity: 0.3, borderRadius: '50%' }}></div>
            
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <TrendingUp size={26} color="#60a5fa" />
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>AI Resolution Insights</h3>
            <p style={{ fontSize: '0.9375rem', opacity: 0.7, marginBottom: '2rem', lineHeight: 1.7 }}>
              Our smart classification engine helps route your concerns 85% faster than manual processing. 
            </p>
            <button className="btn btn-primary" style={{ 
              width: '100%', 
              background: 'white', 
              color: 'var(--primary)',
              boxShadow: 'none'
            }}>
              View Platform Impact
            </button>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
             <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Need Quick Help?</h4>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                    { label: 'Platform Guidelines', icon: <Sparkles size={16} /> },
                    { label: 'Contact Support', icon: <ArrowRight size={16} /> },
                    { label: 'Emergency Protocol', icon: <AlertCircle size={16} /> }
                ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }} className="hover-lift">
                        <div style={{ color: 'var(--secondary)' }}>{item.icon}</div>
                        {item.label}
                    </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
