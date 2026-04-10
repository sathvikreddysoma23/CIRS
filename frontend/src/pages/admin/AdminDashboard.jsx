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
  Loader2,
  X,
  PieChart as PieIcon,
  Layers,
  Calendar,
  Bus,
  ShieldAlert,
  Search,
  UserCircle,
  Trash2,
  RotateCcw
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
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminService, complaintService, operationsService } from '../../services/api'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [stats, setStats] = useState(null)
  const [recentIssues, setRecentIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all') // all, pending, resolved, unsolved
  const [showFilters, setShowFilters] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const [overviewRes, complaintsRes] = await Promise.all([
        adminService.getOverview(),
        complaintService.list({ limit: 10 })
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

  // Sample analytics data for the expanded view
  const trendData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 19 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 22 },
    { day: 'Fri', count: 30 },
    { day: 'Sat', count: 10 },
    { day: 'Sun', count: 8 },
  ]

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

  const totalComplaints = stats.complaints.total
  const completionRate = Math.round((stats.complaints.resolved / totalComplaints) * 100) || 0

  const filteredStats = (() => {
    if (filterType === 'all') return stats
    
    // Create shallow copy to modify for display
    const newStats = JSON.parse(JSON.stringify(stats))
    if (filterType === 'pending') {
      newStats.complaints.total = stats.complaints.pending
      newStats.complaints.resolved = 0
    } else if (filterType === 'resolved') {
      newStats.complaints.total = stats.complaints.resolved
      newStats.complaints.pending = 0
    } else if (filterType === 'unsolved') {
      newStats.complaints.total = stats.complaints.pending + stats.complaints.in_progress
      newStats.complaints.resolved = 0
    }
    return newStats
  })()

  const filteredIssues = recentIssues.filter(issue => {
    if (filterType === 'all') return true
    if (filterType === 'pending') return issue.status === 'pending'
    if (filterType === 'resolved') return issue.status === 'resolved'
    if (filterType === 'unsolved') return issue.status === 'pending' || issue.status === 'in_progress'
    return true
  })

  const statsCards = [
    { id: 'total', label: 'System Issues', value: filteredStats.complaints.total, icon: <Activity size={24} />, color: 'var(--primary)', bg: 'rgba(30, 58, 138, 0.05)', showAlways: true },
    { id: 'resolved', label: 'Total Resolved', value: filteredStats.complaints.resolved, icon: <CheckCircle size={24} />, color: 'var(--accent)', bg: 'rgba(16, 185, 129, 0.05)', showAlways: true },
    { id: 'pending', label: 'Unresolved Tasks', value: filteredStats.complaints.pending || (stats.complaints.pending + stats.complaints.in_progress), icon: <Clock size={24} />, color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.05)', showAlways: true },
    { id: 'users', label: 'System Users', value: stats.users.total, icon: <Users size={24} />, color: 'var(--secondary)', bg: 'rgba(59, 130, 246, 0.05)', showAlways: false },
  ]

  return (
    <div className="animate-in fade-in duration-500">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ marginBottom: '0.25rem' }}>Administrator Command Center</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <p style={{ color: 'var(--text-light)', margin: 0 }}>System-wide overview of campus issues and resolutions.</p>
            <button 
              onClick={fetchAdminData} 
              style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700 }}
              title="Refresh Dashboard"
            >
              <RotateCcw size={14} className={loading ? 'animate-spin' : ''} /> Sync Now
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <button className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowFilters(!showFilters)}>
              <Filter size={18} />
              Filter View
            </button>
            
            {showFilters && (
              <div className="card" style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                zIndex: 100,
                width: '200px',
                padding: '0.5rem',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
              }}>
                {[
                  { id: 'all', label: 'All Complaints' },
                  { id: 'pending', label: 'Pending Only' },
                  { id: 'resolved', label: 'Resolved Only' },
                  { id: 'unsolved', label: 'All Unsolved' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setFilterType(opt.id); setShowFilters(false); }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      background: filterType === opt.id ? 'var(--background)' : 'transparent',
                      color: filterType === opt.id ? 'var(--secondary)' : 'var(--text)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '2px'
                    }}
                    className="hover-bg"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button className="btn btn-primary" onClick={() => setShowAnalytics(true)}>
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
        {statsCards
          .filter(card => filterType === 'all' || card.showAlways)
          .map((stat, i) => (
          <div key={i} className="card hover-lift animate-in zoom-in duration-300" style={{
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
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{completionRate}%</span>
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
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            {filterType === 'all' ? 'Recent Campus Alerts' : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Campus Alerts`}
          </h3>
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
            {filteredIssues.length > 0 ? filteredIssues.map((issue) => (
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
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>No systemic alerts detected for this filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Full Analytics Modal-like Overlay */}
      {showAnalytics && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          animation: 'fade-in 0.3s ease'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '1100px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            padding: '2.5rem'
          }}>
            <button 
              onClick={() => setShowAnalytics(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--background)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}
            >
              <X size={24} color="var(--primary)" />
            </button>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: 48, height: 48, background: 'var(--secondary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                <BarChart3 size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Advanced System Analytics</h2>
                <p style={{ color: 'var(--text-light)' }}>Deep dive into campus issue trends and resolution metrics.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="card" style={{ background: 'var(--background)', border: 'none' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Mean Resolution Time</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>4.2 hrs</h3>
                  <span style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 700 }}>-12% vs last week</span>
                </div>
              </div>
              <div className="card" style={{ background: 'var(--background)', border: 'none' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem' }}>System Uptime</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>99.9%</h3>
                  <span style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 700 }}>Stable</span>
                </div>
              </div>
              <div className="card" style={{ background: 'var(--background)', border: 'none' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Student Satisfaction</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>4.8/5</h3>
                  <span style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 700 }}>+0.2 pts</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="card">
                <h4 style={{ fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} color="var(--secondary)" /> Daily Issue Inflow
                </h4>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                 <h4 style={{ fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PieIcon size={18} color="var(--accent)" /> Priority Distribution
                </h4>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Critical', value: 5, color: '#EF4444' },
                          { name: 'High', value: 15, color: '#F59E0B' },
                          { name: 'Medium', value: 45, color: '#3B82F6' },
                          { name: 'Low', value: 35, color: '#10B981' },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                      >
                        {[ '#EF4444', '#F59E0B', '#3B82F6', '#10B981' ].map((color, idx) => (
                           <Cell key={idx} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
               <button onClick={() => setShowAnalytics(false)} className="btn btn-secondary">Close Detailed View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
