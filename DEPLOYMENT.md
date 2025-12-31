# Deployment Guide - Predictz to Vercel

This guide will help you deploy your Predictz website to Vercel using Git.

## Prerequisites

- Git installed on your computer
- GitHub account (free)
- Vercel account (free)

## Step 1: Initialize Git Repository

1. Open terminal/command prompt in your project directory (`C:\Users\JOE\Desktop\Predictz`)

2. Initialize Git:
```bash
git init
```

3. Add all files:
```bash
git add .
```

4. Create initial commit:
```bash
git commit -m "Initial commit: Predictz football prediction website"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in top right → "New repository"
3. Repository name: `predictz` (or any name you prefer)
4. Description: "Football match prediction website"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 3: Push to GitHub

GitHub will show you commands. Run these in your terminal:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/predictz.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

If prompted for credentials:
- Use GitHub Personal Access Token (not password)
- Get token from: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

## Step 4: Deploy to Vercel

### Option A: Via Vercel Website (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up/login (use GitHub to sign in)

2. Click **"Add New..."** → **"Project"**

3. Import your GitHub repository:
   - Find `predictz` repository
   - Click **"Import"**

4. Configure Project:
   - **Framework Preset**: Other (or leave default)
   - **Root Directory**: `./` (default)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty (root)

5. **Environment Variables** (if using API):
   - Click "Environment Variables"
   - Add: `FOOTBALL_DATA_API_KEY` = `your_api_key_here`
   - Or add your API key directly in `api.js` (less secure)

6. Click **"Deploy"**

7. Wait for deployment (usually 1-2 minutes)

8. Your site will be live at: `https://predictz.vercel.app` (or custom domain)

### Option B: Via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow prompts to link project

## Step 5: Configure API Key (Important!)

### For Production (Recommended):

1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Name**: `FOOTBALL_DATA_API_KEY`
   - **Value**: Your actual API key
   - **Environment**: Production, Preview, Development

3. Update `api.js` to read from environment:
```javascript
// At the top of api.js, add:
const API_KEY = typeof process !== 'undefined' && process.env 
    ? process.env.FOOTBALL_DATA_API_KEY 
    : 'YOUR_API_KEY_HERE';

// Then update API_CONFIG:
const API_CONFIG = {
    apiKey: API_KEY,
    headers: {
        'X-Auth-Token': API_KEY
    }
};
```

**Note**: For client-side JavaScript, you'll need to use Vercel Serverless Functions or keep the key in the code (less secure but simpler for static sites).

## Step 6: Automatic Deployments

Vercel automatically deploys when you push to GitHub:

1. Make changes to your code
2. Commit and push:
```bash
git add .
git commit -m "Update predictions"
git push
```

3. Vercel will automatically build and deploy your changes!

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all files are committed
- Verify `vercel.json` is correct

### API Not Working
- Check API key is correct
- Verify CORS settings
- Check browser console for errors
- Some APIs require server-side calls (use Vercel Functions)

### Site Not Loading
- Check deployment logs in Vercel dashboard
- Verify `index.html` is in root directory
- Check file paths are correct

## Custom Domain (Optional)

1. In Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Need Help?

- Vercel Docs: https://vercel.com/docs
- GitHub Docs: https://docs.github.com
- Check deployment logs in Vercel dashboard

