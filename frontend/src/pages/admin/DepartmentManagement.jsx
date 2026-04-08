import React, { useState, useEffect } from 'react'
import { 
  Building2, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  Users,
  Bell,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  Loader2
} from 'lucide-react'
import { adminService } from '../../services/api'

const DepartmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await adminService.listUsers({ role: 'department' })
      setDepartments(response.data.users)
    } catch (err) {
      console.error('Failed to fetch departments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const filteredDepts = departments.filter((d) => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const colors = ['#3B82F6', '#1E3A8A', '#10B981', '#F59E0B', '#6366F1', '#EF4444']

  return (
    <div className="animate-in fade-in duration-500">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin:0 }}>Department Management</h1>
          <p style={{ color: 'var(--text-light)' }}>Configure departments and assign administrative responsibility.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> New Department
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <input 
            type="text" 
            placeholder="Search departments or heads..." 
            style={{ paddingLeft: '3rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        </div>
      </div>


      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0' }}>
            <Loader2 size={40} className="animate-spin" style={{ color: 'var(--secondary)', marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }} />
            <p style={{ color: 'var(--text-light)' }}>Fetching department structures...</p>
          </div>
        ) : filteredDepts.length > 0 ? filteredDepts.map((dept, idx) => (
          <div key={dept._id} className="card hover-lift" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            padding: 0,
            overflow: 'hidden',
          }}>
            <div style={{ 
              height: 48, 
              background: colors[idx % colors.length], 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0 1.5rem',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} />
                {dept.department || 'Unnamed Dept'}
              </div>
              <button style={{ color: 'rgba(255, 255, 255, 0.8)', background: 'none', border: 'none' }}><MoreVertical size={18} /></button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>Dept Head / Admin</p>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>{dept.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{dept.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>Account Status</p>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: dept.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: dept.is_active ? 'var(--accent)' : 'var(--error)',
                  }}>
                    {dept.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--background)', padding: '0.75rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '0.25rem', fontWeight: 800, fontSize: '1.25rem' }}>1</div>
                  <p style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Administrator Account</p>
                </div>
                <div style={{ background: 'var(--background)', padding: '0.75rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ color: 'var(--accent)', marginBottom: '0.25rem', fontWeight: 800, fontSize: '1.25rem' }}>92%</div>
                  <p style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>SLA Compliance</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                 <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.5rem', fontSize: '0.875rem' }}>
                    <Users size={16} /> Activity
                 </button>
                 <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.5rem', fontSize: '0.875rem' }}>
                    <Edit2 size={16} /> Config
                 </button>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ marginBottom: '1.5rem' }}>
               <Building2 size={48} style={{ color: 'var(--border)' }} />
            </div>
            <h3 style={{ color: 'var(--text-light)', fontWeight: 500 }}>No departments found.</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default DepartmentManagement
