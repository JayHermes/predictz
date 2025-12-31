# Predictz - Football Match Prediction Website

A simple, handwritten website that uses livescore API to fetch matches and predict match outcomes based on real-life data including team news, form, and player injuries.

## Features

- 📊 **Match Analysis**: Team form, goals statistics, injuries, and team news
- 🎯 **Predictions**: 
  - Over 1.5 Goals
  - Both Teams to Score (BTTS)
  - Over 2.5 Goals
  - Match Winner (Home/Draw/Away)
- 📈 **Ranking System**: Predictions ranked by probability percentage
- 🏆 **Top Picks**: Display top 1-3 predictions with highest likelihood

## Quick Start

1. **Get API Key** (Recommended: Football-Data.org - FREE):
   - Sign up at https://www.football-data.org/
   - Get your API token from dashboard
   - Update `api.js` with your token

2. **Deploy to Vercel**:
   - Push to GitHub (see `DEPLOYMENT.md`)
   - Import repository on Vercel
   - Deploy!

See `QUICK_START.md` for 5-minute setup guide.

## Setup Instructions

### 1. Get an API Key

**Recommended: Football-Data.org** (FREE tier available):
- Website: https://www.football-data.org/
- Free tier: 10 requests/minute
- Sign up and get API token

**Other Options**:
- **API-Football** (RapidAPI): 100 requests/day free
- **SoccersAPI**: 7-day free trial
- **Score24**: Contact for pricing

See `API_SETUP.md` for detailed API configuration guide.

### 2. Configure API

Edit `api.js` and update the `API_CONFIG` object:

```javascript
const API_CONFIG = {
    provider: 'football-data',
    baseUrl: 'https://api.football-data.org/v4',
    apiKey: 'YOUR_ACTUAL_API_TOKEN',
    headers: {
        'X-Auth-Token': 'YOUR_ACTUAL_API_TOKEN'
    },
    useMockData: false  // Set to false when API key is ready
};
```

The API integration is already implemented for Football-Data.org!

### 4. Run the Website

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## How It Works

### Prediction Algorithm

The prediction engine analyzes:
1. **Team Form**: Last 5 matches (W/D/L) converted to points
2. **Goal Statistics**: Average goals scored and conceded
3. **Head-to-Head**: Historical match results between teams
4. **Injuries**: Impact of missing players
5. **Team News**: Latest updates affecting team performance

### Ranking System

Each prediction is assigned a probability percentage (0-100%) and ranked:
- **Rank 1** (Green): Highest probability
- **Rank 2** (Orange): Second highest
- **Rank 3** (Blue): Third highest
- **Rank 4+**: Lower probabilities

## File Structure

```
Predictz/
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── api.js              # API integration layer (supports Football-Data.org)
├── predictions.js      # Prediction algorithms
├── app.js              # Main application logic
├── package.json        # Project configuration
├── vercel.json         # Vercel deployment config
├── .gitignore          # Git ignore rules
├── README.md           # This file
├── API_SETUP.md        # Detailed API setup guide
├── DEPLOYMENT.md       # Vercel deployment instructions
└── QUICK_START.md      # Quick setup guide
```

## Customization

### Adding New Predictions

Edit `predictions.js` to add new prediction types:
- Under/Over goals
- Correct score ranges
- Player-specific predictions
- etc.

### Styling

Modify `styles.css` to customize the appearance:
- Colors and themes
- Layout and spacing
- Responsive breakpoints

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import repository on Vercel
3. Deploy automatically!

See `DEPLOYMENT.md` for step-by-step instructions.

### Local Development

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then open http://localhost:8000
```

## Notes

- Uses mock data by default (works out of the box)
- Configure API key in `api.js` to use real data
- API integration ready for Football-Data.org
- Automatic fallback to mock data if API fails
- Adjust prediction algorithms in `predictions.js` as needed

## License

Free to use and modify for personal projects.

