# GitHub Actions CI/CD Setup

This repository uses GitHub Actions for continuous integration and deployment. Below is an overview of all workflows and how to configure them.

## 📋 Workflows Overview

### 1. **CI Workflow** (`ci.yml`)
**Triggers:** Push and Pull Requests to `main` and `develop` branches

**What it does:**
- ✅ Builds backend and frontend on Node.js 18.x and 20.x
- ✅ Runs TypeScript type checking
- ✅ Runs ESLint on frontend code
- ✅ Creates build artifacts
- ✅ Performs integration checks

**Status Badge:**
```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
```

---

### 2. **Deploy Workflow** (`deploy.yml`)
**Triggers:** Push to `main` branch or manual trigger

**What it does:**
- 🚀 Deploys backend to Vercel
- 🚀 Deploys frontend to Vercel (after backend deployment)
- 📦 Builds production-ready bundles

**Required Secrets:**
- `VERCEL_TOKEN` - Your Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID_BACKEND` - Backend project ID on Vercel
- `VERCEL_PROJECT_ID_FRONTEND` - Frontend project ID on Vercel
- `VITE_API_URL` - API URL for frontend (e.g., `https://your-backend.vercel.app`)

---

### 3. **CodeQL Security Scan** (`codeql.yml`)
**Triggers:** 
- Push to `main` and `develop` branches
- Pull Requests to `main`
- Weekly schedule (Mondays at midnight)

**What it does:**
- 🔒 Scans for security vulnerabilities
- 🔍 Analyzes code quality issues
- 📊 Reports findings in Security tab

---

### 4. **Dependency Review** (`dependency-review.yml`)
**Triggers:** Pull Requests to `main` and `develop` branches

**What it does:**
- 📦 Reviews dependency changes in PRs
- ⚠️ Flags vulnerable dependencies
- 💬 Comments summary in PR
- ❌ Fails on moderate or higher severity issues

---

## 🔧 Setup Instructions

### Step 1: Configure GitHub Secrets

Go to your repository **Settings** → **Secrets and variables** → **Actions** and add:

#### For Vercel Deployment:

1. **Get Vercel Token:**
   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Get your token from https://vercel.com/account/tokens
   ```

2. **Get Vercel Organization and Project IDs:**
   ```bash
   # Navigate to backend directory
   cd backend
   vercel link
   
   # This creates .vercel/project.json with orgId and projectId
   # Copy these values
   
   # Repeat for frontend
   cd ../frontend
   vercel link
   ```

3. **Add these secrets to GitHub:**
   - `VERCEL_TOKEN` - From step 1
   - `VERCEL_ORG_ID` - From `.vercel/project.json`
   - `VERCEL_PROJECT_ID_BACKEND` - Backend project ID
   - `VERCEL_PROJECT_ID_FRONTEND` - Frontend project ID
   - `VITE_API_URL` - Your production backend URL

#### For MongoDB (if needed in CI):
- `MONGODB_URI` - MongoDB connection string for testing

---

### Step 2: Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Actions permissions", select **Allow all actions and reusable workflows**
3. Under "Workflow permissions", select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**

---

### Step 3: Enable Security Features

1. Go to **Settings** → **Security** → **Code security and analysis**
2. Enable:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ CodeQL analysis

---

## 🎯 Workflow Behavior

### On Pull Request:
```
1. CI workflow runs (build + lint + type check)
2. Dependency Review checks for vulnerable dependencies
3. CodeQL scans for security issues
4. All checks must pass before merge
```

### On Push to `main`:
```
1. CI workflow runs
2. Deploy workflow triggers (if CI passes)
3. Backend deploys to Vercel
4. Frontend deploys to Vercel
5. CodeQL security scan runs
```

### Weekly (Monday midnight):
```
1. CodeQL security scan runs
2. Results appear in Security tab
```

---

## 📊 Monitoring Workflows

### View Workflow Runs:
- Go to **Actions** tab in your repository
- Click on any workflow to see runs
- Click on a run to see detailed logs

### View Security Alerts:
- Go to **Security** tab
- Check **Code scanning alerts** for CodeQL findings
- Check **Dependabot alerts** for dependency issues

---

## 🚨 Troubleshooting

### CI Fails on Type Check:
```bash
# Run locally to see errors
cd backend
npx tsc --noEmit

cd ../frontend
npx tsc --noEmit
```

### CI Fails on Lint:
```bash
# Run locally
cd frontend
npm run lint
```

### Deployment Fails:
1. Check that all Vercel secrets are correctly set
2. Verify `VITE_API_URL` is set correctly
3. Check Vercel dashboard for deployment logs
4. Ensure `vercel.json` files are properly configured

### CodeQL Fails:
- Check the Security tab for specific issues
- Review the code changes that triggered the alert
- Fix security vulnerabilities before merging

---

## 🔄 Manual Deployment

You can manually trigger deployment:

1. Go to **Actions** tab
2. Select **Deploy** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

---

## 📝 Adding More Workflows

To add custom workflows:

1. Create a new `.yml` file in `.github/workflows/`
2. Define triggers, jobs, and steps
3. Commit and push to trigger the workflow

Example:
```yaml
name: My Custom Workflow

on:
  push:
    branches: [ main ]

jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run custom script
        run: echo "Hello World"
```

---

## 🎖️ Status Badges

Add these to your main README.md:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Deploy/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CodeQL%20Security%20Scan/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name.

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

---

## ⚡ Quick Commands

```bash
# Test build locally (backend)
cd backend
npm ci
npm run build

# Test build locally (frontend)
cd frontend
npm ci
npm run build

# Run linting
cd frontend
npm run lint

# Type check
npx tsc --noEmit
```

---

**Note:** Make sure to update the repository URL and secrets before pushing to production!
