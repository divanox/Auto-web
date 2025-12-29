# GitHub Actions Quick Reference

## 🚀 Quick Start

### 1. First Time Setup (5 minutes)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Link backend project
cd backend
vercel link
# Save the orgId and projectId from .vercel/project.json

# 4. Link frontend project
cd ../frontend
vercel link
# Save the orgId and projectId from .vercel/project.json

# 5. Add secrets to GitHub
# Go to: Settings → Secrets and variables → Actions
# Add the following secrets:
# - VERCEL_TOKEN (from https://vercel.com/account/tokens)
# - VERCEL_ORG_ID
# - VERCEL_PROJECT_ID_BACKEND
# - VERCEL_PROJECT_ID_FRONTEND
# - VITE_API_URL (your production backend URL)
```

### 2. Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Select **Allow all actions and reusable workflows**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**

### 3. Push to GitHub

```bash
git add .
git commit -m "ci: add GitHub Actions workflows"
git push origin main
```

---

## 📊 Workflow Summary

| Workflow | Trigger | Purpose | Duration |
|----------|---------|---------|----------|
| **CI** | Push/PR to main/develop | Build & test | ~3-5 min |
| **Deploy** | Push to main | Deploy to Vercel | ~5-7 min |
| **CodeQL** | Push/PR/Weekly | Security scan | ~5-10 min |
| **Dependency Review** | PR only | Check dependencies | ~1-2 min |
| **PR Checks** | PR opened/updated | Validate PR | ~1 min |

---

## 🎯 Common Scenarios

### Scenario 1: Creating a Pull Request

```bash
# 1. Create a new branch
git checkout -b feature/my-feature

# 2. Make your changes
# ... edit files ...

# 3. Commit with semantic format
git commit -m "feat: add new feature"

# 4. Push to GitHub
git push origin feature/my-feature

# 5. Create PR on GitHub
# Workflows that will run:
# ✓ CI (build & lint)
# ✓ Dependency Review
# ✓ PR Checks (validation)
# ✓ CodeQL (security)
```

**PR Title Format:**
- `feat: description` - New feature
- `fix: description` - Bug fix
- `docs: description` - Documentation
- `refactor: description` - Code refactoring
- `test: description` - Adding tests
- `ci: description` - CI/CD changes

### Scenario 2: Deploying to Production

```bash
# 1. Merge PR to main
git checkout main
git pull origin main

# 2. Workflows that run automatically:
# ✓ CI (build & lint)
# ✓ Deploy (backend → frontend)
# ✓ CodeQL (security)

# 3. Check deployment status
# Go to: Actions tab → Deploy workflow
```

### Scenario 3: Manual Deployment

```bash
# Option 1: Via GitHub UI
# 1. Go to Actions tab
# 2. Select "Deploy" workflow
# 3. Click "Run workflow"
# 4. Select branch and run

# Option 2: Via Vercel CLI (bypass GitHub Actions)
cd backend
vercel --prod

cd ../frontend
vercel --prod
```

### Scenario 4: Fixing Failed CI

```bash
# 1. Check what failed
# Go to: Actions tab → Failed workflow → Click on failed job

# 2. Common fixes:

# TypeScript errors:
cd backend  # or frontend
npx tsc --noEmit
# Fix the errors shown

# Linting errors:
cd frontend
npm run lint
# Fix the errors shown

# Build errors:
npm run build
# Fix the errors shown

# 3. Commit and push fix
git add .
git commit -m "fix: resolve CI errors"
git push
```

---

## 🔍 Monitoring & Debugging

### View Workflow Logs

```bash
# 1. Go to Actions tab
# 2. Click on workflow run
# 3. Click on job name
# 4. Expand steps to see logs
```

### Download Build Artifacts

```bash
# 1. Go to Actions tab
# 2. Click on successful workflow run
# 3. Scroll to "Artifacts" section
# 4. Download "backend-dist" or "frontend-dist"
```

### Check Security Alerts

```bash
# 1. Go to Security tab
# 2. Check "Code scanning alerts" (CodeQL)
# 3. Check "Dependabot alerts" (Dependencies)
# 4. Click on alert to see details and fix
```

---

## 🛠️ Troubleshooting

### Problem: Deployment fails with "Invalid token"

**Solution:**
```bash
# 1. Generate new Vercel token
# Visit: https://vercel.com/account/tokens

# 2. Update GitHub secret
# Go to: Settings → Secrets → VERCEL_TOKEN → Update
```

### Problem: CI fails on type check

**Solution:**
```bash
# Run locally to see errors
cd backend
npx tsc --noEmit

cd ../frontend
npx tsc --noEmit

# Fix the TypeScript errors
# Commit and push
```

### Problem: Frontend build fails with "VITE_API_URL is not defined"

**Solution:**
```bash
# 1. Add VITE_API_URL to GitHub secrets
# Go to: Settings → Secrets → New repository secret
# Name: VITE_API_URL
# Value: https://your-backend.vercel.app

# 2. Or update frontend/.env
echo "VITE_API_URL=http://localhost:5000" > frontend/.env
```

### Problem: PR checks fail on title format

**Solution:**
```bash
# Update PR title to follow semantic format:
# ✓ feat: add user authentication
# ✓ fix: resolve login bug
# ✓ docs: update README
# ✗ Update code (wrong format)
# ✗ WIP (wrong format)
```

---

## 📈 Best Practices

### ✅ DO:
- Write semantic commit messages
- Keep PRs small and focused
- Run tests locally before pushing
- Review CI logs when failures occur
- Update documentation with code changes
- Use feature branches for development
- Squash commits before merging

### ❌ DON'T:
- Push directly to main (use PRs)
- Commit large files (>5MB)
- Commit sensitive data (.env files)
- Ignore CI failures
- Skip code reviews
- Merge PRs with failing checks

---

## 🎖️ Status Badges

Add to your main README.md:

```markdown
![CI](https://github.com/USERNAME/REPO/workflows/CI/badge.svg)
![Deploy](https://github.com/USERNAME/REPO/workflows/Deploy/badge.svg)
![CodeQL](https://github.com/USERNAME/REPO/workflows/CodeQL%20Security%20Scan/badge.svg)
```

---

## 📞 Getting Help

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Vercel Docs:** https://vercel.com/docs
- **Workflow Syntax:** https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

---

## 🔄 Updating Workflows

To modify workflows:

```bash
# 1. Edit workflow file
code .github/workflows/ci.yml

# 2. Test locally (optional)
# Install act: https://github.com/nektos/act
act -l  # List workflows
act push  # Test push event

# 3. Commit and push
git add .github/workflows/
git commit -m "ci: update workflow"
git push
```

---

**Last Updated:** December 2025
