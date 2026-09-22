# Hono TypeScript Backend - Deployment Template

A production-ready template for building and deploying a **TypeScript backend powered by [Hono](https://hono.dev)** to your server using **GitHub Actions**, with built-in support for both **Docker** and **non-Docker (PM2 / Systemd)** deployments.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js >= 20
- npm, pnpm, or bun
- Docker (optional, for containerized testing)

### Installation
```bash
npm install
```

### Run Locally
```bash
# Run in watch mode with tsx
npm run dev

# Compile TypeScript
npm run build

# Run compiled output
npm run start
```

Default server URL: `http://localhost:3000`  
Health check endpoint: `http://localhost:3000/health`

### Local Docker Testing
```bash
# Build and run with Docker Compose
docker compose up --build
```

---

## Deployment Architecture

### 1. Docker Deployment (Default)
The workflow located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) performs:
1. **Typecheck & Build**: Compiles TypeScript using `tsc` to verify no compilation errors.
2. **Build & Push Docker Image**: Packages the application into a lightweight multi-stage `node:22-alpine` container and pushes it to **GitHub Container Registry (`ghcr.io`)**.
3. **Deploy to Server via SSH**:
   - Connects to your server securely using SSH.
   - Pulls the newest image from `ghcr.io`.
   - Restarts the container with zero downtime.
   - Cleans up older unused Docker images.

### 2. Non-Docker Deployment (PM2 / Systemd)
If you prefer deploying directly to a Node.js runtime on your server without Docker:
1. Replace `.github/workflows/deploy.yml` with the template in [`.github/workflows/deploy-non-docker.yml.example`](.github/workflows/deploy-non-docker.yml.example).
2. The workflow compiles TypeScript in GitHub Actions, syncs `dist/` and `package.json` to `/var/www/hono-backend` on your server via rsync, and restarts the process using PM2 or systemd.

---

## GitHub Repository Secrets Configuration

To enable automated server deployment, go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**, and configure the following:

| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `SERVER_HOST` | Your server's public IP address or domain | `192.0.2.1` or `api.example.com` |
| `SERVER_USER` | SSH user with permissions to run Docker or deploy | `ubuntu`, `root`, or `deploy` |
| `SERVER_SSH_KEY` | Private SSH key (OpenSSH format) corresponding to authorized keys on the server | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `SERVER_PORT` | *(Optional)* SSH port (defaults to 22 if omitted) | `22` |
| `APP_PORT` | *(Optional)* Public port mapping on your server (defaults to 3000) | `3000` |

> [!TIP]
> If `SERVER_HOST` is not yet configured, the CI workflow will still build and typecheck your code and create the Docker container in GHCR. The SSH deployment step runs automatically once the secrets are added.

---

## Copying This Template to a New Project

1. **Copy Files**: Copy this directory into your new backend repository.
2. **Update Package Name**: Change `"name"` in `package.json`.
3. **Set Secrets**: Add `SERVER_HOST`, `SERVER_USER`, and `SERVER_SSH_KEY` to the new GitHub repository.
4. **Push**: Commit and push to `main` or `release` branch. GitHub Actions will handle the rest!
