import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Target, 
  Users, 
  CheckCircle,
  MessageSquare,
  BarChart3,
  Bot,
  Globe,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Welcome = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'department') navigate('/staff')
      else navigate('/student')
    }
  }, [user, loading, navigate])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }} className="animate-in">
      {/* Decorative Background Elements */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(30, 27, 75, 0.05) 0%, transparent 70%)', zIndex: 0 }}></div>

      <header className="glass" style={{ 
        height: 'var(--header-height)', 
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: '1.5px solid var(--border)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: 44, 
              height: 44, 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white',
              boxShadow: '0 8px 16px -4px rgba(30, 27, 75, 0.3)'
            }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.04em' }}>CIRS</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--text-light)', letterSpacing: '-0.04em' }}>PORTAL</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn btn-ghost" style={{ fontWeight: 700 }}>Sign In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', borderRadius: '12px' }}>Get Started</Link>
          </div>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: '10rem 0 6rem 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.625rem 1.25rem', 
              background: 'white', 
              color: 'var(--secondary)', 
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 800,
              marginBottom: '2.5rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Sparkles size={16} />
              <span>AI-Powered Campus Resolution</span>
            </div>
            
            <h1 style={{ 
              fontSize: '5rem', 
              fontWeight: 900, 
              lineHeight: 1.05, 
              color: 'var(--primary)', 
              marginBottom: '2rem', 
              letterSpacing: '-0.05em' 
            }}>
              Transforming <br />
              <span style={{ 
                background: 'linear-gradient(135deg, var(--secondary) 0%, var(--info) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Campus Experience</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.375rem', 
              color: 'var(--text-muted)', 
              marginBottom: '3.5rem', 
              lineHeight: 1.7, 
              maxWidth: '800px', 
              marginInline: 'auto' 
            }}>
              A state-of-the-art intelligent feedback platform that routes your concerns to the right hands using advanced AI classification.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.125rem', borderRadius: '16px' }}>
                Sign In <ArrowRight size={22} />
              </Link>
              <Link to="/login" className="btn btn-ghost" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', borderRadius: '16px', background: 'white', border: '1.5px solid var(--border)', textDecoration: 'none', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section style={{ padding: '4rem 0 8rem 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {[
                { 
                  icon: <Bot size={36} />, 
                  title: 'AI Intelligence', 
                  desc: 'Proprietary classification algorithms route issues to specific departments with 94%+ accuracy.',
                  color: 'var(--secondary)'
                },
                { 
                  icon: <Globe size={36} />, 
                  title: 'Campus Wide', 
                  desc: 'Unified coverage across 15+ different administrative wings—from Hostel to Transport.',
                  color: 'var(--info)'
                },
                { 
                  icon: <Target size={36} />, 
                  title: 'SLA Driven', 
                  desc: 'Guaranteed resolution timelines with transparent auditing for institutional accountability.',
                  color: 'var(--accent)'
                }
              ].map((f, i) => (
                <div key={i} className="card hover-lift" style={{ padding: '3.5rem 2.5rem', border: 'none', background: 'white', borderRadius: '24px' }}>
                  <div style={{ 
                    width: 72, 
                    height: 72, 
                    borderRadius: '20px', 
                    background: `${f.color}10`, 
                    color: f.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: '2rem' 
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--primary)' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof Section */}
        <div className="container" style={{ marginBottom: '8rem' }}>
            <div className="card glass-dark" style={{ padding: '4rem', borderRadius: '32px', textAlign: 'center', color: 'white', border: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                    {[
                        { label: 'Active Students', val: '4.2k+' },
                        { label: 'Staff Members', val: '180+' },
                        { label: 'Response Time', val: '< 2hrs' },
                        { label: 'Resolved Tickets', val: '12k+' }
                    ].map((s, i) => (
                        <div key={i}>
                            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white' }}>{s.val}</h2>
                            <p style={{ fontSize: '0.875rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>

      <footer style={{ padding: '6rem 0 4rem 0', background: 'white', borderTop: '1.5px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <ShieldCheck size={32} color="var(--primary)" />
             <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.04em' }}>CIRS</span>
          </div>
          <div style={{ display: 'flex', gap: '3rem' }}>
             {['Terms', 'Privacy', 'Compliance', 'Security'].map(l => (
                 <a key={l} href="#" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>{l}</a>
             ))}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 600 }}>© 2024 University Institutional Suite</p>
        </div>
      </footer>
    </div>
  )
}

export default Welcome
