import { useState } from 'react'
import './App.css'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://react-devops-cicd.onrender.com'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    setFeedback('Sending your message...')

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error('Backend did not confirm success')
      }

      setFormData({
        name: '',
        email: '',
        message: '',
      })
      setStatus('success')
      setFeedback('Message submitted successfully.')
    } catch {
      setStatus('error')
      setFeedback('Could not submit the message. Please try again.')
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '32px',
          borderRadius: '24px',
          background: 'rgba(255, 252, 247, 0.92)',
          boxShadow: '0 18px 40px -24px rgba(16, 33, 62, 0.18)',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>
          Contact Landing Page
        </p>
        <h1 style={{ marginTop: '12px', marginBottom: '12px' }}>
          Send us your information
        </h1>
        <p style={{ marginBottom: '24px' }}>
          Fill out the form below and the data will be sent to your backend.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'grid', gap: '16px' }}
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            required
            style={inputStyle}
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message"
            rows="5"
            required
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          <button
            type="submit"
            disabled={status === 'submitting'}
            style={{
              padding: '14px 18px',
              border: 0,
              borderRadius: '999px',
              background: '#ffd166',
              color: '#10213e',
              fontWeight: 700,
              cursor: status === 'submitting' ? 'wait' : 'pointer',
            }}
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {feedback ? <p style={{ marginTop: '18px' }}>{feedback}</p> : null}
      </section>
    </main>
  )
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid rgba(16, 33, 62, 0.16)',
  font: 'inherit',
}

export default App
