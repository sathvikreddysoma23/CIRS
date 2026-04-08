import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--surface)'
      }}>
        <div className="loader"></div>
      </div>
    )
  }

  if (user) {
    // Redirect already-logged-in users to their respective dashboards
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'department') return <Navigate to="/staff" replace />
    return <Navigate to="/student" replace />
  }

  return children
}

export default PublicRoute
