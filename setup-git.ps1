# Git Setup Script for Predictz
# Run this script to configure Git and prepare for GitHub push

Write-Host "=== Predictz Git Setup ===" -ForegroundColor Green
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Configure Git (user will need to update these)
Write-Host ""
Write-Host "Configuring Git..." -ForegroundColor Yellow
Write-Host "Please update the email and name below with your actual details" -ForegroundColor Yellow
Write-Host ""

# Set Git config (user should update these)
$email = Read-Host "Enter your email (for Git commits)"
$name = Read-Host "Enter your name (for Git commits)"

if ($email -and $name) {
    git config user.email $email
    git config user.name $name
    Write-Host "✓ Git configured" -ForegroundColor Green
} else {
    Write-Host "⚠ Skipping Git config. Run manually:" -ForegroundColor Yellow
    Write-Host "  git config user.email 'your@email.com'" -ForegroundColor Cyan
    Write-Host "  git config user.name 'Your Name'" -ForegroundColor Cyan
}

# Initialize repository if not already done
if (-not (Test-Path .git)) {
    Write-Host ""
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Repository initialized" -ForegroundColor Green
}

# Add all files
Write-Host ""
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files added" -ForegroundColor Green

# Create initial commit
Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Predictz football prediction website"
Write-Host "✓ Initial commit created" -ForegroundColor Green

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. Create a repository on GitHub:" -ForegroundColor Yellow
Write-Host "   - Go to https://github.com/new" -ForegroundColor Cyan
Write-Host "   - Name it 'predictz' (or any name)" -ForegroundColor Cyan
Write-Host "   - Don't initialize with README" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Push to GitHub:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/predictz.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Deploy to Vercel:" -ForegroundColor Yellow
Write-Host "   - Go to https://vercel.com" -ForegroundColor Cyan
Write-Host "   - Sign in with GitHub" -ForegroundColor Cyan
Write-Host "   - Import your repository" -ForegroundColor Cyan
Write-Host "   - Click Deploy!" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Gray

