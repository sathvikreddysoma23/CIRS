import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser))
          // Optionally verify token with backend
          const response = await authService.getMe()
          setUser(response.data)
          localStorage.setItem('user', JSON.stringify(response.data))
        } catch (error) {
          console.error('Session verification failed:', error)
          logout()
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { access_token, user: userData } = response.data
      
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return userData
    } catch (error) {
      console.error('Login error:', error)
      throw error.response?.data?.detail || 'Login failed. Please check your credentials.'
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      // After registration, we usually want the user to login or we auto-login
      // If the backend returns a token on register, use it. Otherwise, return response.
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      throw error.response?.data?.detail || 'Registration failed. Please try again.'
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
