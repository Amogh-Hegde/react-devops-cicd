# DevOps Lab Write-Up

## Full-Stack Contact Application with Jenkins CI/CD Pipeline

## 1. Problem Statement

The goal of this project is to build and deliver a simple full-stack contact application using a proper DevOps workflow. The frontend is a React + Vite contact landing page where users submit their name, email, and message. The backend is an Express.js API connected to MongoDB, which stores the submitted contact data.

The project is integrated with Jenkins so that every code update can be automatically checked, scanned, built, containerized, published, and deployed. This project demonstrates how modern DevOps practices improve software delivery by combining source control, code quality checks, security scanning, automated build, Docker image creation, deployment, and post-deployment testing in one pipeline.

## 2. Tech Stack Used

| Area | Tool / Technology |
| --- | --- |
| Frontend | React 19, Vite 7, HTML, CSS, JavaScript |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Source Control | Git and GitHub |
| CI/CD Tool | Jenkins |
| Code Quality | ESLint |
| Security Scan | Trivy |
| Containerization | Docker |
| Container Registry | Docker Hub |
| Frontend Deployment | Vercel |
| Backend Hosting | Render |
| Web Server (Prod) | Nginx |

## 3. Application Overview

This application contains:

- A frontend contact form that sends user details to the backend API
- A backend `/api/contact` endpoint that saves submitted messages in MongoDB
- A protected cleanup endpoint `/api/contact/cleanup` used by Jenkins for pipeline smoke testing
- A Jenkins pipeline that automates linting, scanning, building, Docker image creation, image push, deployment, and backend round-trip verification

## 4. Pipeline Diagram

The complete Jenkins CI/CD pipeline flow is illustrated below:

```text
Developer pushes code to GitHub
            |
            v
GitHub webhook triggers Jenkins
            |
            v
Clone Repository
            |
            v
Install Dependencies
            |
            v
ESLint Code Quality Check
            |
            v
Trivy Filesystem Scan
            |
            v
Build React App
            |
            v
Check Docker Availability
            |
            v
Build Docker Image
            |
            v
Push Docker Image to Docker Hub
            |
            v
Deploy Frontend to Vercel
            |
            v
Run Backend E2E Round-Trip Test
            |
            v
Archive Artifacts and Clean Workspace
```

## 5. Jenkins Pipeline Stages, Tool Used, and Outcome

| # | Stage | Tool | Output |
| --- | --- | --- | --- |
| 1 | Clone Repository | Jenkins + Git SCM | Project files in workspace |
| 2 | Install Dependencies | Node.js + npm | Ready for lint and build |
| 3 | ESLint Check | ESLint | `eslint-report.json` |
| 4 | Trivy Scan | Trivy | `trivy-report.json` |
| 5 | Build React App | Vite | `dist/` generated |
| 6 | Docker Availability | Docker | Docker confirmed |
| 7 | Build Docker Image | Docker | Image tags created |
| 8 | Push to Docker Hub | Docker + Docker Hub | Image published |
| 9 | Deploy to Vercel | Vercel CLI | Frontend deployed |
| 10 | E2E Backend Test | `curl` + Node.js | Backend verified |
| 11 | Archive & Cleanup | Jenkins | Reports archived |

### Stage Details

**Stage 1: Clone Repository**

Jenkins uses Git SCM to pull the latest source code from the GitHub repository. This ensures Jenkins always operates on the most recent version of the codebase.

**Stage 2: Install Dependencies**

`npm ci` is used instead of `npm install` because it installs exactly what is in `package-lock.json` without modifying it, making builds reproducible and faster in CI environments.

**Stage 3: ESLint Code Quality Check**

ESLint scans the frontend code for syntax errors, style violations, and code quality issues. The output is saved as `eslint-report.json` and archived as a build artifact.

**Stage 4: Trivy Filesystem Scan**

Trivy scans the repository filesystem for known CVEs, exposed secrets, and misconfigurations. The result is stored in `trivy-report.json` to provide a security audit trail.

**Stage 5: Build React App**

Vite compiles the React application into optimized static files and places them in the `dist/` folder. This build is what eventually gets served by Nginx in production.

**Stage 6: Check Docker Availability**

A quick check confirms that the Jenkins build agent can reach the Docker daemon. This step prevents wasted time on later stages if Docker is unavailable.

**Stage 7: Build Docker Image**

A multi-stage Dockerfile is used. Stage 1 (`node:20-alpine`) installs dependencies and runs the Vite build. Stage 2 (`nginx:1.27-alpine`) copies only the `dist/` files, keeping the image lean.

**Stage 8: Push Docker Image to Docker Hub**

Jenkins authenticates with Docker Hub using stored credentials, then tags and pushes the image with both the `BUILD_NUMBER` and `latest` tags for traceability and convenience.

**Stage 9: Deploy Frontend to Vercel**

The Vercel CLI is invoked with a project token stored in Jenkins credentials. The latest production build is published, making it immediately accessible on the Vercel CDN.

**Stage 10: Run Backend E2E Round-Trip Test**

