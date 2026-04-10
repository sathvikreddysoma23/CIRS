import React from 'react'
import { Bell, Search, User, ChevronDown, HelpCircle, Command } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Header = () => {
  const { user } = useAuth()

  return (
    <header style={{
      height: 'var(--header-height)',
      position: 'fixed',
      top: 0,
      right: 0,
      width: 'calc(100% - var(--sidebar-width))',
      zIndex: 900,
      padding: '0 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
    }}>
      {/* Search Bar Container */}
      <div style={{ position: 'relative', width: '420px' }}>
        <div style={{
          position: 'absolute',
          left: '1.25rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          color: '#6B7280',
          pointerEvents: 'none'
        }}>
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search issues, departments..."
          style={{
            width: '100%',
            padding: '0.625rem 1rem 0.625rem 3.25rem',
            backgroundColor: '#F9FAFB',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        />
        <div style={{
           position: 'absolute',
           right: '0.875rem',
           top: '50%',
           transform: 'translateY(-50%)',
           padding: '0.25rem 0.5rem',
           background: 'white',
           border: '1px solid #E5E7EB',
           borderRadius: '6px',
           display: 'flex',
           alignItems: 'center',
           gap: '4px',
           fontSize: '0.625rem',
           fontWeight: 700,
           color: '#9CA3AF',
           pointerEvents: 'none'
        }}>
          <Command size={10} /> K
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Profile Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, stroke: 'none', color: '#111827' }}>
                {user?.name || 'Authorized'}
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
                {user?.role === 'department' ? user.department : user?.role || 'Guest'}
              </span>
           </div>
           <div style={{
             width: 40,
             height: 40,
             background: '#2563EB',
             borderRadius: '50%',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             color: 'white',
             fontWeight: 700,
             boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
           }}>
             {user?.name?.[0]?.toUpperCase() || <User size={20} />}
           </div>
        </div>
      </div>
    </header>
  )
}

export default Header

