# Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: "No matches showing" or "Only mock data"

**Possible Causes:**
1. **No matches scheduled today** - This is normal! Not every day has football matches
2. **API key invalid** - Check your API key is correct
3. **CORS error** - Browser blocking API calls
4. **Rate limit exceeded** - Too many API requests

**Solutions:**

#### Check Browser Console (F12)
1. Open browser console (F12)
2. Look for error messages
3. Check what the API is returning

#### Verify API Key
- Check `api.js` - make sure `useMockData: false`
- Verify API key is correct
- Test API key at: https://www.football-data.org/

#### CORS Issues
If you see CORS errors in console:
- The API might block browser requests
- Solution: Use a CORS proxy or deploy to a server
- For testing: Use a browser extension to disable CORS

#### Rate Limits
- Football-Data.org: 10 requests/minute
- If you hit limit, wait 1 minute and try again

### Issue 2: Team Analysis Not Working

**Check:**
1. Browser console for errors
2. Team name spelling (must match exactly)
3. API is responding

**Common Errors:**
- "Team not found" - Team name doesn't match API
- "Error fetching team analysis" - API call failed
- Check console for specific error

### Issue 3: H2H Has No Real Data

**Why:**
- H2H requires finding both teams in API
- Then fetching historical matches
- This can take time and multiple API calls

**Check:**
1. Are team names correct?
2. Check browser console for errors
3. Teams might not have played each other recently

### Issue 4: Predictions Seem Wrong

**Remember:**
- Predictions are based on statistics
- Football is unpredictable
- 60-70% accuracy is normal
- Even experts can't predict 100%

## Debugging Steps

### Step 1: Check Browser Console
1. Open website
2. Press F12
3. Go to "Console" tab
4. Look for:
   - ✅ Green checkmarks = Success
   - ⚠️ Yellow warnings = Issues
   - ❌ Red errors = Problems

### Step 2: Test API Directly
Test your API key:
```bash
curl -H "X-Auth-Token: YOUR_API_KEY" https://api.football-data.org/v4/matches?dateFrom=2024-01-15&dateTo=2024-01-15
```

### Step 3: Check Network Tab
1. F12 → Network tab
2. Click "Fetch Today's Matches"
3. Look for API requests
4. Check if they're successful (200) or failed (4xx/5xx)

### Step 4: Verify Configuration
Check `api.js`:
- `useMockData: false` ✅
- `apiKey` is set ✅
- `enabled: true` for API-Football and NewsAPI ✅

## Quick Fixes

### If No Matches Show:
1. **Try a specific league** instead of "All Leagues"
2. **Check if it's a match day** - Not every day has matches
3. **Try tomorrow's date** - There might be matches tomorrow

### If Team Analysis Fails:
1. **Check team name spelling** - Must match exactly
2. **Try full team name** - "Manchester United" not "Man Utd"
3. **Check console** for specific error

### If H2H Fails:
1. **Use exact team names** from the club database
2. **Wait a moment** - H2H takes multiple API calls
3. **Check console** for errors

## Still Not Working?

1. **Check API status**: https://www.football-data.org/
2. **Verify API key** is active
3. **Check rate limits** - wait if exceeded
4. **Try different date** - might be no matches today
5. **Check browser console** for specific errors

