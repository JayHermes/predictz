# Debugging Guide - Why Things Aren't Working

## Quick Diagnosis Steps

### Step 1: Open Browser Console (F12)
1. Press **F12** in your browser
2. Go to **Console** tab
3. Click "Fetch Today's Matches"
4. Look for error messages

### Step 2: Check What You See

**If you see:**
- ✅ `✅ Fetched REAL fixtures and statistics from API` = API is working!
- ⚠️ `⚠️ Using MOCK data` = API not configured or useMockData is true
- ❌ `❌ Error fetching matches` = API call failed
- 🔴 `CORS error` = Browser blocking API (needs server deployment)

### Step 3: Test APIs Directly

Open `test-api.html` in your browser to test each API individually.

## Common Issues & Fixes

### Issue 1: "Only Mock Data Showing"

**Check:**
1. Open `api.js`
2. Verify: `useMockData: false` ✅
3. Verify: `apiKey` is set (not 'YOUR_API_KEY_HERE') ✅

**If still showing mock:**
- API might be failing silently
- Check browser console for errors
- API key might be invalid
- Rate limit might be exceeded

### Issue 2: "No Matches Showing"

**This is NORMAL if:**
- No matches scheduled today
- It's an off-day for football
- Selected league has no matches

**Solutions:**
- Try selecting a specific league
- The code now fetches next 7 days of matches
- Check if there are actually matches scheduled

### Issue 3: "Team Analysis Doesn't Work"

**Check:**
1. Team name spelling (must be exact)
2. Browser console for errors
3. Team must be in supported leagues

**Common Errors:**
- "Team not found" = Wrong spelling
- "Error fetching" = API issue
- Check console for specific error

### Issue 4: "H2H Has No Real Data"

**Why:**
- Teams might not have played recently
- API might not have historical data
- Multiple API calls needed (can fail)

**Check:**
- Browser console for errors
- Try different teams
- Wait - H2H takes time (multiple API calls)

### Issue 5: "CORS Errors"

**If you see CORS errors:**
- APIs block direct browser requests
- **Solution**: Deploy to Vercel/server
- Local testing: Use CORS browser extension

## Testing Your Setup

### Test 1: Check API Configuration
```javascript
// In browser console, type:
console.log(API_CONFIG);
// Should show your API keys (not 'YOUR_API_KEY_HERE')
```

### Test 2: Test API Directly
Open `test-api.html` and click test buttons.

### Test 3: Check Network Requests
1. F12 → Network tab
2. Click "Fetch Today's Matches"
3. Look for API requests
4. Check if they're 200 (success) or 4xx/5xx (error)

## Expected Behavior

### When Working Correctly:
1. **Fetch Matches**: Shows real fixtures (or "No matches" if none scheduled)
2. **Team Analysis**: Shows real team stats
3. **H2H**: Shows real head-to-head data (if available)
4. **Predictions**: Calculated from real statistics

### When Not Working:
1. Shows mock data
2. Shows error messages
3. Shows "No matches" even when there should be
4. Team analysis fails

## Quick Fixes

### Fix 1: Verify API Keys
- Football-Data.org: `7a37e1457f714a63b39d16c332a5eef6` ✅
- API-Football: `145e42c32emshc539086cad10ed1p18ddd0jsnd1adbff6ecd0` ✅
- NewsAPI: `145e42c32emshc539086cad10ed1p18ddd0jsnd1adbff6ecd0` ✅

### Fix 2: Check useMockData
- Must be `false` in `api.js`

### Fix 3: Deploy to Vercel
- CORS issues are resolved when deployed
- APIs work better from a server

### Fix 4: Check Date
- If no matches today, try tomorrow
- Code now fetches next 7 days

## Still Not Working?

1. **Open browser console (F12)**
2. **Look for specific errors**
3. **Check Network tab** for failed requests
4. **Test with test-api.html**
5. **Share console errors** for help

The code is correct - the issue is likely:
- CORS blocking (needs server deployment)
- No matches today (normal)
- API rate limits
- Invalid API responses

