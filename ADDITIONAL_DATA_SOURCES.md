# How to Get Injuries, News, Player Stats & Lineups

## 1. Injuries & Suspensions

### Option A: API-Football (Recommended)
- **Website**: https://www.api-football.com/
- **Free Tier**: 100 requests/day
- **Paid**: $10-30/month for more requests
- **Features**: 
  - Real injury data
  - Suspension data
  - Player availability
- **Endpoint**: `/injuries`
- **Sign Up**: Via RapidAPI

### Option B: SoccersAPI
- **Website**: https://soccersapi.com/
- **Free Trial**: 7 days
- **Paid**: $20-50/month
- **Features**: Comprehensive injury data

### Option C: Sportmonks
- **Website**: https://www.sportmonks.com/
- **Paid**: $30-100/month
- **Features**: Detailed injury tracking

**Quick Setup for API-Football:**
1. Sign up at RapidAPI
2. Subscribe to API-Football
3. Get API key
4. Use endpoint: `GET /injuries?fixture={fixture_id}`

---

## 2. Team News

### Option A: NewsAPI (FREE - Recommended)
- **Website**: https://newsapi.org/
- **Free Tier**: 100 requests/day
- **Features**: 
  - Football news from multiple sources
  - Team-specific news
  - Real-time updates
- **Endpoint**: `GET /everything?q={team_name} football`
- **Sign Up**: Free account

### Option B: Google News RSS (FREE)
- **No API Key Required**
- **Features**: 
  - Free news aggregation
  - Team-specific feeds
- **URL Format**: `https://news.google.com/rss/search?q={team_name}+football`

### Option C: RSS Feeds (FREE)
- **Sources**: 
  - BBC Sport RSS
  - ESPN RSS
  - Team official websites
- **No API Key**: Just parse RSS feeds

**Quick Setup for NewsAPI:**
1. Sign up at https://newsapi.org/
2. Get free API key
3. Use endpoint: `GET /everything?q={team} football&apiKey={key}`

---

## 3. Player Statistics

### Option A: API-Football (Best Option)
- **Free Tier**: 100 requests/day
- **Features**:
  - Player stats per season
  - Goals, assists, cards
  - Performance metrics
- **Endpoint**: `/players?team={team_id}&season={year}`

### Option B: Football-Data.org (You Have This)
- **Limited**: Basic player info only
- **Endpoint**: `/teams/{id}` (includes squad)
- **Note**: Not detailed stats in free tier

### Option C: SoccersAPI
- **Paid**: $20-50/month
- **Features**: Comprehensive player statistics

---

## 4. Lineups

### Option A: API-Football (Recommended)
- **Free Tier**: 100 requests/day
- **Features**:
  - Confirmed lineups
  - Substitutes
  - Formation
  - Real-time updates
- **Endpoint**: `/fixtures/lineups?fixture={fixture_id}`

### Option B: SoccersAPI
- **Paid**: $20-50/month
- **Features**: Detailed lineup data

### Option C: Web Scraping (FREE but Complex)
- **Sources**: Official team websites, Twitter
- **Note**: Requires parsing HTML, can break easily

---

## Recommended Setup: Free Tier Combination

### Best Free Solution:
1. **Football-Data.org** (You have this) ✅
   - Fixtures, standings, form, H2H

2. **API-Football via RapidAPI** (FREE - 100 req/day)
   - Injuries, lineups, player stats
   - Sign up: https://rapidapi.com/api-sports/api/api-football

3. **NewsAPI** (FREE - 100 req/day)
   - Team news
   - Sign up: https://newsapi.org/

**Total Cost**: $0/month
**Total Requests**: 200/day (100 API-Football + 100 NewsAPI)

---

## Implementation Guide

I'll create integration code for:
1. API-Football integration (injuries, lineups, player stats)
2. NewsAPI integration (team news)
3. Combined data fetching
4. Fallback handling

This will give you ALL the data you need for FREE!

