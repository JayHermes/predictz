/**
 * Club Database for Autocomplete
 * Comprehensive list of football clubs from major leagues
 */

const CLUB_DATABASE = [
    // Premier League
    'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton', 'Burnley',
    'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Liverpool', 'Luton Town',
    'Manchester City', 'Manchester United', 'Newcastle United', 'Nottingham Forest',
    'Sheffield United', 'Tottenham Hotspur', 'West Ham United', 'Wolverhampton Wanderers',
    
    // La Liga
    'Alaves', 'Almeria', 'Athletic Bilbao', 'Atletico Madrid', 'Barcelona', 'Cadiz',
    'Celta Vigo', 'Getafe', 'Girona', 'Granada', 'Las Palmas', 'Mallorca',
    'Osasuna', 'Rayo Vallecano', 'Real Betis', 'Real Madrid', 'Real Sociedad',
    'Sevilla', 'Valencia', 'Villarreal',
    
    // Serie A
    'AC Milan', 'Atalanta', 'Bologna', 'Cagliari', 'Empoli', 'Fiorentina',
    'Frosinone', 'Genoa', 'Inter Milan', 'Juventus', 'Lazio', 'Lecce',
    'Monza', 'Napoli', 'Roma', 'Salernitana', 'Sassuolo', 'Torino', 'Udinese', 'Verona',
    
    // Bundesliga
    'Bayer Leverkusen', 'Bayern Munich', 'Borussia Dortmund', 'Borussia Monchengladbach',
    'Eintracht Frankfurt', 'FC Augsburg', 'FC Heidenheim', 'FC Koln', 'Freiburg',
    'Hoffenheim', 'Mainz', 'RB Leipzig', 'Stuttgart', 'Union Berlin', 'VfL Bochum',
    'VfL Wolfsburg', 'Werder Bremen', 'Darmstadt',
    
    // Ligue 1
    'AS Monaco', 'Brest', 'Clermont', 'Lens', 'Lille', 'Lorient', 'Lyon',
    'Marseille', 'Metz', 'Montpellier', 'Nice', 'Nantes', 'Paris Saint-Germain',
    'Reims', 'Rennes', 'Strasbourg', 'Toulouse',
    
    // Other Popular Clubs
    'Ajax', 'Benfica', 'Porto', 'Celtic', 'Rangers', 'Galatasaray', 'Fenerbahce',
    'Besiktas', 'Shakhtar Donetsk', 'Dynamo Kyiv', 'Zenit', 'CSKA Moscow',
    'River Plate', 'Boca Juniors', 'Flamengo', 'Palmeiras', 'Santos', 'Corinthians'
];

/**
 * Search for clubs matching the query
 */
function searchClubs(query) {
    if (!query || query.length < 2) {
        return [];
    }
    
    const lowerQuery = query.toLowerCase().trim();
    
    return CLUB_DATABASE.filter(club => 
        club.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 suggestions
}

/**
 * Find similar club names (fuzzy search)
 */
function findSimilarClubs(query) {
    if (!query || query.length < 2) {
        return [];
    }
    
    const lowerQuery = query.toLowerCase().trim();
    const results = [];
    
    CLUB_DATABASE.forEach(club => {
        const lowerClub = club.toLowerCase();
        
        // Exact match
        if (lowerClub === lowerQuery) {
            results.push({ club, score: 100 });
            return;
        }
        
        // Starts with query
        if (lowerClub.startsWith(lowerQuery)) {
            results.push({ club, score: 80 });
            return;
        }
        
        // Contains query
        if (lowerClub.includes(lowerQuery)) {
            results.push({ club, score: 60 });
            return;
        }
        
        // Fuzzy match (check for similar characters)
        let similarity = 0;
        const queryChars = lowerQuery.split('');
        const clubChars = lowerClub.split('');
        
        queryChars.forEach(char => {
            if (clubChars.includes(char)) {
                similarity += 10;
            }
        });
        
        if (similarity > 30) {
            results.push({ club, score: similarity });
        }
    });
    
    // Sort by score and return top matches
    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(item => item.club);
}

/**
 * Get funny message for misspelled club
 */
function getFunnyClubMessage(input, suggestions) {
    const messages = [
        `"${input}"? 🤔 Never heard of them! Did you mean one of these?`,
        `Hmm, "${input}" doesn't ring a bell... Maybe you meant:`,
        `"${input}"? That's a new one! 😅 Try one of these instead:`,
        `I don't think "${input}" exists... Unless it's a secret club? 🕵️`,
        `"${input}"? Sounds made up! Here are some real clubs:`,
        `"${input}"? Nope, that's not a thing. How about:`,
        `"${input}"? That's not how you spell football club! 😂`,
        `"${input}"? I think you're confusing football with something else! ⚽`,
        `"${input}"? Even my crystal ball can't find that one! 🔮`,
        `"${input}"? That club must be playing in an alternate universe! 🚀`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CLUB_DATABASE,
        searchClubs,
        findSimilarClubs,
        getFunnyClubMessage
    };
}

