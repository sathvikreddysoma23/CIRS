import React, { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  ShieldCheck,
  UserCircle,
  Building2,
  Mail,
  ChevronRight,
  UserPlus,
  Loader2,
  ShieldAlert,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { adminService } from '../../services/api'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (roleFilter !== 'All') params.role = roleFilter.toLowerCase()

      const response = await adminService.listUsers(params)
      setUsers(response.data.users)
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError('Could not load system users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await adminService.toggleUser(id, !currentStatus)
      fetchUsers() // Refresh list
    } catch (err) {
      alert('Failed to update user status.')
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return
    try {
      await adminService.deleteUser(id)
      fetchUsers()
    } catch (err) {
      alert('Failed to delete user.')
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="animate-in fade-in duration-500">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin: 0 }}>User Management</h1>
          <p style={{ color: 'var(--text-light)' }}>View, add and manage campus users and their permissions.</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 2 }}>
            <input
              type="text"
              placeholder="Search by name, email or department..."
              style={{ width: '100%', paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
            {['All', 'Student', 'Department', 'Admin'].map((f) => (
              <button
                key={f}
                onClick={() => setRoleFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'var(--transition)',
                  background: roleFilter === f ? 'var(--primary)' : 'var(--background)',
                  color: roleFilter === f ? 'white' : 'var(--text-light)',
                }}
                className="hover-lift"
              >
                {f === 'Department' ? 'Staff' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader2 size={40} className="animate-spin" style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-light)' }}>Fetching system users...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--background)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Basic Info</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Department</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-lift">
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
                        {u.name ? u.name.charAt(0) : '?'}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '0.925rem', marginBottom: '0.125rem' }}>{u.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={12} /> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                      <Building2 size={16} /> {u.department || 'General'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      background:
                        u.role === 'admin' ? 'rgba(30, 58, 138, 0.1)' :
                          u.role === 'department' ? 'rgba(59, 130, 246, 0.1)' :
                            'rgba(16, 185, 129, 0.1)',
                      color:
                        u.role === 'admin' ? 'var(--primary)' :
                          u.role === 'department' ? 'var(--secondary)' :
                            'var(--accent)',
                    }}>
                      {u.role === 'department' ? 'staff' : u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={() => toggleUserStatus(u._id, u.is_active)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: u.is_active ? 'var(--accent)' : 'var(--text-light)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {u.is_active ? <ToggleRight size={20} color="var(--accent)" /> : <ToggleLeft size={20} color="var(--text-light)" />}
                      {u.is_active ? 'Active' : 'Deactivated'}
                    </button>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
                      <button style={{ padding: '0.5rem', color: 'var(--text-light)' }}><Edit2 size={16} /></button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        style={{ padding: '0.5rem', color: 'var(--error)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <Users size={48} style={{ color: 'var(--border)' }} />
            </div>
            <h3 style={{ color: 'var(--text-light)', fontWeight: 500 }}>No users found matching your search.</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
