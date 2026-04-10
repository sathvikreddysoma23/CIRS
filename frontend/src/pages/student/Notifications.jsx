import React, { useState, useEffect } from 'react'
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  ShieldCheck,
  ChevronRight,
  Trash2,
  Loader2,
  Inbox
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { notificationService } from '../../services/api'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      // By default, showing only unread notifications as per user request ("disappear when read")
      const response = await notificationService.list(true)
      setNotifications(response.data)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
      setError('Could not load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id)
      // Remove from list since it's now "read" and user wants it to disappear
      setNotifications(notifications.filter(n => n._id !== id))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead()
      setNotifications([])
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id)
      setNotifications(notifications.filter(n => n._id !== id))
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin:0 }}>Notifications</h1>
          <p style={{ color: 'var(--text-light)' }}>Stay updated with the status of your issues.</p>
        </div>
        {notifications.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button onClick={markAllRead} style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600, background: 'none', cursor: 'pointer' }}>Mark all as read</button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-light)' }}>Loading your notifications...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notif) => (
            <div key={notif._id} className="card" style={{ 
              padding: '1.25rem', 
              display: 'flex', 
              gap: '1.25rem', 
              alignItems: 'center',
              background: notif.is_read ? 'var(--surface)' : 'rgba(59, 130, 246, 0.03)',
              borderLeft: notif.is_read ? '1px solid var(--border)' : '4px solid var(--secondary)',
              transition: 'var(--transition)'
            }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px', 
                background: 
                  notif.type === 'status_change' ? 'rgba(16, 185, 129, 0.1)' : 
                  notif.type === 'comment' ? 'rgba(59, 130, 246, 0.1)' : 
                  notif.type === 'assignment' ? 'rgba(245, 158, 11, 0.1)' : 
                  'rgba(107, 114, 128, 0.1)',
                color: 
                  notif.type === 'status_change' ? 'var(--accent)' : 
                  notif.type === 'comment' ? 'var(--secondary)' : 
                  notif.type === 'assignment' ? 'var(--warning)' : 
                  'var(--text-light)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {notif.type === 'status_change' && <CheckCircle size={24} />}
                {notif.type === 'comment' && <MessageSquare size={24} />}
                {notif.type === 'assignment' && <ShieldCheck size={24} />}
                {(notif.type === 'system' || !notif.type) && <Bell size={24} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>
                      {notif.title}
                    </span>
                    {!notif.is_read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)' }}></span>}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{formatTime(notif.created_at)}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', lineHeight: 1.5 }}>{notif.message}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleMarkRead(notif._id)}
                  title="Mark as read"
                  style={{ padding: '0.5rem', color: 'var(--secondary)', background: 'none', cursor: 'pointer' }}
                  className="hover-lift"
                >
                  <CheckCircle size={18} />
                </button>
                <button 
                  onClick={() => deleteNotification(notif._id)}
                  title="Delete"
                  style={{ padding: '0.5rem', color: 'var(--error)', background: 'none', cursor: 'pointer', opacity: 0.7 }}
                  className="hover-lift"
                >
                  <Trash2 size={18} />
                </button>
                {notif.link && (
                  <Link 
                    to={notif.link}
                    style={{ padding: '0.5rem', color: 'var(--secondary)' }}
                    className="hover-lift"
                  >
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '5rem 0', background: 'transparent', border: '2px dashed var(--border)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <Inbox size={64} style={{ color: 'var(--border)' }} />
              </div>
              <h3 style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.5rem' }}>All Caught Up!</h3>
              <p style={{ color: 'var(--text-light)' }}>You have no unread notifications.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications
