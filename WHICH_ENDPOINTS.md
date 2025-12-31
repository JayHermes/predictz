# API-Football: Which Endpoints Do I Choose?

## Short Answer: You Don't Choose - Subscribe to the API!

When you subscribe to **API-Football** on RapidAPI, you get access to **ALL endpoints** with your subscription. You subscribe to the **API**, not individual endpoints.

## What You'll See on RapidAPI

When you go to API-Football page, you'll see:

### Option 1: Subscription Plans (Most Common)
- **Basic** (FREE) - 100 requests/day
- **Pro** ($10/month) - 1,000 requests/day  
- **Ultra** ($30/month) - 10,000 requests/day

**→ Just subscribe to "Basic" (FREE) and you get ALL endpoints!**

### Option 2: Individual Endpoint Selection (Less Common)
If you see individual endpoints to choose from, select these:

**Essential Endpoints We Need:**
- ✅ **Injuries** - For player injuries/suspensions
- ✅ **Fixtures → Lineups** - For starting lineups
- ✅ **Players → Statistics** - For player stats

**Optional (Nice to Have):**
- Fixtures (we use Football-Data.org for this)
- Standings (we use Football-Data.org for this)
- Teams (we use Football-Data.org for this)

## Which Plan Should I Choose?

### Start with: **Basic (FREE)**
- ✅ 100 requests/day
- ✅ Includes all endpoints
- ✅ Perfect for testing and personal use
- ✅ Free forever

### Upgrade Later If Needed:
- **Pro** ($10/month) - If you need 1,000+ requests/day
- **Ultra** ($30/month) - For high-traffic sites

## Endpoints Our Code Uses

Our code specifically uses these 3 endpoints:

1. **`/injuries`**
   - Gets player injuries and suspensions
   - Used in: Match cards showing injured players

2. **`/fixtures/lineups`**
   - Gets confirmed starting lineups
   - Used in: Showing team formations

3. **`/players`**
   - Gets player statistics
   - Used in: Team analysis, top scorers

## Step-by-Step: What to Do

### On RapidAPI:

1. **Search**: "API-Football" or "api-football-v1"
2. **Click**: The API result
3. **Look for**: "Subscribe" or "Pricing" button
4. **Choose**: "Basic" plan (FREE)
5. **Subscribe**: Click subscribe
6. **Get Key**: Copy your X-RapidAPI-Key

### If You See "Endpoints" Tab:

1. Click "Endpoints" tab
2. You'll see all available endpoints listed
3. **You don't need to enable them individually** - they're all available once subscribed
4. Just copy your API key

### If You See Individual Endpoint Selection:

1. Look for checkboxes or toggles
2. Select:
   - ✅ Injuries
   - ✅ Fixtures → Lineups  
   - ✅ Players → Statistics
3. Subscribe to Basic plan
4. Copy your API key

## Important Notes

### ✅ Free Tier Includes:
- All endpoints are available
- 100 requests per day total (not per endpoint)
- Some premium endpoints might have limited data in free tier

### ⚠️ Premium Endpoints:
Some endpoints like "Injuries" might show as "Pro" feature, but:
- Basic plan usually includes them with limited data
- You can still use them, just with rate limits
- Upgrade to Pro if you need more requests

### ✅ Our Code Handles This:
- If endpoint isn't available → Falls back gracefully
- If rate limited → Shows message
- If data missing → Uses what's available

## After Subscribing

1. **Copy Your API Key** (X-RapidAPI-Key)
2. **Update `api.js`**:
   ```javascript
   apiFootball: {
       enabled: true,
       apiKey: 'YOUR_RAPIDAPI_KEY_HERE',
       headers: {
           'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY_HERE',
           'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
       }
   }
   ```

3. **Test It**: The code automatically uses the correct endpoints!

## Troubleshooting

**"I see endpoints but don't know which to choose"**
- Just subscribe to Basic plan - you get everything
- Don't worry about individual endpoint selection

**"Injuries shows as Pro feature"**
- Basic plan usually includes it with limited access
- Try it first, upgrade if needed

**"How do I know if I have access?"**
- After subscribing, go to "Endpoints" tab
- All endpoints should be listed
- Try making a test request

## Summary

**Just subscribe to API-Football "Basic" (FREE) plan** - that's it!

You'll automatically get access to:
- ✅ Injuries endpoint
- ✅ Lineups endpoint  
- ✅ Players endpoint
- ✅ All other endpoints

No need to choose individual endpoints - subscribe once, get everything! 🎉

