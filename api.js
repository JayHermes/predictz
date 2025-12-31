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
 * Now fetches REAL data including statistics and form!
 */
async function fetchMatches(league = 'all') {
    // Use mock data if API key not configured
    if (API_CONFIG.useMockData || !API_CONFIG.apiKey || API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ Using MOCK data. Configure API key in api.js to use REAL data.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (league === 'all') {
            return MOCK_MATCHES.map(m => ({ ...m, dataSource: 'mock', realData: { hasRealStats: false, hasRealForm: false, hasRealInjuries: false, hasRealNews: false } }));
        }
        return MOCK_MATCHES.filter(match => 
            match.league.toLowerCase().replace(/\s+/g, '-') === league
        ).map(m => ({ ...m, dataSource: 'mock', realData: { hasRealStats: false, hasRealForm: false, hasRealInjuries: false, hasRealNews: false } }));
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
                    return MOCK_MATCHES.map(m => ({ ...m, dataSource: 'mock', realData: { hasRealStats: false, hasRealForm: false, hasRealInjuries: false, hasRealNews: false } }));
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
            if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please wait a minute.');
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform API response to our format with REAL data
        if (API_CONFIG.provider === 'football-data') {
            const matches = await transformFootballDataMatches(data.matches || []);
            console.log('✅ Fetched REAL fixtures and statistics from API');
            return matches;
        } else if (API_CONFIG.provider === 'api-football') {
            return transformApiFootballMatches(data.response || []);
        }
        
        return [];
    } catch (error) {
        console.error('❌ Error fetching matches:', error);
        console.warn('⚠️ Falling back to mock data');
        // Fallback to mock data on error
        if (league === 'all') {
            return MOCK_MATCHES.map(m => ({ ...m, dataSource: 'mock', realData: { hasRealStats: false, hasRealForm: false, hasRealInjuries: false, hasRealNews: false } }));
        }
        return MOCK_MATCHES.filter(match => 
            match.league.toLowerCase().replace(/\s+/g, '-') === league
        ).map(m => ({ ...m, dataSource: 'mock', realData: { hasRealStats: false, hasRealForm: false, hasRealInjuries: false, hasRealNews: false } }));
    }
}

/**
 * Fetch team standings for real statistics
 */
async function fetchTeamStandings(competitionId) {
    try {
        const url = `${API_CONFIG.baseUrl}/competitions/${competitionId}/standings`;
        const response = await fetch(url, { headers: API_CONFIG.headers });
        
        if (!response.ok) {
            console.warn('Could not fetch standings');
            return null;
        }
        
        const data = await response.json();
        return data.standings?.[0]?.table || null;
    } catch (error) {
        console.warn('Error fetching standings:', error);
        return null;
    }
}

/**
 * Fetch recent matches for a team to calculate real form
 */
async function fetchTeamRecentMatches(teamId, limit = 5) {
    try {
        const url = `${API_CONFIG.baseUrl}/teams/${teamId}/matches?limit=${limit}`;
        const response = await fetch(url, { headers: API_CONFIG.headers });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data.matches || [];
    } catch (error) {
        console.warn('Error fetching team matches:', error);
        return null;
    }
}

/**
 * Calculate form from real match results
 */
function calculateFormFromMatches(matches, teamId) {
    if (!matches || matches.length === 0) return ['?', '?', '?', '?', '?'];
    
    const form = [];
    for (let i = 0; i < Math.min(5, matches.length); i++) {
        const match = matches[i];
        const isHome = match.homeTeam?.id === teamId;
        const homeScore = match.score?.fullTime?.home ?? match.score?.home;
        const awayScore = match.score?.fullTime?.away ?? match.score?.away;
        
        if (homeScore === null || awayScore === null || homeScore === undefined || awayScore === undefined) {
            form.push('?');
            continue;
        }
        
        if (isHome) {
            if (homeScore > awayScore) form.push('W');
            else if (homeScore < awayScore) form.push('L');
            else form.push('D');
        } else {
            if (awayScore > homeScore) form.push('W');
            else if (awayScore < homeScore) form.push('L');
            else form.push('D');
        }
    }
    
    // Pad with '?' if less than 5 matches
    while (form.length < 5) {
        form.unshift('?');
    }
    
    return form.slice(0, 5);
}

