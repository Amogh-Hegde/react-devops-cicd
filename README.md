# React + Vite DevOps CI/CD with Jenkins

This project is a beginner-friendly frontend application built with React and Vite, then wired into a complete DevOps workflow using:

- GitHub for source control
- Jenkins for CI/CD
- ESLint for code quality
- Trivy for vulnerability scanning
- Docker for containerization
- Docker Hub for image publishing
- Vercel for deployment

The repository includes two separate declarative Jenkins pipelines:

- `Jenkinsfile.full`: runs the complete flow including Docker Hub push
- `Jenkinsfile.no-docker-push`: runs the same flow but skips the Docker push stage

## Project Structure

```text
react-devops-cicd/
├── Dockerfile
├── .dockerignore
├── Jenkinsfile.full
├── Jenkinsfile.no-docker-push
├── eslint.config.js
├── package.json
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
└── README.md
```

## Features

- React + Vite frontend app
- Clean responsive UI
- Example API fetch using `https://jsonplaceholder.typicode.com/posts?_limit=3`
- Production-ready `npm run build`
- ESLint support
- Trivy filesystem scan in Jenkins
- Docker image build
- Vercel deployment from Jenkins

## Local Setup on macOS

### 1. Install prerequisites

Install these tools first:

- Node.js 20+
- npm
- Docker Desktop
- Jenkins
- Trivy
- Vercel CLI
- Git

Helpful macOS commands:

```bash
brew install node
brew install trivy
npm install -g vercel
```

Install Jenkins with Homebrew:

```bash
brew install jenkins-lts
brew services start jenkins-lts
```

Jenkins usually opens at:

```text
http://localhost:8080
```

### 2. Run the app locally

```bash
npm ci
npm run dev
```

Open:

```text
http://localhost:5173
```

### 3. Test quality and production build locally

```bash
npm run lint
npm run build
```

## Docker Commands

Build the Docker image:

```bash
docker build -t react-vite-devops-cicd .
```

Run the container:

```bash
docker run -d -p 8081:80 react-vite-devops-cicd
```

Open:

```text
http://localhost:8081
```

## Vercel CLI Commands

Login once:

```bash
vercel login
```

Deploy manually from your terminal:

```bash
vercel
```

Deploy to production:

```bash
vercel --prod
```

If you want the repo linked first:

```bash
vercel link
```

## Jenkins Pipeline Overview

### Pipeline 1: `Jenkinsfile.full`

Stages:

1. Clone repository
2. Install npm dependencies
3. Run ESLint
4. Run Trivy filesystem scan
5. Build React/Vite app
6. Build Docker image
7. Push Docker image to Docker Hub
8. Deploy to Vercel

### Pipeline 2: `Jenkinsfile.no-docker-push`

Stages:

1. Clone repository
2. Install npm dependencies
3. Run ESLint
4. Run Trivy filesystem scan
5. Build React/Vite app
6. Build Docker image
7. Deploy to Vercel

This second pipeline skips only the Docker push stage.

## Jenkins Setup Instructions

### 1. Install recommended Jenkins plugins

Inside Jenkins, install:

- Pipeline
- Git
- GitHub Integration
- Credentials Binding
- Docker Pipeline
- Workspace Cleanup

### 2. Create Jenkins credentials

Go to:

```text
Manage Jenkins -> Credentials -> System -> Global credentials
```

Create these credentials as `Secret text` entries:

| Credential ID | Purpose |
|---|---|
| `dockerhub-username` | Your Docker Hub username |
| `dockerhub-password` | Your Docker Hub password or access token |
| `vercel-token` | Your Vercel access token |
| `vercel-org-id` | Your Vercel organization/team ID |
| `vercel-project-id` | Your Vercel project ID |

You can find your Vercel token from the Vercel dashboard.

To get the Vercel project metadata locally after linking:

```bash
cat .vercel/project.json
```

Example file content:

```json
{
  "projectId": "prj_xxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxx"
}
```

### 3. Create the Jenkins job

1. In Jenkins, click `New Item`
2. Enter a job name such as `react-vite-full-pipeline`
3. Choose `Pipeline`
4. Under `Pipeline Definition`, choose `Pipeline script from SCM`
5. Choose `Git`
6. Add your GitHub repository URL
7. Set `Script Path` to either:
   - `Jenkinsfile.full`
   - `Jenkinsfile.no-docker-push`
8. Save the job

## GitHub Webhook Setup Instructions

To trigger Jenkins automatically after each push:

1. Open your GitHub repository
2. Go to `Settings -> Webhooks`
3. Click `Add webhook`
4. Use this payload URL:

```text
http://YOUR_JENKINS_URL/github-webhook/
```

Examples:

```text
http://localhost:8080/github-webhook/
http://your-public-jenkins-domain/github-webhook/
```

5. Set `Content type` to:

```text
application/json
```

6. Choose:

```text
Just the push event
```

7. Save the webhook

Inside Jenkins job configuration, also enable:

```text
GitHub hook trigger for GITScm polling
```

## Environment Variables Used in Jenkins

The pipelines use these environment variables:

- `DOCKER_IMAGE_NAME`
- `DOCKERHUB_USERNAME`
- `VERCEL_TOKEN`

The Vercel CLI stage also expects:

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Trivy Command Used

The pipelines run this command:

```bash
trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 --no-progress .
```

This fails the build if Trivy finds high or critical issues.

## Example Jenkins Agent Requirements

The Jenkins machine or agent should have:

- Git
- Node.js and npm
- Docker
- Trivy
- Internet access for npm and Vercel CLI

Quick verification commands:

```bash
node -v
npm -v
docker --version
trivy --version
```

## GitHub Push Workflow

Typical flow:

1. Push code to GitHub
2. GitHub webhook notifies Jenkins
3. Jenkins runs one of the pipeline files
4. Jenkins lints, scans, builds, packages, and deploys
5. Vercel publishes the frontend

## Notes for Beginners

- Use `npm ci` in CI because it is faster and more predictable than `npm install`
- Docker Hub often works best with an access token instead of your password
- Vercel deployment from CI is easiest after running `vercel link` once locally
- If Trivy is not installed on your Jenkins machine, the scan stage will fail until you install it
- If Docker is not running, the Docker build stage will fail

## Useful Commands Summary

Run locally:

```bash
npm ci
npm run dev
```

Check lint:

```bash
npm run lint
```

Build app:

```bash
npm run build
```

Build Docker image:

```bash
docker build -t react-vite-devops-cicd .
```

Run Docker container:

```bash
docker run -p 8081:80 react-vite-devops-cicd
```

Deploy with Vercel CLI:

```bash
vercel --prod
```
