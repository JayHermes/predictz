# API Setup Guide

This guide will help you set up a livescore API for the Predictz website.

## Recommended Free/Cheap API Options

### 1. **Football-Data.org** (FREE Tier Available) ⭐ RECOMMENDED
- **Website**: https://www.football-data.org/
- **Free Tier**: 10 requests per minute
- **Features**: Matches, standings, teams, players
- **Sign Up**: Free account required
- **API Key**: Get from dashboard after signup

### 2. **API-Football (RapidAPI)** (FREE Tier Available)
- **Website**: https://www.api-football.com/
- **Free Tier**: 100 requests/day
- **Features**: Comprehensive football data
- **Sign Up**: Via RapidAPI
- **API Key**: From RapidAPI dashboard

### 3. **SoccersAPI**
- **Website**: https://soccersapi.com/
- **Free Trial**: 7 days
- **Features**: Live scores, statistics, odds
- **Pricing**: Paid after trial

### 4. **Score24**
- **Website**: https://score24.com/
- **Features**: Real-time scores, match details
- **Pricing**: Contact for pricing

## Quick Setup with Football-Data.org (Recommended)

### Step 1: Sign Up
1. Go to https://www.football-data.org/
2. Click "Sign Up" or "Register"
3. Create a free account
4. Verify your email

### Step 2: Get API Key
1. Log in to your account
2. Go to "API" section
3. Copy your API token (starts with something like `YOUR_API_TOKEN`)

### Step 3: Configure in Code
1. Open `api.js`
2. Update the `API_CONFIG` object:
```javascript
const API_CONFIG = {
    provider: 'football-data',
    baseUrl: 'https://api.football-data.org/v4',
    apiKey: 'YOUR_ACTUAL_API_TOKEN_HERE',
    headers: {
        'X-Auth-Token': 'YOUR_ACTUAL_API_TOKEN_HERE'
    }
};
```

### Step 4: Update API Functions
The `api.js` file includes example implementations for Football-Data.org API.

## Environment Variables (Recommended for Production)

For security, use environment variables instead of hardcoding API keys:

1. Create a `.env` file (already in .gitignore):
```
FOOTBALL_DATA_API_KEY=your_api_key_here
```

2. For Vercel deployment:
   - Go to Vercel project settings
   - Add environment variable: `FOOTBALL_DATA_API_KEY`
   - Value: Your actual API key

3. Update `api.js` to read from environment:
```javascript
const API_CONFIG = {
    apiKey: process.env.FOOTBALL_DATA_API_KEY || 'YOUR_API_KEY_HERE'
};
```

## API Rate Limits

- **Football-Data.org Free**: 10 requests/minute
- **API-Football Free**: 100 requests/day
- Implement caching to avoid hitting limits

## Testing Your API

1. Test the API directly:
```bash
curl -H "X-Auth-Token: YOUR_API_KEY" https://api.football-data.org/v4/matches
```

2. Or use the browser console in your website to test API calls

## Need Help?

- Check API documentation for your chosen provider
- Test endpoints using Postman or curl
- Check browser console for API errors
- Verify API key is correct and active

