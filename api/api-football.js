// Vercel Serverless Function - Proxy for API-Football (RapidAPI)
// This solves CORS issues

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { endpoint, fixtureId, teamId, season, date } = req.query;
        
        // Build URL
        let url = 'https://api-football-v1.p.rapidapi.com/v3';
        
        if (endpoint === 'injuries') {
            url += `/injuries?fixture=${fixtureId}`;
        } else if (endpoint === 'lineups') {
            url += `/fixtures/lineups?fixture=${fixtureId}`;
        } else if (endpoint === 'players') {
            url += `/players?team=${teamId}&season=${season || 2024}`;
        } else if (endpoint === 'fixtures') {
            url += `/fixtures?date=${date}`;
        } else {
            return res.status(400).json({ error: 'Invalid endpoint' });
        }
        
        // Make API call
        const response = await fetch(url, {
            headers: {
                'X-RapidAPI-Key': '145e42c32emshc539086cad10ed1p18ddd0jsnd1adbff6ecd0',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
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

