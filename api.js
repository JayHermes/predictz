// API Configuration
// Choose your API provider and update accordingly
// Recommended: Football-Data.org (FREE tier available)
const API_CONFIG = {
    // Option 1: Football-Data.org (FREE - Recommended)
    provider: 'football-data', // Change to 'api-football', 'soccersapi', etc.
    baseUrl: 'https://api.football-data.org/v4',
    apiKey: '7a37e1457f714a63b39d16c332a5eef6', // Get from https://www.football-data.org/
    headers: {
        'X-Auth-Token': '7a37e1457f714a63b39d16c332a5eef6' // Football-Data.org uses this header
    },
    
    // Option 2: API-Football (via RapidAPI)
    // provider: 'api-football',
    // baseUrl: 'https://api-football-v1.p.rapidapi.com/v3',
    // apiKey: 'YOUR_RAPIDAPI_KEY',
    // headers: {
    //     'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
    //     'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    // },
    
    // League IDs for Football-Data.org
    leagueIds: {
        'premier-league': 2021, // Premier League
        'la-liga': 2014,        // La Liga
        'serie-a': 2019,         // Serie A
        'bundesliga': 2002,      // Bundesliga
        'ligue-1': 2015          // Ligue 1
    },
    
    // Use mock data if API key is not set
    useMockData: false
};

// Helper function to get current date
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Helper function to get current time
function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0].substring(0, 5);
}

// Mock data for demonstration (replace with actual API calls)
// Using current date for fixtures
const MOCK_MATCHES = [
    {
        id: 1,
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        league: 'Premier League',
        date: getCurrentDate(),
        time: '15:00',
        homeForm: ['W', 'W', 'L', 'W', 'D'],
        awayForm: ['W', 'D', 'W', 'W', 'W'],
        homeGoalsAvg: 1.8,
        awayGoalsAvg: 2.1,
        homeConcededAvg: 1.2,
        awayConcededAvg: 0.9,
        headToHead: { homeWins: 3, awayWins: 5, draws: 2 },
        injuries: {
            home: ['Player A', 'Player B'],
            away: ['Player C']
        },
        teamNews: {
            home: 'Key midfielder returning from suspension',
            away: 'Striker in excellent form'
        }
    },
    {
        id: 2,
        homeTeam: 'Barcelona',
        awayTeam: 'Real Madrid',
        league: 'La Liga',
        date: getCurrentDate(),
        time: '20:00',
        homeForm: ['W', 'W', 'W', 'D', 'W'],
        awayForm: ['W', 'L', 'W', 'W', 'D'],
        homeGoalsAvg: 2.3,
        awayGoalsAvg: 2.0,
        homeConcededAvg: 0.8,
        awayConcededAvg: 1.1,
        headToHead: { homeWins: 4, awayWins: 3, draws: 3 },
        injuries: {
            home: [],
            away: ['Player D']
        },
        teamNews: {
            home: 'Full squad available',
            away: 'Defender doubtful'
        }
    },
    {
        id: 3,
        homeTeam: 'Bayern Munich',
        awayTeam: 'Borussia Dortmund',
        league: 'Bundesliga',
        date: getCurrentDate(),
        time: '17:30',
        homeForm: ['W', 'W', 'W', 'W', 'W'],
        awayForm: ['L', 'W', 'D', 'W', 'L'],
        homeGoalsAvg: 2.5,
        awayGoalsAvg: 1.7,
        homeConcededAvg: 0.7,
        awayConcededAvg: 1.4,
        headToHead: { homeWins: 6, awayWins: 2, draws: 2 },
        injuries: {
            home: ['Player E'],
            away: ['Player F', 'Player G']
        },
        teamNews: {
            home: 'Strong home record',
            away: 'Struggling with injuries'
        }
    }
];

/**
 * Fetch matches from API
 * Supports Football-Data.org API (free tier available)
 */
