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
    
    // Option 2: API-Football (via RapidAPI) - For injuries, lineups, player stats
    // Get free API key: https://rapidapi.com/api-sports/api/api-football
    apiFootball: {
        enabled: true, // ✅ Enabled with your API key
        baseUrl: 'https://api-football-v1.p.rapidapi.com/v3',
        apiKey: '145e42c32emshc539086cad10ed1p18ddd0jsnd1adbff6ecd0', // Your RapidAPI key
        headers: {
            'X-RapidAPI-Key': '145e42c32emshc539086cad10ed1p18ddd0jsnd1adbff6ecd0',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    },
    
    // Option 3: NewsAPI - For team news
    // Using RapidAPI News API (same key as API-Football)
    newsAPI: {
        enabled: true, // ✅ Enabled with your RapidAPI key
        provider: 'rapidapi', // Using RapidAPI News API
        baseUrl: 'https://news-api14.p.rapidapi.com', // RapidAPI News API base URL
        apiKey: '145e42c32emshc539086cad10ed1p18ddd0jsnd1adbff6ecd0', // Your RapidAPI key
        headers: {
            'X-RapidAPI-Key': '145e42c32emshc539086cad10ed1p18ddd0jsnd1adbff6ecd0',
            'X-RapidAPI-Host': 'news-api14.p.rapidapi.com'
        }
    },
    
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
                // Get matches for today and next 7 days (in case no matches today)
                const today = new Date();
                const nextWeek = new Date(today);
                nextWeek.setDate(nextWeek.getDate() + 7);
                const todayStr = today.toISOString().split('T')[0];
                const nextWeekStr = nextWeek.toISOString().split('T')[0];
                url = `${API_CONFIG.baseUrl}/matches?dateFrom=${todayStr}&dateTo=${nextWeekStr}`;
                console.log(`🔍 Fetching matches from ${todayStr} to ${nextWeekStr}`);
            } else {
                const leagueId = API_CONFIG.leagueIds[league];
                if (!leagueId) {
                    console.warn(`League ${league} not found, using mock data`);
                    return MOCK_MATCHES.map(m => ({ ...m, dataSource: 'mock', realData: { hasRealStats: false, hasRealForm: false, hasRealInjuries: false, hasRealNews: false } }));
                }
                const today = new Date();
                const nextWeek = new Date(today);
                nextWeek.setDate(nextWeek.getDate() + 7);
                const todayStr = today.toISOString().split('T')[0];
                const nextWeekStr = nextWeek.toISOString().split('T')[0];
                url = `${API_CONFIG.baseUrl}/competitions/${leagueId}/matches?dateFrom=${todayStr}&dateTo=${nextWeekStr}`;
                console.log(`🔍 Fetching ${league} matches from ${todayStr} to ${nextWeekStr}`);
            }
        } else if (API_CONFIG.provider === 'api-football') {
            // API-Football via RapidAPI
            const leagueId = API_CONFIG.leagueIds[league] || 'all';
            const today = new Date().toISOString().split('T')[0];
            url = `${API_CONFIG.baseUrl}/fixtures?date=${today}&league=${leagueId}`;
        }
        
        console.log(`🌐 Fetching from: ${url}`);
        const response = await fetch(url, { headers });
        
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please wait a minute.');
            }
            if (response.status === 401 || response.status === 403) {
                throw new Error('API authentication failed. Check your API key.');
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 API Response:', data);
        
        // Check if we have matches
        const matchesData = data.matches || data.response || [];
        console.log(`📊 Found ${matchesData.length} matches from API`);
        
        if (matchesData.length === 0) {
            console.warn('⚠️ No matches found for today. This is normal if there are no scheduled matches.');
            // Return empty array instead of mock data so user knows there are no matches
            return [];
        }
        
        // Transform API response to our format with REAL data
        if (API_CONFIG.provider === 'football-data') {
            const matches = await transformFootballDataMatches(matchesData);
            console.log(`✅ Successfully transformed ${matches.length} matches with REAL data`);
            if (matches.length === 0) {
                console.warn('⚠️ No matches found after transformation. This might mean:');
                console.warn('   1. No matches scheduled for the selected period');
                console.warn('   2. API returned matches but transformation failed');
                console.warn('   3. Check browser console for transformation errors');
            }
            return matches;
        } else if (API_CONFIG.provider === 'api-football') {
            const matches = transformApiFootballMatches(matchesData);
            console.log(`✅ Successfully transformed ${matches.length} matches`);
            return matches;
        }
        
        return [];
    } catch (error) {
        console.error('❌ Error fetching matches:', error);
        console.error('Error details:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        
        // Check for CORS errors
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
            throw new Error('CORS Error: API blocked by browser. Try deploying to a server or using a CORS proxy.');
        }
        
        // Don't fall back to mock data - show the actual error
        throw error;
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
        
        // Try to find API-Football fixture ID and fetch injuries/lineups
        let injuries = { home: [], away: [] };
        let apiFootballFixtureId = null;
        
        if (API_CONFIG.apiFootball.enabled) {
            try {
                apiFootballFixtureId = await findApiFootballFixtureId(homeTeam, awayTeam, matchDate.toISOString().split('T')[0]);
                if (apiFootballFixtureId) {
                    injuries = await fetchMatchInjuries(apiFootballFixtureId);
                }
            } catch (error) {
                console.warn('Error fetching injuries from API-Football:', error);
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
            injuries: injuries, // Real injuries from API-Football if available
            teamNews: {
                home: 'Data from Football-Data.org API', // Real data source
                away: 'Data from Football-Data.org API'
            },
            // Store IDs for API-Football lookups
            fixtureId: apiFootballFixtureId, // API-Football fixture ID
            homeTeamId: homeTeamId, // Store for API-Football lookups
            awayTeamId: awayTeamId, // Store for API-Football lookups
            status: match.status,
            score: match.score,
            dataSource: homeStats && awayStats ? 'real' : 'partial', // Indicate data quality
            realData: {
                hasRealStats: !!homeStats && !!awayStats,
                hasRealForm: !homeForm.includes('?') && !awayForm.includes('?'),
                hasRealInjuries: injuries.home.length > 0 || injuries.away.length > 0, // From API-Football
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
 * Find team ID by name from Football-Data.org
 */
async function findTeamId(teamName) {
    try {
        // Search in major competitions
        const competitions = [2021, 2014, 2019, 2002, 2015]; // PL, La Liga, Serie A, Bundesliga, Ligue 1
        
        for (const compId of competitions) {
            try {
                const url = `${API_CONFIG.baseUrl}/competitions/${compId}/teams`;
                const response = await fetch(url, { headers: API_CONFIG.headers });
                
                if (response.ok) {
                    const data = await response.json();
                    const team = data.teams?.find(t => 
                        t.name.toLowerCase() === teamName.toLowerCase() ||
                        t.shortName?.toLowerCase() === teamName.toLowerCase()
                    );
                    if (team) return team.id;
                }
            } catch (error) {
                continue; // Try next competition
            }
        }
        return null;
    } catch (error) {
        console.warn('Error finding team ID:', error);
        return null;
    }
}

/**
 * Fetch Head-to-Head data between two teams from REAL API
 */
async function fetchHeadToHead(team1, team2) {
    try {
        // Find team IDs
        const team1Id = await findTeamId(team1);
        const team2Id = await findTeamId(team2);
        
        if (!team1Id || !team2Id) {
            console.warn('Could not find team IDs, using estimated data');
            // Return estimated data if teams not found
            return {
                team1: team1,
                team2: team2,
                totalMatches: 0,
                team1Wins: 0,
                team2Wins: 0,
                draws: 0,
                team1Goals: 0,
                team2Goals: 0,
                recentMatches: [],
                team1Form: ['?', '?', '?', '?', '?'],
                team2Form: ['?', '?', '?', '?', '?'],
                team1GoalsAvg: 0,
                team2GoalsAvg: 0,
                team1ConcededAvg: 0,
                team2ConcededAvg: 0,
                dataSource: 'estimated'
            };
        }
        
        // Fetch matches for both teams and find common matches
        const [team1Matches, team2Matches] = await Promise.all([
            fetchTeamRecentMatches(team1Id, 50), // Get more matches for H2H
            fetchTeamRecentMatches(team2Id, 50)
        ]);
        
        if (!team1Matches || !team2Matches) {
            throw new Error('Could not fetch team matches');
        }
        
        // Find matches where both teams played each other
        const h2hMatches = [];
        team1Matches.forEach(match => {
            if ((match.homeTeam?.id === team1Id && match.awayTeam?.id === team2Id) ||
                (match.homeTeam?.id === team2Id && match.awayTeam?.id === team1Id)) {
                h2hMatches.push(match);
            }
        });
        
        // Calculate H2H statistics
        let team1Wins = 0, team2Wins = 0, draws = 0;
        let team1Goals = 0, team2Goals = 0;
        const recentMatches = [];
        
        h2hMatches.slice(0, 10).forEach(match => {
            const homeScore = match.score?.fullTime?.home ?? match.score?.home ?? 0;
            const awayScore = match.score?.fullTime?.away ?? match.score?.away ?? 0;
            const isTeam1Home = match.homeTeam?.id === team1Id;
            
            const team1Score = isTeam1Home ? homeScore : awayScore;
            const team2Score = isTeam1Home ? awayScore : homeScore;
            
            team1Goals += team1Score;
            team2Goals += team2Score;
            
            if (team1Score > team2Score) {
                team1Wins++;
                recentMatches.push({ date: match.utcDate, team1Score, team2Score, winner: team1 });
            } else if (team2Score > team1Score) {
                team2Wins++;
                recentMatches.push({ date: match.utcDate, team1Score, team2Score, winner: team2 });
            } else {
                draws++;
                recentMatches.push({ date: match.utcDate, team1Score, team2Score, winner: 'Draw' });
            }
        });
        
        // Get current form
        const team1Form = calculateFormFromMatches(team1Matches.slice(0, 5), team1Id);
        const team2Form = calculateFormFromMatches(team2Matches.slice(0, 5), team2Id);
        
        // Get team stats for averages
        const team1Stats = await fetchTeamStatsById(team1Id);
        const team2Stats = await fetchTeamStatsById(team2Id);
        
        return {
            team1: team1,
            team2: team2,
            totalMatches: h2hMatches.length,
            team1Wins: team1Wins,
            team2Wins: team2Wins,
            draws: draws,
            team1Goals: team1Goals,
            team2Goals: team2Goals,
            recentMatches: recentMatches.slice(0, 3),
            team1Form: team1Form,
            team2Form: team2Form,
            team1GoalsAvg: team1Stats?.goalsForAvg || 0,
            team2GoalsAvg: team2Stats?.goalsForAvg || 0,
            team1ConcededAvg: team1Stats?.goalsAgainstAvg || 0,
            team2ConcededAvg: team2Stats?.goalsAgainstAvg || 0,
            dataSource: 'real'
        };
    } catch (error) {
        console.error('Error fetching H2H data:', error);
        // Return minimal data on error
        return {
            team1: team1,
            team2: team2,
            totalMatches: 0,
            team1Wins: 0,
            team2Wins: 0,
            draws: 0,
            team1Goals: 0,
            team2Goals: 0,
            recentMatches: [],
            team1Form: ['?', '?', '?', '?', '?'],
            team2Form: ['?', '?', '?', '?', '?'],
            team1GoalsAvg: 0,
            team2GoalsAvg: 0,
            team1ConcededAvg: 0,
            team2ConcededAvg: 0,
            dataSource: 'error'
        };
    }
}

/**
 * Fetch team statistics by team ID
 */
async function fetchTeamStatsById(teamId) {
    try {
        // Get team's matches to calculate stats
        const matches = await fetchTeamRecentMatches(teamId, 20);
        if (!matches || matches.length === 0) return null;
        
        let goalsFor = 0, goalsAgainst = 0, played = 0;
        
        matches.forEach(match => {
            const homeScore = match.score?.fullTime?.home ?? match.score?.home;
            const awayScore = match.score?.fullTime?.away ?? match.score?.away;
            
            if (homeScore !== null && awayScore !== null && 
                homeScore !== undefined && awayScore !== undefined) {
                const isHome = match.homeTeam?.id === teamId;
                goalsFor += isHome ? homeScore : awayScore;
                goalsAgainst += isHome ? awayScore : homeScore;
                played++;
            }
        });
        
        if (played === 0) return null;
        
        return {
            goalsForAvg: goalsFor / played,
            goalsAgainstAvg: goalsAgainst / played
        };
    } catch (error) {
        console.warn('Error fetching team stats:', error);
        return null;
    }
}

/**
 * Fetch comprehensive team analysis from REAL API
 */
async function fetchTeamAnalysis(teamName) {
    try {
        const teamId = await findTeamId(teamName);
        
        if (!teamId) {
            throw new Error('Team not found');
        }
        
        // Fetch team details
        const teamUrl = `${API_CONFIG.baseUrl}/teams/${teamId}`;
        const teamResponse = await fetch(teamUrl, { headers: API_CONFIG.headers });
        const teamData = await teamResponse.ok ? await teamResponse.json() : null;
        
        // Fetch recent matches for form and stats
        const matches = await fetchTeamRecentMatches(teamId, 20);
        if (!matches) throw new Error('Could not fetch matches');
        
        // Calculate form
        const recentForm = calculateFormFromMatches(matches.slice(0, 5), teamId);
        
        // Calculate statistics from matches
        let goalsFor = 0, goalsAgainst = 0, wins = 0, draws = 0, losses = 0;
        let homeWins = 0, homeDraws = 0, homeLosses = 0, homeGoalsFor = 0, homeGoalsAgainst = 0;
        let awayWins = 0, awayDraws = 0, awayLosses = 0, awayGoalsFor = 0, awayGoalsAgainst = 0;
        let played = 0, cleanSheets = 0;
        
        matches.forEach(match => {
            const homeScore = match.score?.fullTime?.home ?? match.score?.home;
            const awayScore = match.score?.fullTime?.away ?? match.score?.away;
            
            if (homeScore === null || awayScore === null || 
                homeScore === undefined || awayScore === undefined) return;
            
            const isHome = match.homeTeam?.id === teamId;
            const teamScore = isHome ? homeScore : awayScore;
            const opponentScore = isHome ? awayScore : homeScore;
            
            goalsFor += teamScore;
            goalsAgainst += opponentScore;
            played++;
            
            if (opponentScore === 0) cleanSheets++;
            
            if (teamScore > opponentScore) {
                wins++;
                if (isHome) { homeWins++; homeGoalsFor += teamScore; homeGoalsAgainst += opponentScore; }
                else { awayWins++; awayGoalsFor += teamScore; awayGoalsAgainst += opponentScore; }
            } else if (teamScore < opponentScore) {
                losses++;
                if (isHome) { homeLosses++; homeGoalsFor += teamScore; homeGoalsAgainst += opponentScore; }
                else { awayLosses++; awayGoalsFor += teamScore; awayGoalsAgainst += opponentScore; }
            } else {
                draws++;
                if (isHome) { homeDraws++; homeGoalsFor += teamScore; homeGoalsAgainst += opponentScore; }
                else { awayDraws++; awayGoalsFor += teamScore; awayGoalsAgainst += opponentScore; }
            }
        });
        
        // Find league and position from standings
        let league = 'Unknown League';
        let position = 0;
        let points = 0;
        
        const competitions = [2021, 2014, 2019, 2002, 2015];
        for (const compId of competitions) {
            try {
                const standings = await fetchTeamStandings(compId);
                if (standings) {
                    const team = standings.find(t => t.team?.id === teamId);
                    if (team) {
                        position = team.position || 0;
                        points = team.points || 0;
                        // Get league name from competition
                        const compUrl = `${API_CONFIG.baseUrl}/competitions/${compId}`;
                        const compResponse = await fetch(compUrl, { headers: API_CONFIG.headers });
                        if (compResponse.ok) {
                            const compData = await compResponse.json();
                            league = compData.name || league;
                        }
                        break;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        
        // Get next match
        const upcomingMatches = await fetch(`${API_CONFIG.baseUrl}/teams/${teamId}/matches?status=SCHEDULED&limit=1`, 
            { headers: API_CONFIG.headers }).then(r => r.ok ? r.json() : null);
        const nextMatch = upcomingMatches?.matches?.[0];
        
        // Generate analysis
        const goalsPerGame = played > 0 ? goalsFor / played : 0;
        const concededPerGame = played > 0 ? goalsAgainst / played : 0;
        
        const strengths = [];
        const weaknesses = [];
        
        if (goalsPerGame > 1.8) strengths.push('Strong attacking play');
        if (concededPerGame < 1.2) strengths.push('Solid defense');
        if (homeWins > awayWins) strengths.push('Strong home form');
        if (recentForm.filter(f => f === 'W').length >= 3) strengths.push('Excellent recent form');
        
        if (concededPerGame > 1.5) weaknesses.push('Defensive vulnerabilities');
        if (awayLosses > awayWins) weaknesses.push('Poor away record');
        if (recentForm.filter(f => f === 'L').length >= 3) weaknesses.push('Recent poor form');
        
        return {
            teamName: teamName,
            league: league,
            position: position,
            played: played,
            wins: wins,
            draws: draws,
            losses: losses,
            goalsFor: goalsFor,
            goalsAgainst: goalsAgainst,
            goalDifference: goalsFor - goalsAgainst,
            points: points,
            recentForm: recentForm,
            homeRecord: { 
                wins: homeWins, 
                draws: homeDraws, 
                losses: homeLosses, 
                goalsFor: homeGoalsFor, 
                goalsAgainst: homeGoalsAgainst 
            },
            awayRecord: { 
                wins: awayWins, 
                draws: awayDraws, 
                losses: awayLosses, 
                goalsFor: awayGoalsFor, 
                goalsAgainst: awayGoalsAgainst 
            },
            goalsPerGame: goalsPerGame,
            concededPerGame: concededPerGame,
            cleanSheets: cleanSheets,
            topScorer: 'N/A', // Not available in free tier
            topScorerGoals: 0,
            injuries: [], // Not available in free tier
            suspensions: [],
            nextMatch: nextMatch ? {
                opponent: nextMatch.homeTeam?.id === teamId ? nextMatch.awayTeam?.name : nextMatch.homeTeam?.name,
                date: new Date(nextMatch.utcDate).toISOString().split('T')[0],
                venue: nextMatch.homeTeam?.id === teamId ? 'Home' : 'Away'
            } : null,
            strengths: strengths.length > 0 ? strengths : ['Balanced team'],
            weaknesses: weaknesses.length > 0 ? weaknesses : ['No major weaknesses'],
            prediction: generateTeamPrediction(wins, draws, losses, goalsPerGame, concededPerGame, position),
            dataSource: 'real'
        };
    } catch (error) {
        console.error('Error fetching team analysis:', error);
        // Return minimal data
        return {
            teamName: teamName,
            league: 'Unknown',
            position: 0,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
            recentForm: ['?', '?', '?', '?', '?'],
            homeRecord: { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
            awayRecord: { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
            goalsPerGame: 0,
            concededPerGame: 0,
            cleanSheets: 0,
            topScorer: 'N/A',
            topScorerGoals: 0,
            injuries: [],
            suspensions: [],
            nextMatch: null,
            strengths: [],
            weaknesses: [],
            prediction: 'Data unavailable',
            dataSource: 'error'
        };
    }
}

/**
 * Generate team prediction based on stats
 */
function generateTeamPrediction(wins, draws, losses, goalsPerGame, concededPerGame, position) {
    const winRate = wins + draws + losses > 0 ? wins / (wins + draws + losses) : 0;
    
    if (winRate > 0.6 && goalsPerGame > 2) {
        return 'Excellent attacking team with strong win rate. Top contender.';
    } else if (winRate > 0.5 && concededPerGame < 1.2) {
        return 'Solid team with good defensive record. Likely to finish in top half.';
    } else if (winRate < 0.3) {
        return 'Struggling team. Needs improvement to avoid relegation.';
    } else {
        return 'Average team with potential. Mid-table finish likely.';
    }
}

/**
 * Find API-Football fixture ID by team names and date
 */
async function findApiFootballFixtureId(homeTeamName, awayTeamName, matchDate) {
    if (!API_CONFIG.apiFootball.enabled || !API_CONFIG.apiFootball.apiKey || 
        API_CONFIG.apiFootball.apiKey === 'YOUR_RAPIDAPI_KEY_HERE') {
        return null;
    }
    
    try {
        // Search for fixtures on the match date
        const url = `${API_CONFIG.apiFootball.baseUrl}/fixtures?date=${matchDate}`;
        const response = await fetch(url, { headers: API_CONFIG.apiFootball.headers });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        const fixtures = data.response || [];
        
        // Find matching fixture by team names
        const fixture = fixtures.find(f => {
            const home = f.teams?.home?.name?.toLowerCase() || '';
            const away = f.teams?.away?.name?.toLowerCase() || '';
            const searchHome = homeTeamName.toLowerCase();
            const searchAway = awayTeamName.toLowerCase();
            
            return (home.includes(searchHome) || searchHome.includes(home)) &&
                   (away.includes(searchAway) || searchAway.includes(away));
        });
        
        return fixture?.fixture?.id || null;
    } catch (error) {
        console.warn('Error finding API-Football fixture:', error);
        return null;
    }
}

/**
 * Fetch injuries for a match using API-Football
 */
async function fetchMatchInjuries(fixtureId) {
    if (!API_CONFIG.apiFootball.enabled || !API_CONFIG.apiFootball.apiKey || 
        API_CONFIG.apiFootball.apiKey === 'YOUR_RAPIDAPI_KEY_HERE' || !fixtureId) {
        return { home: [], away: [] };
    }
    
    try {
        const url = `${API_CONFIG.apiFootball.baseUrl}/injuries?fixture=${fixtureId}`;
        const response = await fetch(url, { headers: API_CONFIG.apiFootball.headers });
        
        if (!response.ok) {
            return { home: [], away: [] };
        }
        
        const data = await response.json();
        const injuries = data.response || [];
        
        const homeInjuries = [];
        const awayInjuries = [];
        
        injuries.forEach(injury => {
            const playerName = injury.player?.name || 'Unknown Player';
            const injuryType = injury.player?.reason || 'Injury';
            const injuryInfo = `${playerName} (${injuryType})`;
            
            // Determine which team the injury belongs to
            const teamId = injury.team?.id;
            if (injuries.length > 0 && teamId === injuries[0]?.team?.id) {
                homeInjuries.push(injuryInfo);
            } else {
                awayInjuries.push(injuryInfo);
            }
        });
        
        return { home: homeInjuries, away: awayInjuries };
    } catch (error) {
        console.warn('Error fetching injuries:', error);
        return { home: [], away: [] };
    }
}

/**
 * Fetch lineups for a match using API-Football
 */
async function fetchMatchLineups(fixtureId) {
    if (!API_CONFIG.apiFootball.enabled || !API_CONFIG.apiFootball.apiKey || 
        API_CONFIG.apiFootball.apiKey === 'YOUR_RAPIDAPI_KEY_HERE') {
        return null;
    }
    
    try {
        const url = `${API_CONFIG.apiFootball.baseUrl}/fixtures/lineups?fixture=${fixtureId}`;
        const response = await fetch(url, { headers: API_CONFIG.apiFootball.headers });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return {
            home: data.response?.[0] || null,
            away: data.response?.[1] || null
        };
    } catch (error) {
        console.warn('Error fetching lineups:', error);
        return null;
    }
}

/**
 * Fetch team news using NewsAPI (RapidAPI)
 */
async function fetchTeamNewsFromAPI(teamName) {
    if (!API_CONFIG.newsAPI.enabled || !API_CONFIG.newsAPI.apiKey || 
        API_CONFIG.newsAPI.apiKey === 'YOUR_NEWSAPI_KEY_HERE') {
        return null;
    }
    
    try {
        let url;
        let headers;
        
        if (API_CONFIG.newsAPI.provider === 'rapidapi') {
            // Using RapidAPI News API
            const query = encodeURIComponent(`${teamName} football`);
            // Try search endpoint - adjust based on actual RapidAPI News API structure
            url = `${API_CONFIG.newsAPI.baseUrl}/search?q=${query}&language=en&limit=5`;
            headers = API_CONFIG.newsAPI.headers;
        } else {
            // Using standalone NewsAPI.org
            const query = encodeURIComponent(`${teamName} football`);
            url = `${API_CONFIG.newsAPI.baseUrl}/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${API_CONFIG.newsAPI.apiKey}`;
            headers = {};
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            console.warn(`NewsAPI response not OK: ${response.status}`);
            return null;
        }
        
        const data = await response.json();
        
        // Handle different response formats
        let articles = [];
        if (data.articles) {
            articles = data.articles;
        } else if (data.data) {
            articles = data.data;
        } else if (data.results) {
            articles = data.results;
        } else if (Array.isArray(data)) {
            articles = data;
        }
        
        if (articles.length === 0) {
            return null;
        }
        
        // Return most recent relevant article
        const article = articles[0];
        return {
            title: article.title || article.headline || 'News',
            description: article.description || article.summary || article.snippet || '',
            url: article.url || article.link || article.web_url || '',
            publishedAt: article.publishedAt || article.published_date || article.pub_date || new Date().toISOString(),
            source: article.source?.name || article.source || article.publisher || 'News API'
        };
    } catch (error) {
        console.warn('Error fetching team news:', error);
        return null;
    }
}

/**
 * Fetch player statistics using API-Football
 */
async function fetchPlayerStats(teamId, season = 2024) {
    if (!API_CONFIG.apiFootball.enabled || !API_CONFIG.apiFootball.apiKey || 
        API_CONFIG.apiFootball.apiKey === 'YOUR_RAPIDAPI_KEY_HERE') {
        return null;
    }
    
    try {
        const url = `${API_CONFIG.apiFootball.baseUrl}/players?team=${teamId}&season=${season}`;
        const response = await fetch(url, { headers: API_CONFIG.apiFootball.headers });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data.response || [];
    } catch (error) {
        console.warn('Error fetching player stats:', error);
        return null;
    }
}

/**
 * Enhanced fetch team news - tries NewsAPI first, falls back to generic
 */
async function fetchTeamNews(teamName) {
    // Try NewsAPI first
    const news = await fetchTeamNewsFromAPI(teamName);
    
    if (news) {
        return {
            injuries: [],
            suspensions: [],
            news: news.description || news.title,
            source: news.source,
            url: news.url,
            dataSource: 'real'
        };
    }
    
    // Fallback
    return {
        injuries: [],
        suspensions: [],
        news: `Latest news for ${teamName} - Check official sources`,
        dataSource: 'generic'
    };
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
        fetchMatchInjuries,
        fetchMatchLineups,
        fetchPlayerStats,
        fetchTeamNewsFromAPI,
        API_CONFIG
    };
}

