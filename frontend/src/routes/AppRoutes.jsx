import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Welcome from '../pages/auth/Welcome'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

// Dashboards
import StudentDashboard from '../pages/student/StudentDashboard'
import StaffDashboard from '../pages/staff/StaffDashboard'
import AdminDashboard from '../pages/admin/AdminDashboard'
import DriverDashboard from '../pages/driver/DriverDashboard'

// Student Pages
import RaiseIssue from '../pages/student/RaiseIssue'
import MyIssues from '../pages/student/MyIssues'
import IssueDetails from '../pages/student/IssueDetails'
import Notifications from '../pages/student/Notifications'

// Staff Pages
import AssignedIssues from '../pages/staff/AssignedIssues'
import UpdateIssue from '../pages/staff/UpdateIssue'

// Admin Pages
import UserManagement from '../pages/admin/UserManagement'
import DepartmentManagement from '../pages/admin/DepartmentManagement'
import AllIssues from '../pages/admin/AllIssues'

// Shared Pages
import Profile from '../pages/Profile'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute role="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/raise-issue" element={
        <ProtectedRoute role="student">
          <RaiseIssue />
        </ProtectedRoute>
      } />
      <Route path="/student/my-issues" element={
        <ProtectedRoute role="student">
          <MyIssues />
        </ProtectedRoute>
      } />
      <Route path="/student/issue/:id" element={
        <ProtectedRoute role="student">
          <IssueDetails />
        </ProtectedRoute>
      } />
      <Route path="/student/notifications" element={
        <ProtectedRoute role="student">
          <Notifications />
        </ProtectedRoute>
      } />

      {/* Staff Routes */}
      <Route path="/staff" element={
        <ProtectedRoute role="department">
          <StaffDashboard />
        </ProtectedRoute>
      } />
      <Route path="/staff/assigned" element={
        <ProtectedRoute role="department">
          <AssignedIssues />
        </ProtectedRoute>
      } />
      <Route path="/staff/update/:id" element={
        <ProtectedRoute role="department">
          <UpdateIssue />
        </ProtectedRoute>
      } />

      {/* Driver Routes */}
      <Route path="/driver" element={
        <ProtectedRoute role="driver">
          <DriverDashboard />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute role="admin">
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/departments" element={
        <ProtectedRoute role="admin">
          <DepartmentManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/issues" element={
        <ProtectedRoute role="admin">
          <AllIssues />
        </ProtectedRoute>
      } />

      {/* Shared Protected Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Redirects */}
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
