import React, { useState } from 'react'
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  ShieldCheck,
  ChevronRight,
  Trash2
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'status', title: 'Issue Resolved', message: 'Your issue #CIRS-8923 "Broken chair in Classroom 12" has been resolved.', time: '2 hours ago', unread: true, link: '/student/issue/1' },
    { id: 2, type: 'comment', title: 'New Comment', message: 'Nithin (Staff) commented on your issue: "Checking router settings now."', time: '5 hours ago', unread: true, link: '/student/issue/2' },
    { id: 3, type: 'assignment', title: 'Issue Assigned', message: 'Your issue #CIRS-6782 has been assigned to staff Nithin.', time: '8 hours ago', unread: false, link: '/student/issue/2' },
    { id: 4, type: 'system', title: 'Profile Updated', message: 'Your profile has been updated successfully.', time: '1 day ago', unread: false, link: '/profile' },
  ])

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin:0 }}>Notifications</h1>
          <p style={{ color: 'var(--text-light)' }}>Stay updated with the status of your issues.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button onClick={markAllRead} style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Mark all as read</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.map((notif) => (
          <div key={notif.id} className="card" style={{ 
            padding: '1.25rem', 
            display: 'flex', 
            gap: '1.25rem', 
            alignItems: 'center',
            background: notif.unread ? 'rgba(59, 130, 246, 0.03)' : 'var(--surface)',
            borderLeft: notif.unread ? '4px solid var(--secondary)' : '1px solid var(--border)',
            transition: 'var(--transition)'
          }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: '12px', 
              background: 
                notif.type === 'status' ? 'rgba(16, 185, 129, 0.1)' : 
                notif.type === 'comment' ? 'rgba(59, 130, 246, 0.1)' : 
                notif.type === 'assignment' ? 'rgba(245, 158, 11, 0.1)' : 
                'rgba(107, 114, 128, 0.1)',
              color: 
                notif.type === 'status' ? 'var(--accent)' : 
                notif.type === 'comment' ? 'var(--secondary)' : 
                notif.type === 'assignment' ? 'var(--warning)' : 
                'var(--text-light)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              {notif.type === 'status' && <CheckCircle size={24} />}
              {notif.type === 'comment' && <MessageSquare size={24} />}
              {notif.type === 'assignment' && <ShieldCheck size={24} />}
              {notif.type === 'system' && <Bell size={24} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <Link to={notif.link} style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {notif.title}
                  {notif.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)' }}></span>}
                </Link>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{notif.time}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', lineHeight: 1.5 }}>{notif.message}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => deleteNotification(notif.id)}
                style={{ padding: '0.5rem', color: 'var(--text-light)', opacity: 0.5 }}
                className="hover-lift"
              >
                <Trash2 size={18} />
              </button>
              <Link 
                to={notif.link}
                style={{ padding: '0.5rem', color: 'var(--secondary)' }}
                className="hover-lift"
              >
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <Bell size={48} style={{ color: 'var(--border)' }} />
            </div>
            <h3 style={{ color: 'var(--text-light)', fontWeight: 500 }}>No new notifications.</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
