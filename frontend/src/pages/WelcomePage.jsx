import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Zap,
  Layout,
  BarChart3,
  Users2,
  ArrowRight
} from 'lucide-react'

const WelcomePage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
      {/* Hero Section */}
      <section style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #111827 0%, #2563EB 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '100px',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ShieldCheck size={18} color="#60a5fa" />
            <span style={{ fontWeight: 600 }}>CIRS</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white', lineHeight: 1.1 }}>
            Resolve Issues with <span style={{ color: '#60a5fa' }}>Efficiency</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            A streamlined platform for managing campus queries, tasks, and reports with real-time analytics.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ backgroundColor: '#2563EB', padding: '1rem 2.5rem', borderRadius: '8px', fontSize: '1rem', textDecoration: 'none', color: 'white' }}>
              Access Dashboard <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ backgroundColor: 'white', color: '#111827', padding: '1rem 2.5rem', borderRadius: '8px', fontSize: '1rem', textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: <Layout />, title: 'Intuitive Dashboard', desc: 'Monitor all institutional activities at a glance with our clean interface.' },
              { icon: <Zap />, title: 'Real-time Updates', desc: 'Get instant notifications and live status tracking for all submitted queries.' },
              { icon: <BarChart3 />, title: 'Advanced Analytics', desc: 'Generate detailed reports and visualize data with interactive charts.' },
              { icon: <Users2 />, title: 'Role Management', desc: 'Secure access control for Admins, Departments, and Students alike.' },
            ].map((feature, i) => (
              <div key={i} className="card" style={{ padding: '2.5rem', textAlign: 'left', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div style={{
                  width: 52,
                  height: 52,
                  background: '#eff6ff',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                  marginBottom: '1.5rem'
                }}>
                  {React.cloneElement(feature.icon, { size: 26 })}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#111827' }}>{feature.title}</h3>
                <p style={{ color: '#6B7280' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '3rem 2rem', borderTop: '1px solid #E5E7EB', backgroundColor: 'white', textAlign: 'center' }}>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
          © 2024 CIRS • Professional Institutional Portal • v2.0
        </p>
      </footer>
    </div>
  )
}

export default WelcomePage