A `curl` command POSTs a synthetic contact form submission to the deployed Render backend. The cleanup endpoint then deletes the test record. Success of both confirms the deployed API is fully operational.

**Stage 11: Archive Artifacts and Clean Workspace**

ESLint and Trivy reports are archived within Jenkins for later review. The workspace is then wiped to prevent stale files from polluting subsequent builds.

## 6. How Docker Is Used in This Project

The project uses a multi-stage Dockerfile to reduce the final image size while keeping the build process clean:

Stage 1 `node:20-alpine` - Installs all npm dependencies and runs the Vite production build. This stage produces the `dist/` output.

Stage 2 `nginx:1.27-alpine` - Copies only the compiled static files from Stage 1 and serves them via Nginx. No Node.js, no source code, minimal attack surface.

This approach results in a much smaller final image and is a Docker best practice for production deployments.

## 7. Successful Build Status

The following checks were verified from the repository:

- Dependency installation (`npm ci`) - Successful
- Lint check (`npm run lint`) - Successful
- Production build (`npm run build`) - Successful
- `dist/` folder generated with optimized assets - Confirmed
- CI pipeline definition (`Jenkinsfile.full`) - Present
- Dockerfile - Present

## 8. Important Git Commands for Viva

`git clone <repository-url>`  
Purpose: Downloads the project from GitHub to the local machine.

`git status`  
Purpose: Shows modified, staged, and untracked files.

`git add .`  
Purpose: Stages all updated files for commit.

`git commit -m "Updated DevOps pipeline and app changes"`  
Purpose: Saves a snapshot of the staged changes in Git history.

`git push origin main`  
Purpose: Uploads local commits to the remote repository.

`git pull origin main`  
Purpose: Fetches and merges the latest remote changes into the local branch.

`git log --oneline`  
Purpose: Displays a short and readable commit history.

## 9. Important Docker Commands for Viva

`docker build -t react-vite-devops-cicd .`  
Purpose: Builds the application image from the Dockerfile.

`docker images`  
Purpose: Lists locally available Docker images.

`docker run -d -p 8081:80 react-vite-devops-cicd`  
Purpose: Runs the built image as a container, mapping port `8081` on the host to port `80` in the container.

`docker ps`  
Purpose: Shows currently running containers.

`docker stop <container-id>`  
Purpose: Stops the selected running container.

`docker rm <container-id>`  
Purpose: Deletes a stopped container.

`docker login`  
Purpose: Authenticates Docker with Docker Hub.

`docker tag react-vite-devops-cicd <dockerhub-username>/react-vite-devops-cicd:latest`  
Purpose: Prepares the local image with a Docker Hub repository tag.

`docker push <dockerhub-username>/react-vite-devops-cicd:latest`  
Purpose: Uploads the Docker image to Docker Hub.

`docker pull <dockerhub-username>/react-vite-devops-cicd:latest`  
Purpose: Downloads the image from Docker Hub to another machine.

## 10. Tools Used and Their Role

| Tool | Role in Project |
| --- | --- |
| GitHub | Stores and versions the source code; triggers Jenkins via webhooks |
| Jenkins | Automates all CI/CD stages from clone to deployment |
| ESLint | Checks code quality and enforces coding standards |
| Trivy | Performs security scanning for vulnerabilities and misconfigurations |
| Docker | Creates portable, reproducible application containers |
| Docker Hub | Stores and distributes the built container image |
| Vercel | Hosts and serves the React frontend deployment |
| Render | Hosts the Express.js backend API |
| MongoDB | Stores submitted contact form records |

## 11. Outcomes of the Project

- A working full-stack contact application was prepared
- Source code was managed through GitHub
- CI/CD automation was implemented using Jenkins
- Code quality validation was added using ESLint
- Security scanning was added using Trivy
- The frontend was built successfully for production
- The application was containerized using Docker
- The Docker image was prepared for Docker Hub publishing
- The frontend deployment flow was configured for Vercel
- Backend smoke testing was added to validate deployed API behaviour

## 12. Conclusion

This DevOps lab demonstrates a complete software delivery workflow for a modern web application. The project combines development, testing, security scanning, containerization, deployment, and validation inside one Jenkins pipeline. It shows how DevOps improves speed, consistency, and confidence in releasing software.

Because the project includes GitHub, Jenkins, Docker, Docker Hub, Vercel, and backend API testing, it serves as a strong end-to-end CI/CD implementation example with all the essential components of a real-world DevOps workflow.

## 13. Viva Preparation Notes

1. Be ready to explain why `npm ci` is preferred in CI over `npm install` (reproducible installs, no lockfile mutation).
2. Be ready to explain why Trivy is used before deployment (catch vulnerabilities before they reach production).
3. Be ready to explain the difference between building a Docker image and running a Docker container.
4. Be ready to explain why the Dockerfile uses two stages (smaller final image, no build tools in production).
5. Be ready to explain how Jenkins uses credentials for Docker Hub and Vercel (stored as secret text/credential bindings).
6. Be ready to explain how the backend smoke test proves the deployed API is working (POST + DELETE round-trip via `curl`).
