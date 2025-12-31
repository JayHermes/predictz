# Setup Guide: Get Injuries, News, Player Stats & Lineups

## Quick Setup (5 minutes)

### Step 1: Get API-Football Key (FREE - 100 requests/day)

1. Go to https://rapidapi.com/
2. Sign up (free account)
3. Search for "API-Football"
4. Click "Subscribe" → Choose "Basic" (FREE)
5. Copy your API key from the dashboard
6. Update `api.js`:
   ```javascript
   apiFootball: {
       enabled: true,
       apiKey: 'YOUR_RAPIDAPI_KEY_HERE', // Paste your key here
       headers: {
           'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY_HERE', // Paste your key here
           'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
       }
   }
   ```

### Step 2: Get NewsAPI Key (FREE - 100 requests/day)

1. Go to https://newsapi.org/
2. Sign up (free account)
3. Get your API key from dashboard
4. Update `api.js`:
   ```javascript
   newsAPI: {
       enabled: true,
       apiKey: 'YOUR_NEWSAPI_KEY_HERE' // Paste your key here
   }
   ```

### Step 3: Test It!

1. Open your website
2. Fetch matches
3. You should now see:
   - ✅ Real injuries (if available)
   - ✅ Real team news
   - ✅ Lineups (when available)
   - ✅ Player statistics

## What You Get

### With API-Football:
- ✅ **Injuries**: Real player injuries and suspensions
- ✅ **Lineups**: Confirmed starting XI and substitutes
- ✅ **Player Stats**: Goals, assists, cards per player
- ✅ **Formations**: Team formations

### With NewsAPI:
- ✅ **Team News**: Latest news articles about teams
- ✅ **Match Previews**: Pre-match analysis
- ✅ **Transfer News**: Player transfer updates

## Cost

**Total: $0/month** (using free tiers)
- API-Football: 100 requests/day (FREE)
- NewsAPI: 100 requests/day (FREE)
- Football-Data.org: 10 requests/minute (FREE - you already have this)

## Rate Limits

**Free Tier Limits:**
- API-Football: 100 requests/day
- NewsAPI: 100 requests/day

**Tips to Stay Within Limits:**
- Cache data (don't fetch same data multiple times)
- Only fetch injuries/lineups for today's matches
- Fetch news once per day per team
- Use localStorage to cache results

## Paid Options (If You Need More)

### API-Football Pro:
- **Cost**: $10-30/month
- **Requests**: 1,000-10,000/day
- **Features**: More detailed stats, historical data

### NewsAPI Pro:
- **Cost**: $449/month
- **Requests**: Unlimited
- **Note**: Free tier is usually enough for personal use

## Troubleshooting

### "API key invalid"
- Check you copied the full key
- Make sure there are no extra spaces
- Verify key is active in dashboard

### "Rate limit exceeded"
- You've used all free requests for the day
- Wait 24 hours or upgrade to paid tier
- Implement caching to reduce requests

### "No data returned"
- Check if data is available (injuries might not exist for all matches)
- Verify API key is correct
- Check browser console for errors

## Next Steps

After setting up:
1. Test with a real match
2. Check browser console for any errors
3. Verify data is showing correctly
4. Implement caching to optimize requests

That's it! You now have access to ALL football data! 🎉

