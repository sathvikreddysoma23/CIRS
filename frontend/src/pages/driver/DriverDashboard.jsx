import React, { useState, useEffect, useRef } from 'react'
import { Bus, CheckCircle2, AlertCircle, Mic, MicOff, Send, LogOut, ChevronRight, CheckCircle, RotateCcw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const DriverDashboard = () => {
  const { user, logout } = useAuth()
  const [busNumber, setBusNumber] = useState('')
  const [isDriving, setIsDriving] = useState(false)
  const [tripStep, setTripStep] = useState('IDENTIFY') // IDENTIFY, DRIVING, REPORTING, COMPLETED
  const [condition, setCondition] = useState(null) // 'good', 'bad'
  const [description, setDescription] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const recognitionRef = useRef(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }
        setDescription(prev => prev + finalTranscript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true)
      recognitionRef.current.start()
    } else {
      alert('Speech recognition is not supported in this browser.')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleStartTrip = (e) => {
    e.preventDefault()
    if (!busNumber) return
    setTripStep('DRIVING')
    setIsDriving(true)
  }

  const handleCompleteTrip = () => {
    setTripStep('REPORTING')
    setIsDriving(false)
  }

  const handleSubmitReport = async (e) => {
    e.preventDefault()
    if (!condition) return

    setLoading(true)
    try {
      await api.post('/operations/buses/report', {
        bus_number: busNumber,
        condition: condition,
        issue_description: condition === 'bad' ? description : 'N/A'
      })
      setTripStep('COMPLETED')
      setMessage({ type: 'success', text: 'Report submitted successfully. Thank you!' })
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to submit report. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const resetTrip = () => {
    setTripStep('IDENTIFY')
    setBusNumber('')
    setCondition(null)
    setDescription('')
    setMessage(null)
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>Driver Dashboard</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Welcome, {user?.name}</p>
        </div>
        <button onClick={logout} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.625rem 1rem', 
          borderRadius: '10px', 
          border: '1px solid #E5E7EB',
          background: 'white',
          color: '#EF4444',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          <LogOut size={18} /> Exit
        </button>
      </header>

      <main>
        {tripStep === 'IDENTIFY' && (
          <div className="card animate-scale-in" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '24px', background: '#EFF6FF', color: '#2563EB', 
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' 
            }}>
              <Bus size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Prepare for Duty</h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Please enter the bus number you are authorized to drive today.</p>
            
            <form onSubmit={handleStartTrip} style={{ maxWidth: 400, margin: '0 auto' }}>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Example: KA-01-F-1234" 
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1rem 1rem 3rem', 
                    borderRadius: '14px', 
                    border: '2px solid #E5E7EB',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
                <Bus size={20} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 700 }}>
                Commence Duty <ChevronRight size={20} />
              </button>
            </form>
          </div>
        )}

        {tripStep === 'DRIVING' && (
          <div className="card animate-pulse" style={{ padding: '4rem 2rem', textAlign: 'center', border: '2px solid #3B82F6', background: 'aliceblue' }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', background: '#3B82F6', color: 'white', 
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}>
              <Bus size={48} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#1E3A8A' }}>Duty in Progress</h2>
            <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'white', borderRadius: '30px', fontWeight: 800, color: '#1E40AF', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
              BUS: {busNumber}
            </div>
            <p style={{ color: '#4B5563', maxWidth: 500, margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
              You are currently registered as the driver for this vehicle. Please ensure student safety and follow all university transport protocols.
            </p>
            <button 
              onClick={handleCompleteTrip} 
              style={{ 
                padding: '1.25rem 3rem', 
                borderRadius: '18px', 
                background: '#10B981', 
                color: 'white', 
                border: 'none', 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)'
              }}
            >
              Finish Drop-off & Report
            </button>
          </div>
        )}

        {tripStep === 'REPORTING' && (
          <div className="card animate-fade-in" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>Post-Duty Condition Report</h2>
            <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '2.5rem' }}>Vehicle: <strong>{busNumber}</strong></p>

            <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: '1rem' }}>How was the bus condition today?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button 
                    type="button"
                    onClick={() => setCondition('good')}
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '16px', 
                      border: condition === 'good' ? '3px solid #10B981' : '1px solid #E5E7EB',
                      background: condition === 'good' ? '#F0FDF4' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <CheckCircle2 size={32} color={condition === 'good' ? '#10B981' : '#9CA3AF'} />
                    <span style={{ fontWeight: 700, color: condition === 'good' ? '#166534' : '#6B7280' }}>Good Condition</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCondition('bad')}
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '16px', 
                      border: condition === 'bad' ? '3px solid #EF4444' : '1px solid #E5E7EB',
                      background: condition === 'bad' ? '#FEF2F2' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <AlertCircle size={32} color={condition === 'bad' ? '#EF4444' : '#9CA3AF'} />
                    <span style={{ fontWeight: 700, color: condition === 'bad' ? '#991B1B' : '#6B7280' }}>Needs Attention</span>
                  </button>
                </div>
              </div>

              {condition === 'bad' && (
                <div className="animate-fade-in">
                  <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: '0.75rem' }}>Describe the Issue</label>
                  <div style={{ position: 'relative' }}>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Type details or use the microphone to speak..."
                      style={{ 
                        width: '100%', 
                        height: 150, 
                        padding: '1rem', 
                        borderRadius: '14px', 
                        border: '1px solid #E5E7EB',
                        fontSize: '1rem',
                        resize: 'none',
                        outline: 'none'
                      }}
                    />
                    <div style={{ position: 'absolute', right: '0.75rem', bottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                      <button 
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        style={{ 
                          width: 44, height: 44, borderRadius: '50%', 
                          background: isRecording ? '#EF4444' : '#2563EB',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-md)'
                        }}
                        title={isRecording ? "Stop Recording" : "Start Recording (Voice-to-Text)"}
                      >
                        {isRecording ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
                      </button>
                    </div>
                  </div>
                  {isRecording && <p style={{ fontSize: '0.8125rem', color: '#EF4444', fontWeight: 600, marginTop: '0.5rem' }}>Listening... Speak now (translating to English)</p>}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || !condition} 
                className="btn btn-primary"
                style={{ padding: '1rem', borderRadius: '14px', fontSize: '1.125rem', fontWeight: 800, marginTop: '1rem' }}
              >
                {loading ? 'Submitting...' : 'Finalize & Submit'} <Send size={20} style={{ marginLeft: '0.5rem' }} />
              </button>
            </form>
          </div>
        )}

        {tripStep === 'COMPLETED' && (
          <div className="card animate-scale-in" style={{ padding: '4rem 2.5rem', textAlign: 'center' }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', background: '#D1FAE5', color: '#059669', 
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' 
            }}>
              <CheckCircle size={48} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#065F46', marginBottom: '1rem' }}>Duty Successfully Recorded</h2>
            <p style={{ color: '#6B7280', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Your report for Bus <strong>{busNumber}</strong> has been logged in the system. 
              The transport department will be notified of any reported issues.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 300, margin: '0 auto' }}>
              <button 
                onClick={resetTrip}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '1rem', borderRadius: '14px', background: '#F3F4F6', color: '#374151',
                  border: 'none', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <RotateCcw size={18} /> Start New Duty
              </button>
              <button onClick={logout} style={{ color: '#EF4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                Logout
              </button>
            </div>
          </div>
        )}
      </main>

      {message && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          padding: '1rem 1.5rem', borderRadius: '12px',
          background: message.type === 'success' ? '#10B981' : '#EF4444',
          color: 'white', fontWeight: 600, boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          zIndex: 1000
        }}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.4s ease-out; }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
    </div>
  )
}

export default DriverDashboard
