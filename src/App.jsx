import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://react-devops-cicd.onrender.com'

function App() {
  const [serverStatus, setServerStatus] = useState('checking')
  const [serverMessage, setServerMessage] = useState('Checking backend status...')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState(
    'Fill out the form and send a message to MongoDB through your backend.',
  )

  useEffect(() => {
    let isMounted = true

    async function checkBackendHealth() {
      try {
        const response = await fetch(`${API_BASE_URL}/`)

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.text()

        if (isMounted) {
          setServerStatus('online')
          setServerMessage(data || 'Backend is running')
        }
      } catch {
        if (isMounted) {
          setServerStatus('offline')
          setServerMessage(
            'Could not reach the backend. Check Render deployment, CORS, or the API URL.',
          )
        }
      }
    }

    checkBackendHealth()

    return () => {
      isMounted = false
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitStatus('submitting')
    setSubmitMessage('Sending your message to the backend...')

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

      setSubmitStatus('success')
      setSubmitMessage('Message saved successfully. Your backend responded with success.')
      setFormData({
        name: '',
        email: '',
        message: '',
      })
    } catch {
      setSubmitStatus('error')
      setSubmitMessage(
        'Message could not be sent. Confirm the backend is running and MongoDB is connected.',
      )
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="eyebrow">Frontend Connected To Render Backend</div>
        <h1>Contact form powered by React, Express, MongoDB, and Render.</h1>
        <p className="hero-copy">
          This frontend now matches your backend API. It checks the server health
          endpoint and submits contact messages to
          <code>{`${API_BASE_URL}/api/contact`}</code>.
        </p>

        <div className="hero-actions">
          <a
            className="primary-action"
            href={API_BASE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open Backend URL
          </a>
          <span className={`status-pill status-${serverStatus}`}>
            {serverStatus === 'checking' && 'Checking backend'}
            {serverStatus === 'online' && 'Backend online'}
            {serverStatus === 'offline' && 'Backend offline'}
          </span>
        </div>
      </section>

      <section className="stats-grid" aria-label="Backend summary">
        <article className="stat-card">
          <span className="stat-label">Backend Root</span>
          <strong>{API_BASE_URL}</strong>
          <p>{serverMessage}</p>
        </article>
        <article className="stat-card">
          <span className="stat-label">POST Endpoint</span>
          <strong>/api/contact</strong>
          <p>Sends `name`, `email`, and `message` as JSON to your Express server.</p>
        </article>
        <article className="stat-card">
          <span className="stat-label">Database Flow</span>
          <strong>MongoDB via Mongoose</strong>
          <p>Submitted messages are saved by the `Message` model in `backend/server.js`.</p>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">Send A Message</div>
              <h2>Contact API demo</h2>
            </div>
            <span className={`status-pill status-${submitStatus}`}>
              {submitStatus === 'idle' && 'Ready'}
              {submitStatus === 'submitting' && 'Submitting'}
              {submitStatus === 'success' && 'Saved'}
              {submitStatus === 'error' && 'Failed'}
            </span>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </label>

            <label className="field">
              <span>Message</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message"
                rows="5"
                required
              />
            </label>

            <button
              type="submit"
              className="form-submit"
              disabled={submitStatus === 'submitting'}
            >
              {submitStatus === 'submitting' ? 'Sending...' : 'Send message'}
            </button>
          </form>

          <p className="helper-text">{submitMessage}</p>
        </article>

        <article className="panel">
          <div className="eyebrow">Backend Contract</div>
          <h2>What the frontend expects</h2>
          <ol className="pipeline-list">
            <li>`GET /` returns a plain text health message</li>
            <li>`POST /api/contact` accepts JSON request bodies</li>
            <li>Payload fields are `name`, `email`, and `message`</li>
            <li>CORS is enabled in Express, so the frontend can call Render directly</li>
            <li>The API base URL can be overridden with `VITE_API_BASE_URL`</li>
            <li>
              Successful submission expects <code>{'{ "success": true }'}</code>
            </li>
          </ol>
        </article>
      </section>
    </main>
  )
}

export default App
