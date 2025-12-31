# Quick Start Guide

## Get API Key (5 minutes)

1. **Go to Football-Data.org**: https://www.football-data.org/
2. **Sign up** for free account
3. **Get API token** from dashboard
4. **Update `api.js`**:
   - Replace `YOUR_API_KEY_HERE` with your actual token
   - Set `useMockData: false`

## Deploy to Vercel (10 minutes)

### 1. Push to GitHub

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/predictz.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `predictz` repository
5. Click "Deploy"
6. Done! 🎉

## Test Locally

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000

# Then open: http://localhost:8000
```

## Next Steps

- Read `API_SETUP.md` for detailed API configuration
- Read `DEPLOYMENT.md` for full deployment guide
- Customize predictions in `predictions.js`
- Style changes in `styles.css`

