import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ListTodo,
  Users,
  LogOut,
  ShieldCheck,
  PlusCircle,
  Bell,
  UserCircle,
  Building2,
  ClipboardList,
  ExternalLink,
  Settings
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()

  const navItems = (() => {
    if (!user) return []
    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
          { name: 'User Directory', icon: <Users size={20} />, path: '/admin/users' },
          { name: 'Departments', icon: <Building2 size={20} />, path: '/admin/departments' },
          { name: 'All Issues', icon: <ClipboardList size={20} />, path: '/admin/issues' },
        ]
      case 'department':
        return [
          { name: 'Staff Overview', icon: <LayoutDashboard size={20} />, path: '/staff' },
          { name: 'Assigned Tasks', icon: <ListTodo size={20} />, path: '/staff/assigned' },
        ]
      case 'student':
        return [
          { name: 'My Dashboard', icon: <LayoutDashboard size={20} />, path: '/student' },
          { name: 'Raise Issue', icon: <PlusCircle size={20} />, path: '/student/raise-issue' },
          { name: 'Track Issues', icon: <ListTodo size={20} />, path: '/student/my-issues' },
          { name: 'Notifications', icon: <Bell size={20} />, path: '/student/notifications' },
        ]
      default:
        return []
    }
  })()

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 0.75rem',
      zIndex: 1000,
      backgroundColor: '#111827',
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Brand Identity */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0 1rem 3rem 1rem',
      }}>
        <div style={{
          background: '#2563EB',
          width: 38,
          height: 38,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
        }}>
          <ShieldCheck size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'white' }}>CIRS</h1>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                  color: isActive ? 'white' : '#9CA3AF',
                  background: isActive ? '#2563EB' : 'transparent',
                  transition: 'var(--transition)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem'
                })}
              >
                <span style={{ color: 'inherit' }}>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings & Logout */}
      <div style={{ padding: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <NavLink
          to="/profile"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            color: isActive ? 'white' : '#9CA3AF',
            background: isActive ? '#2563EB' : 'transparent',
            transition: 'var(--transition)',
            textDecoration: 'none',
            fontWeight: isActive ? 600 : 500,
            fontSize: '0.875rem'
          })}
        >
          <Settings size={18} /> Settings
        </NavLink>
        
        <button
           onClick={logout}
           style={{
             display: 'flex',
             alignItems: 'center',
             gap: '0.75rem',
             padding: '0.75rem 1rem',
             color: '#9CA3AF',
             background: 'none',
             border: 'none',
             fontSize: '0.875rem',
             fontWeight: 500,
             cursor: 'pointer',
             width: '100%',
             textAlign: 'left',
             marginTop: '0.25rem'
           }}
           onMouseOver={(e) => e.currentTarget.style.color = 'white'}
           onMouseOut={(e) => e.currentTarget.style.color = '#9CA3AF'}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
