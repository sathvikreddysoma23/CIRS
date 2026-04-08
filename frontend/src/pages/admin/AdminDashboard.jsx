import React, { useState, useEffect } from 'react'
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  Filter,
  Building2,
  TrendingUp,
  Activity,
  ChevronRight,
  Loader2
} from 'lucide-react'
import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminService, complaintService } from '../../services/api'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentIssues, setRecentIssues] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const [overviewRes, complaintsRes] = await Promise.all([
        adminService.getOverview(),
        complaintService.list({ limit: 5 })
      ])

      setStats(overviewRes.data)
      setRecentIssues(complaintsRes.data.complaints)
    } catch (err) {
      console.error('Failed to load admin dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-light)' }}>Loading system overview...</p>
      </div>
    )
  }

  const deptData = [
    { name: 'Hostel', value: 34, color: '#1E3A8A' },
    { name: 'IT Support', value: 45, color: '#3B82F6' },
    { name: 'Housekeeping', value: 28, color: '#10B981' },
    { name: 'Maintenance', value: 31, color: '#F59E0B' },
    { name: 'Security', value: 18, color: '#EF4444' },
  ]

  const statusData = [
    { name: 'Resolved', value: stats.complaints.resolved, color: '#10B981' },
    { name: 'Pending', value: stats.complaints.pending, color: '#F59E0B' },
    { name: 'In Progress', value: stats.complaints.in_progress, color: '#3B82F6' },
  ]

  return (
    <div className="animate-in fade-in duration-500">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ marginBottom: '0.25rem' }}>Administrator Command Center</h1>
          <p style={{ color: 'var(--text-light)' }}>System-wide overview of campus issues and resolutions.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filter View
          </button>
          <button className="btn btn-primary">
            <TrendingUp size={18} />
            Full Analytics
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {[
          { label: 'System Issues', value: stats.complaints.total, icon: <Activity size={24} />, color: 'var(--primary)', bg: 'rgba(30, 58, 138, 0.05)' },
          { label: 'Total Resolved', value: stats.complaints.resolved, icon: <CheckCircle size={24} />, color: 'var(--accent)', bg: 'rgba(16, 185, 129, 0.05)' },
          { label: 'Unresolved Tasks', value: stats.complaints.pending, icon: <Clock size={24} />, color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.05)' },
          { label: 'System Users', value: stats.users.total, icon: <Users size={24} />, color: 'var(--secondary)', bg: 'rgba(59, 130, 246, 0.05)' },
        ].map((stat, i) => (
          <div key={i} className="card hover-lift" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.75rem',
            background: 'var(--surface)'
          }}>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '0.5rem' }}>{stat.label}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>{stat.value}</h2>
            </div>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              backgroundColor: stat.bg,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} color="var(--primary)" /> Issues by Department
            </h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 600 }}>Weekly Trends</div>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RBarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </RBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '2rem' }}>Resolution Status</h3>
          <div style={{ height: 260, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>88%</span>
              <p style={{ fontSize: '0.625rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Completion</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            {statusData.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '2px', background: s.color }}></div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.name}</span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Recent Campus Alerts</h3>
          <Link to="/admin/issues" style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Explore All Issues <ChevronRight size={16} />
          </Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '1rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issue & Category</th>
              <th style={{ textAlign: 'left', padding: '1rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '1rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</th>
              <th style={{ textAlign: 'right', padding: '1rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {recentIssues.length > 0 ? recentIssues.map((issue) => (
              <tr key={issue._id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-lift">
                <td style={{ padding: '1.25rem 0' }}>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{issue.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginTop: '0.25rem', textTransform: 'capitalize' }}>{issue.category}</span>
                </td>
                <td style={{ padding: '1.25rem 0' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
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
                <td style={{ padding: '1.25rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem', textTransform: 'capitalize' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: (issue.priority === 'high' || issue.priority === 'critical') ? 'var(--error)' : 'var(--warning)' }}></div>
                    {issue.priority}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 0', textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-light)' }}>{new Date(issue.created_at).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>No systemic alerts detected.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard
