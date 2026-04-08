import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()
  
  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', flexDirection: 'column', gap: '1rem' }}>
       <div style={{ width: 40, height: 40, border: '4px solid var(--secondary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
       <span style={{ fontSize:'0.875rem', fontWeight: 600, color: 'var(--primary)' }}>CIRS PORTAL LOADING...</span>
       <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
  
  // If not logged in, redirect to login
  if (!user) return <Navigate to="/" replace />
  
  // If role is specified and doesn't match, redirect based on actual role
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'department') return <Navigate to="/staff" replace />
    if (user.role === 'student') return <Navigate to="/student" replace />
    return <Navigate to="/" replace />
  }
  
  return <Layout>{children}</Layout>
}

export default ProtectedRoute