async function fetchMatches(league = 'all') {
    // Use mock data if API key not configured
    if (API_CONFIG.useMockData || !API_CONFIG.apiKey || API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
        console.log('Using mock data. Configure API key in api.js to use real data.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (league === 'all') {
            return MOCK_MATCHES;
        }
        return MOCK_MATCHES.filter(match => 
            match.league.toLowerCase().replace(/\s+/g, '-') === league
        );
    }
    
    try {
        let url;
        let headers = { ...API_CONFIG.headers };
        
        if (API_CONFIG.provider === 'football-data') {
            // Football-Data.org API
            if (league === 'all') {
                // Get matches for today across all leagues
                const today = new Date().toISOString().split('T')[0];
                url = `${API_CONFIG.baseUrl}/matches?dateFrom=${today}&dateTo=${today}`;
            } else {
                const leagueId = API_CONFIG.leagueIds[league];
                if (!leagueId) {
                    console.warn(`League ${league} not found, using mock data`);
                    return MOCK_MATCHES;
                }
                const today = new Date().toISOString().split('T')[0];
                url = `${API_CONFIG.baseUrl}/competitions/${leagueId}/matches?dateFrom=${today}&dateTo=${today}`;
            }
        } else if (API_CONFIG.provider === 'api-football') {
            // API-Football via RapidAPI
            const leagueId = API_CONFIG.leagueIds[league] || 'all';
            const today = new Date().toISOString().split('T')[0];
            url = `${API_CONFIG.baseUrl}/fixtures?date=${today}&league=${leagueId}`;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform API response to our format
        if (API_CONFIG.provider === 'football-data') {
            return transformFootballDataMatches(data.matches || []);
        } else if (API_CONFIG.provider === 'api-football') {
            return transformApiFootballMatches(data.response || []);
        }
        
        return [];
    } catch (error) {
        console.error('Error fetching matches:', error);
        console.log('Falling back to mock data');
        // Fallback to mock data on error
        if (league === 'all') {
            return MOCK_MATCHES;
        }
        return MOCK_MATCHES.filter(match => 
            match.league.toLowerCase().replace(/\s+/g, '-') === league
        );
    }
}

/**
 * Transform Football-Data.org API response to our format
 */
function transformFootballDataMatches(apiMatches) {
    return apiMatches.map(match => {
        const homeTeam = match.homeTeam?.name || 'Unknown';
        const awayTeam = match.awayTeam?.name || 'Unknown';
        const matchDate = new Date(match.utcDate);
        
        // Calculate form from recent matches (would need additional API calls)
        // For now, use defaults that can be enhanced
        return {
            id: match.id,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            league: match.competition?.name || 'Unknown League',
            date: matchDate.toISOString().split('T')[0],
            time: matchDate.toTimeString().split(' ')[0].substring(0, 5),
            homeForm: ['W', 'D', 'W', 'L', 'W'], // Would fetch from team stats
            awayForm: ['W', 'W', 'D', 'W', 'L'],
            homeGoalsAvg: 1.8, // Would calculate from team stats
            awayGoalsAvg: 1.9,
            homeConcededAvg: 1.1,
            awayConcededAvg: 1.2,
            headToHead: { homeWins: 3, awayWins: 2, draws: 1 },
            injuries: {
                home: [],
                away: []
            },
            teamNews: {
                home: 'Check team news',
                away: 'Check team news'
            },
            status: match.status,
            score: match.score
        };
    });
}

/**
 * Transform API-Football response to our format
 */
function transformApiFootballMatches(apiMatches) {
    return apiMatches.map(match => {
        const homeTeam = match.teams?.home?.name || 'Unknown';
        const awayTeam = match.teams?.away?.name || 'Unknown';
        const matchDate = new Date(match.fixture?.date);
        
        return {
            id: match.fixture?.id,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            league: match.league?.name || 'Unknown League',
            date: matchDate.toISOString().split('T')[0],
            time: matchDate.toTimeString().split(' ')[0].substring(0, 5),
            homeForm: ['W', 'D', 'W', 'L', 'W'],
            awayForm: ['W', 'W', 'D', 'W', 'L'],
            homeGoalsAvg: 1.8,
            awayGoalsAvg: 1.9,
            homeConcededAvg: 1.1,
            awayConcededAvg: 1.2,
            headToHead: { homeWins: 3, awayWins: 2, draws: 1 },
            injuries: {
                home: [],
                away: []
            },
            teamNews: {
                home: 'Check team news',
                away: 'Check team news'
            },
            status: match.fixture?.status?.short,
            score: match.goals
        };
    });
}

/**
 * Fetch detailed match data including statistics
 */
async function fetchMatchDetails(matchId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, replace with actual API call
    const match = MOCK_MATCHES.find(m => m.id === matchId);
    return match || null;
}

/**
 * Fetch team statistics
 */
async function fetchTeamStats(teamName) {
    // In production, fetch from API
    // For now, return mock data based on team name
    return {
        goalsScored: 45,
        goalsConceded: 28,
        wins: 12,
        draws: 5,
        losses: 3,
        recentForm: ['W', 'W', 'L', 'W', 'D']
    };
}

/**
 * Fetch injury and team news data
 */
async function fetchTeamNews(teamName) {
    // In production, fetch from API or news aggregator
    // For now, return mock data
    return {
        injuries: ['Player A', 'Player B'],
        suspensions: [],
        news: 'Key player returning from injury'
    };
}

/**
 * Fetch Head-to-Head data between two teams
 */
async function fetchHeadToHead(team1, team2) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In production, fetch from API
    // For now, return mock data
    const h2hData = {
        team1: team1,
        team2: team2,
        totalMatches: 25,
        team1Wins: 10,
        team2Wins: 8,
        draws: 7,
        team1Goals: 32,
        team2Goals: 28,
        recentMatches: [
            { date: getCurrentDate(), team1Score: 2, team2Score: 1, winner: team1 },
            { date: getCurrentDate(), team1Score: 1, team2Score: 1, winner: 'Draw' },
            { date: getCurrentDate(), team1Score: 0, team2Score: 2, winner: team2 }
        ],
        team1Form: ['W', 'D', 'L', 'W', 'W'],
        team2Form: ['L', 'W', 'W', 'D', 'L'],
        team1GoalsAvg: 1.6,
        team2GoalsAvg: 1.4,
        team1ConcededAvg: 1.2,
        team2ConcededAvg: 1.3
    };
    
    return h2hData;
}

