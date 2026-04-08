import React, { useState, useEffect } from 'react'
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart,
  ArrowUpRight,
  Filter,
  ArrowRight,
  TrendingUp,
  Activity,
  XCircle
} from 'lucide-react'
import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 245,
    in_progress: 78,
    pending: 32,
    resolved: 120,
    rejected: 15
  })

  // Sample status mapping based on user request
  const chartData = [
    { name: 'Total Issues', value: stats.total, color: '#2563EB' },
    { name: 'Resolved', value: stats.resolved, color: '#10B981' },
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
    { name: 'Rejected', value: stats.rejected, color: '#EF4444' },
  ]

  const recentTasks = [
    { id: '1', title: 'Design Update', assignee: 'Alice', status: 'In Progress', dueDate: 'May 25, 2024' },
    { id: '2', title: 'Bug Fix', assignee: 'Mark', status: 'Pending', dueDate: 'May 22, 2024' },
    { id: '3', title: 'Code Review', assignee: 'John', status: 'Resolved', dueDate: 'May 20, 2024' },
    { id: '4', title: 'Client Feedback', assignee: 'Sarah', status: 'Rejected', dueDate: 'May 18, 2024' },
    { id: '5', title: 'Documentation', assignee: 'David', status: 'Resolved', dueDate: 'May 15, 2024' },
  ]

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'badge-pending'
      case 'In Progress': return 'badge-in-progress'
      case 'Resolved': return 'badge-resolved'
      case 'Rejected': return 'badge-rejected'
      default: return ''
    }
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Welcome Back!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's an overview of the current system status.</p>
      </div>

      {/* Stats Cards Grid - Matching Sample Image */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[
          { label: 'Total Issues', value: stats.total, icon: <ArrowUpRight size={20} />, color: '#2563EB' },
          { label: 'In Progress', value: stats.in_progress, icon: <Users size={20} />, color: '#3B82F6', badge: 'In Progress' },
          { label: 'Pending', value: stats.pending, icon: <PlusCircle size={20} />, color: '#F59E0B' },
          { label: 'Resolved', value: stats.resolved, icon: <CheckCircle2 size={20} />, color: '#10B981' },
          { label: 'Rejected', value: stats.rejected, icon: <XCircle size={20} />, color: '#EF4444' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: stat.color, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {stat.icon || <TrendingUp size={16} />}
              </div>
              <span className="card-title" style={{ marginBottom: 0 }}>{stat.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
               <span className="card-value">{stat.value}</span>
               {stat.badge && (
                 <span className="badge-in-progress" style={{ padding: '0.125rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                   {stat.badge}
                 </span>
               )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Issues Status</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RBarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Task Overview</h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 600 }}>{task.title}</td>
                    <td>{task.assignee}</td>
                    <td>
                      <span className={`badge ${getStatusClass(task.status)}`} style={{ textTransform: 'none', minWidth: '85px', justifyContent: 'center' }}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ color: '#6B7280' }}>{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', borderRadius: '8px' }}>New Task</button>
        <button className="btn btn-secondary" style={{ padding: '0.75rem 2.5rem', borderRadius: '8px' }}>
          <Activity size={16} /> View Reports
        </button>
      </div>
    </div>
  )
}

// Helper icons that might be missing from lucide-react in the env
const PlusCircle = ({ size, color }) => <Activity size={size} color={color} />

export default Dashboard

