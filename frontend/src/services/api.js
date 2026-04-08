import axios from 'axios'

const API = axios.create({
  baseURL: '/api/v1',
})

// Add token to each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    // Both standard way and Axios v1+ specific way to be safe
    if (config.headers.set) {
      config.headers.set('Authorization', `Bearer ${token}`)
    } else {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle 401 responses globally (session expiry)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // ONLY logout on 401 Unauthorized (session expired/invalid)
      // 403 Forbidden should NOT log the user out, as it just means access to a specific resource is denied
      if (!window.location.pathname.includes('/login')) {
        console.warn('Session expired - redirecting to login')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login?msg=session_expired'
      }
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
}

export const complaintService = {
  list: (params) => API.get('/complaints/', { params }), 
  getStats: () => API.get('/complaints/stats'),
  detail: (id) => API.get(`/complaints/${id}`), // Removed trailing slash for path parameter compatibility
  create: (formData) => API.post('/complaints/', formData), 
  updateStatus: (id, status, note) => API.post(`/complaints/${id}/status`, { status, note }),
  assign: (id, department_user_id) => API.post(`/complaints/${id}/assign`, { department_user_id }),
}


export const adminService = {
  getOverview: () => API.get('/admin/dashboard'),
  listUsers: (params) => API.get('/admin/users', { params }),
  toggleUser: (id, is_active) => API.patch(`/admin/users/${id}/toggle`, null, { params: { is_active } }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
}

export default API

