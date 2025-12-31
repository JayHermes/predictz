# Next Steps - Push to GitHub & Deploy

## ✅ What's Done

- ✅ API key configured: `7a37e1457f714a63b39d16c332a5eef6`
- ✅ Mock data disabled (using real API)
- ✅ Git configured (email: samjoejnr@gmail.com, username: JayHermes)
- ✅ All files committed
- ✅ Branch renamed to `main`

## 🚀 Push to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `predictz` (or any name you prefer)
3. Description: "Football match prediction website"
4. Choose **Public** or **Private**
5. **DO NOT** check "Initialize with README" (we already have files)
6. Click **"Create repository"**

### Step 2: Push Your Code

Run these commands in your terminal (in the Predictz folder):

```powershell
git remote add origin https://github.com/JayHermes/predictz.git
git push -u origin main
```

**Note**: If you used a different repository name, replace `predictz` with your repository name.

If prompted for credentials:
- **Username**: JayHermes
- **Password**: Use a GitHub Personal Access Token (not your password)
  - Get token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token

## 🌐 Deploy to Vercel

### Option 1: Via Website (Easiest)

1. Go to https://vercel.com
2. Sign up/Login (use "Continue with GitHub")
3. Click **"Add New..."** → **"Project"**
4. Find and select your `predictz` repository
5. Click **"Import"**
6. Click **"Deploy"** (no configuration needed - it's a static site)
7. Wait 1-2 minutes
8. Your site will be live at: `https://predictz.vercel.app` (or similar)

### Option 2: Via CLI

```powershell
npm install -g vercel
vercel login
vercel
```

## 🎉 You're Done!

Your website will:
- Fetch real match data from Football-Data.org API
- Generate predictions with rankings
- Be live on the internet!

## 📝 Important Notes

- The API key is in your code (for static sites, this is okay)
- For production, consider using Vercel Environment Variables (see DEPLOYMENT.md)
- API rate limit: 10 requests/minute (free tier)
- The site will automatically fall back to mock data if API fails

## 🔗 Quick Links

- GitHub: https://github.com/JayHermes
- Vercel: https://vercel.com
- Football-Data API: https://www.football-data.org/

