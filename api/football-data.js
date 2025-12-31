// Vercel Serverless Function - Proxy for Football-Data.org API
// This solves CORS issues by making API calls from the server

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { endpoint, dateFrom, dateTo, leagueId } = req.query;
        
        // Build URL based on endpoint
        let url = 'https://api.football-data.org/v4';
        
        if (endpoint === 'matches') {
            url += `/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
        } else if (endpoint === 'league-matches') {
            url += `/competitions/${leagueId}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
        } else if (endpoint === 'standings') {
            url += `/competitions/${leagueId}/standings`;
        } else if (endpoint === 'team-matches') {
            url += `/teams/${req.query.teamId}/matches?limit=${req.query.limit || 5}`;
        } else if (endpoint === 'teams') {
            url += `/competitions/${leagueId}/teams`;
        } else if (endpoint === 'team') {
            url += `/teams/${req.query.teamId}`;
        } else {
            return res.status(400).json({ error: 'Invalid endpoint' });
        }
        
        // Make API call from server (no CORS issues)
        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': '7a37e1457f714a63b39d16c332a5eef6'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                error: `API Error: ${response.status}`,
                details: errorText 
            });
        }
        
        const data = await response.json();
        return res.status(200).json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}