/**
 * Get team stats from standings
 */
function getTeamStatsFromStandings(standings, teamName) {
    if (!standings) return null;
    
    const team = standings.find(t => 
        t.team?.name?.toLowerCase() === teamName.toLowerCase()
    );
    
    if (!team) return null;
    
    const played = team.playedGames || 0;
    if (played === 0) return null;
    
    return {
        goalsFor: team.goalsFor || 0,
        goalsAgainst: team.goalsAgainst || 0,
        goalsForAvg: (team.goalsFor || 0) / played,
        goalsAgainstAvg: (team.goalsAgainst || 0) / played,
        wins: team.won || 0,
        draws: team.draw || 0,
        losses: team.lost || 0,
        points: team.points || 0
    };
}

/**
 * Transform Football-Data.org API response to our format with REAL data
 */
async function transformFootballDataMatches(apiMatches) {
    if (!apiMatches || apiMatches.length === 0) return [];
    
    // Get competition ID from first match
    const competitionId = apiMatches[0]?.competition?.id;
    
    // Fetch standings for real statistics (cache this)
    let standings = null;
    if (competitionId) {
        standings = await fetchTeamStandings(competitionId);
    }
    
    // Transform each match
    const transformedMatches = await Promise.all(apiMatches.map(async (match) => {
        const homeTeam = match.homeTeam?.name || 'Unknown';
        const awayTeam = match.awayTeam?.name || 'Unknown';
        const homeTeamId = match.homeTeam?.id;
        const awayTeamId = match.awayTeam?.id;
        const matchDate = new Date(match.utcDate);
        
        // Get real statistics from standings
        const homeStats = standings ? getTeamStatsFromStandings(standings, homeTeam) : null;
        const awayStats = standings ? getTeamStatsFromStandings(standings, awayTeam) : null;
        
        // Fetch recent matches for real form (with rate limiting consideration)
        let homeForm = ['?', '?', '?', '?', '?'];
        let awayForm = ['?', '?', '?', '?', '?'];
        
        // Only fetch form if we have team IDs and API is working
        if (homeTeamId && !API_CONFIG.useMockData) {
            try {
                const homeMatches = await fetchTeamRecentMatches(homeTeamId, 5);
                if (homeMatches) {
                    homeForm = calculateFormFromMatches(homeMatches, homeTeamId);
                }
            } catch (error) {
                console.warn(`Could not fetch form for ${homeTeam}:`, error);
            }
        }
        
        if (awayTeamId && !API_CONFIG.useMockData) {
            try {
                const awayMatches = await fetchTeamRecentMatches(awayTeamId, 5);
                if (awayMatches) {
                    awayForm = calculateFormFromMatches(awayMatches, awayTeamId);
                }
            } catch (error) {
                console.warn(`Could not fetch form for ${awayTeam}:`, error);
            }
        }
        
        return {
            id: match.id,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            league: match.competition?.name || 'Unknown League',
            date: matchDate.toISOString().split('T')[0],
            time: matchDate.toTimeString().split(' ')[0].substring(0, 5),
            homeForm: homeForm,
            awayForm: awayForm,
            homeGoalsAvg: homeStats?.goalsForAvg || 1.8, // Use real data or fallback
            awayGoalsAvg: awayStats?.goalsForAvg || 1.9,
            homeConcededAvg: homeStats?.goalsAgainstAvg || 1.1,
            awayConcededAvg: awayStats?.goalsAgainstAvg || 1.2,
            headToHead: { homeWins: 0, awayWins: 0, draws: 0 }, // Would need H2H API call
            injuries: {
                home: [], // Would need injuries API
                away: []
            },
            teamNews: {
                home: 'Data from Football-Data.org API', // Real data source
                away: 'Data from Football-Data.org API'
            },
            status: match.status,
            score: match.score,
            dataSource: homeStats && awayStats ? 'real' : 'partial', // Indicate data quality
            realData: {
                hasRealStats: !!homeStats && !!awayStats,
                hasRealForm: !homeForm.includes('?') && !awayForm.includes('?'),
                hasRealInjuries: false, // Not available in free tier
                hasRealNews: false // Would need news API
            }
        };
    }));
    
    return transformedMatches;
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

