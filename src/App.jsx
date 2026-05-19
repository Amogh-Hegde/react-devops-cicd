import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [deploymentCount, setDeploymentCount] = useState(3)
  const [releaseNotes, setReleaseNotes] = useState([])
  const [status, setStatus] = useState('loading')
  const unusedVariable = "demo" //ESLINT ERROR 
  useEffect(() => {
    let isMounted = true

    async function loadReleaseNotes() {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=3',
        )

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (isMounted) {
          setReleaseNotes(data)
          setStatus('success')
        }
      } catch {
        if (isMounted) {
          setStatus('error')
        }
      }
    }

    loadReleaseNotes()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="eyebrow">React + Vite DevOps Starter</div>
        <h1>WHY ARE YOU RUNNING?!?!?!?</h1>
        <h1>Ship a frontend app with Jenkins, Docker, Trivy, and Vercel.</h1>
        <p className="hero-copy">
          This demo UI mirrors the pipeline in this repository: lint the code,
          scan for vulnerabilities, build the app, package it with Docker, and
          deploy from Jenkins.
        </p>

        <div className="hero-actions">
          <a
            className="primary-action"
            href="https://vite.dev/guide/"
            target="_blank"
            rel="noreferrer"
          >
            Read Vite Docs
          </a>
          <button
            type="button"
            className="secondary-action"
            onClick={() => setDeploymentCount((count) => count + 1)}
          >
            Simulate Deploy #{deploymentCount}
          </button>
        </div>
      </section>

      <section className="stats-grid" aria-label="Pipeline summary">
        <article className="stat-card">
          <span className="stat-label">Lint</span>
          <strong>ESLint checks</strong>
          <p>Runs before every build to catch React and JavaScript issues.</p>
        </article>
        <article className="stat-card">
          <span className="stat-label">Security</span>
          <strong>Trivy filesystem scan</strong>
          <p>Scans the workspace for known vulnerabilities and misconfigurations.</p>
        </article>
        <article className="stat-card">
          <span className="stat-label">Release</span>
          <strong>Jenkins to Vercel</strong>
          <p>Build artifacts are deployed to Vercel with the CLI and token auth.</p>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">Live API Example</div>
              <h2>Recent release notes</h2>
            </div>
            <span className={`status-pill status-${status}`}>
              {status === 'loading' && 'Fetching'}
              {status === 'success' && 'Live'}
              {status === 'error' && 'Fallback needed'}
            </span>
          </div>

          {status === 'loading' && (
            <p className="helper-text">
              Loading sample items from JSONPlaceholder to demonstrate API usage.
            </p>
          )}

          {status === 'error' && (
            <p className="helper-text">
              The sample API could not be reached. Your CI/CD setup still works
              locally and in Jenkins.
            </p>
          )}

          {status === 'success' && (
            <ul className="release-list">
              {releaseNotes.map((note) => (
                <li key={note.id}>
                  <strong>{note.title}</strong>
                  <p>{note.body}</p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <div className="eyebrow">Pipeline Stages</div>
          <h2>What Jenkins will do</h2>
          <ol className="pipeline-list">
            <li>Clone the GitHub repository</li>
            <li>Install packages with npm</li>
            <li>Run ESLint</li>
            <li>Run Trivy filesystem scan</li>
            <li>Build the Vite application</li>
            <li>Build the Docker image</li>
            <li>Optionally push to Docker Hub</li>
            <li>Deploy to Vercel</li>
          </ol>
        </article>
      </section>
    </main>
  )
}

export default App
