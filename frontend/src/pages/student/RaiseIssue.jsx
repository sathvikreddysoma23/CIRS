import React, { useState } from 'react'
import { 
  ArrowLeft,
  Send,
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  Shield,
  Layers,
  Flag,
  X
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { complaintService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const RaiseIssue = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'infrastructure',
    priority: 'medium',
    location: ''
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 3) {
      setError('You can only upload up to 3 images.')
      return
    }
    
    setImages([...images, ...files])
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
    setError('')
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    
    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('priority', formData.priority)
      data.append('location', formData.location)
      
      images.forEach(img => {
        data.append('images', img)
      })

      await complaintService.create(data)
      setSuccess(true)
      setTimeout(() => navigate('/student/my-issues'), 2000)
    } catch (err) {
      console.error('Failed to raise issue:', err)
      setError(err.response?.data?.detail || 'Failed to submit issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'infrastructure', label: 'Infrastructure & Labs' },
    { id: 'transportation', label: 'Transportation' },
    { id: 'housing', label: 'Housing & Hostel' },
    { id: 'sanitation', label: 'Sanitation & Hygiene' },
    { id: 'library', label: 'Library Services' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'other', label: 'Other' }
  ]
  
  const priorities = [
    { id: 'low', label: 'Low' },
    { id: 'medium', label: 'Medium' },
    { id: 'high', label: 'High' },
    { id: 'critical', label: 'Critical' }
  ]

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          background: 'rgba(16, 185, 129, 0.1)', 
          color: 'var(--accent)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '1.5rem',
          animation: 'bounce 2s infinite'
        }}>
          <Send size={40} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Issue Submitted Successfully!</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>AI is classifying your issue for the correct department.</p>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary)' }}>Redirecting you to your issues list...</p>
        <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/student" style={{ color: 'var(--text-light)', transition: 'var(--transition)' }} className="hover-lift">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="title" style={{ margin:0 }}>Raise a New Issue</h1>
          <p style={{ color: 'var(--text-light)' }}>Provide detailed information for faster resolution.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#FEF2F2', color: '#EF4444', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '1.75rem' }}>
            <label>Issue Title</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                required 
                placeholder="Briefly state the problem" 
                style={{ paddingLeft: '3rem' }} 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <Layers size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label>Location / Room No.</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="e.g. Block A, Room 302" 
                style={{ paddingLeft: '3rem' }} 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
              <HelpCircle size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
            <div>
              <label>Category</label>
              <div style={{ position: 'relative' }}>
                <select 
                  style={{ paddingLeft: '3rem' }}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <Layers size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              </div>
            </div>
            <div>
              <label>Priority</label>
              <div style={{ position: 'relative' }}>
                <select 
                  style={{ paddingLeft: '3rem' }}
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  {priorities.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <Flag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label>Detailed Description</label>
            <textarea 
              required 
              placeholder="Tell us more about the issue..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label>Upload Evidence (Max 3)</label>
            <div 
              onClick={() => document.getElementById('image-upload').click()}
              className="upload-zone"
              style={{ padding: '2rem', marginBottom: previews.length > 0 ? '1.5rem' : 0 }}
            >
              <input 
                id="image-upload"
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'none' }}
              />
              <ImageIcon size={32} className="upload-icon" />
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#4B5563', marginBottom: '0.25rem' }}>Click to upload images</p>
              <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>PNG, JPG or WEBP up to 5MB</p>
            </div>

            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {previews.map((src, index) => (
                  <div key={index} style={{ position: 'relative', width: 90, height: 90 }}>
                    <img 
                      src={src} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #E5E7EB' }} 
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{ 
                        position: 'absolute', 
                        top: -8, 
                        right: -8, 
                        background: '#EF4444', 
                        color: 'white', 
                        borderRadius: '50%', 
                        width: 24, 
                        height: 24, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '2px solid white',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', borderRadius: '10px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (
              <>
                <Send size={18} />
                Submit Issue
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: '#2563EB' }}><Shield size={24} /></div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E3A8A', marginBottom: '0.5rem' }}>Verified Communication</h4>
                <p style={{ fontSize: '0.8125rem', color: '#60A5FA', lineHeight: 1.5, color: '#1E40AF' }}>
                  Your submission is encrypted and transmitted directly to institutional handlers for rapid triage.
                </p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: '#111827' }}>Submission Guidelines</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Specify precise location/room numbers.',
                'Attach at least one photo for proof.',
                'AI will automatically route your issue.',
                'Status updates sent via dashboard.'
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: '#6B7280', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px', color: '#2563EB' }}><AlertCircle size={16} /></div>
                  <span style={{ lineHeight: 1.4 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default RaiseIssue