/**
 * Fetch comprehensive team analysis
 */
async function fetchTeamAnalysis(teamName) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In production, fetch from API
    // For now, return mock data
    const analysis = {
        teamName: teamName,
        league: 'Premier League',
        position: 5,
        played: 20,
        wins: 12,
        draws: 5,
        losses: 3,
        goalsFor: 45,
        goalsAgainst: 28,
        goalDifference: 17,
        points: 41,
        recentForm: ['W', 'W', 'L', 'W', 'D'],
        homeRecord: { wins: 7, draws: 2, losses: 1, goalsFor: 25, goalsAgainst: 12 },
        awayRecord: { wins: 5, draws: 3, losses: 2, goalsFor: 20, goalsAgainst: 16 },
        goalsPerGame: 2.25,
        concededPerGame: 1.4,
        cleanSheets: 8,
        topScorer: 'Player Name',
        topScorerGoals: 12,
        injuries: ['Player A', 'Player B'],
        suspensions: [],
        nextMatch: {
            opponent: 'Opponent Team',
            date: getCurrentDate(),
            venue: 'Home'
        },
        strengths: ['Strong attack', 'Good home form', 'Set pieces'],
        weaknesses: ['Away form', 'Defensive lapses'],
        prediction: 'Strong team with good attacking options. Likely to finish in top 6.'
    };
    
    return analysis;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchMatches,
        fetchMatchDetails,
        fetchTeamStats,
        fetchTeamNews,
        fetchHeadToHead,
        fetchTeamAnalysis,
        API_CONFIG
    };
}

