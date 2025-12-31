/**
 * Main Application Logic
 */

let currentMatches = [];
let allClubs = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetchMatches');
    const leagueSelect = document.getElementById('leagueSelect');
    const clubSearch = document.getElementById('clubSearch');
    
    fetchBtn.addEventListener('click', handleFetchMatches);
    leagueSelect.addEventListener('change', () => {
        if (currentMatches.length > 0) {
            filterMatches();
        }
    });
    
    // Setup club search autocomplete
    setupClubSearch();
});

/**
 * Handle fetch matches button click
 */
async function handleFetchMatches() {
    const loading = document.getElementById('loading');
    const container = document.getElementById('matchesContainer');
    const leagueSelect = document.getElementById('leagueSelect');
    
    loading.classList.remove('hidden');
    container.innerHTML = '';
    
    try {
        const league = leagueSelect.value;
        const matches = await fetchMatches(league);
        currentMatches = matches;
        
        if (matches.length === 0) {
            showEmptyState();
        } else {
            displayMatches(matches);
        }
    } catch (error) {
        console.error('Error fetching matches:', error);
        const errorMessages = [
            'Oops! The API is having a bad day! 😅 Try again in a bit!',
            'Error! The football data got lost in translation! 🌍',
            'Something went wrong! Did you check if the API is awake? 😴',
            'Error loading matches! The server might be taking a coffee break! ☕',
            'Oops! Something broke! But don\'t worry, it\'s not your fault! 🤷‍♂️',
            'Error! The football gods are not responding! 🙏',
            'Something went wrong! Maybe the API is playing hide and seek? 🎭'
        ];
        const errorMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        
        container.innerHTML = `
            <div class="empty-state">
                <h2>Error Loading Matches</h2>
                <p>${errorMsg}</p>
                <p style="margin-top: 15px; font-size: 0.9em; opacity: 0.7;">Technical details: ${error.message || 'Unknown error'}</p>
            </div>
        `;
    } finally {
        loading.classList.add('hidden');
    }
}

/**
 * Filter matches by league
 */
function filterMatches() {
    const leagueSelect = document.getElementById('leagueSelect');
    const league = leagueSelect.value;
    
    if (league === 'all') {
        displayMatches(currentMatches);
    } else {
        const filtered = currentMatches.filter(match => 
            match.league.toLowerCase().replace(/\s+/g, '-') === league
        );
        displayMatches(filtered);
    }
}

/**
 * Display matches in the container
 */
function displayMatches(matches) {
    const container = document.getElementById('matchesContainer');
    container.innerHTML = '';
    
    matches.forEach(match => {
        const matchCard = createMatchCard(match);
        container.appendChild(matchCard);
    });
}

/**
 * Create a match card element
 */
function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    const predictions = generatePredictions(match);
    const analysis = getAnalysisSummary(match);
    
    // Get top 3 predictions
    const topPredictions = predictions.slice(0, 3);
    
    card.innerHTML = `
        <div class="match-header">
            <div class="teams">
                <div class="team">${match.homeTeam}</div>
                <div class="vs">vs</div>
                <div class="team">${match.awayTeam}</div>
            </div>
            <div class="match-info">
                <div>${match.league}</div>
                <div>${match.date} ${match.time}</div>
            </div>
        </div>
        
        <div class="analysis-section">
            <div class="analysis-title">📊 Match Analysis</div>
            <div class="analysis-item">
                <span class="analysis-label">${match.homeTeam} Form:</span>
                <span class="analysis-value">
                    ${match.homeForm.join(' ')} 
                    <span class="badge ${getFormBadgeClass(analysis.homeForm.percentage)}">
                        ${analysis.homeForm.percentage}%
                    </span>
                </span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">${match.awayTeam} Form:</span>
                <span class="analysis-value">
                    ${match.awayForm.join(' ')} 
                    <span class="badge ${getFormBadgeClass(analysis.awayForm.percentage)}">
                        ${analysis.awayForm.percentage}%
                    </span>
                </span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Goals (Avg):</span>
                <span class="analysis-value">
                    ${match.homeTeam}: ${analysis.homeGoalsAvg} scored, ${analysis.homeConcededAvg} conceded
                </span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Goals (Avg):</span>
                <span class="analysis-value">
                    ${match.awayTeam}: ${analysis.awayGoalsAvg} scored, ${analysis.awayConcededAvg} conceded
                </span>
            </div>
            ${match.injuries.home.length > 0 || match.injuries.away.length > 0 ? `
            <div class="analysis-item">
                <span class="analysis-label">⚠️ Injuries:</span>
                <span class="analysis-value">
                    ${match.homeTeam}: ${match.injuries.home.length} 
                    ${match.awayTeam}: ${match.injuries.away.length}
                </span>
            </div>
            ` : ''}
            ${match.teamNews.home ? `
            <div class="analysis-item">
                <span class="analysis-label">📰 ${match.homeTeam} News:</span>
                <span class="analysis-value">${match.teamNews.home}</span>
            </div>
            ` : ''}
            ${match.teamNews.away ? `
            <div class="analysis-item">
                <span class="analysis-label">📰 ${match.awayTeam} News:</span>
                <span class="analysis-value">${match.teamNews.away}</span>
            </div>
            ` : ''}
        </div>
        
        <div class="predictions">
            <div class="predictions-title">🎯 Top Predictions (Ranked by Likelihood)</div>
            ${topPredictions.map((pred, index) => `
                <div class="prediction-item">
                    <div>
                        <span class="prediction-rank rank-${pred.rank}">${pred.rank}</span>
                        <span class="prediction-label">${pred.type}</span>
                    </div>
                    <div class="prediction-percentage">${pred.points}%</div>
                </div>
            `).join('')}
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                <div style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
                    <strong>All Predictions:</strong>
                </div>
                ${predictions.map(pred => `
                    <div class="prediction-item" style="padding: 10px; margin-bottom: 8px;">
                        <div>
                            <span class="prediction-rank rank-${pred.rank <= 3 ? pred.rank : ''}" 
                                  style="${pred.rank > 3 ? 'background: #999;' : ''}">
                                ${pred.rank}
                            </span>
                            <span class="prediction-label">${pred.type}</span>
                        </div>
                        <div class="prediction-percentage">${pred.points}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Get badge class based on form percentage
 */
function getFormBadgeClass(percentage) {
    if (percentage >= 70) return 'badge-high';
    if (percentage >= 50) return 'badge-medium';
    return 'badge-low';
}

/**
 * Show empty state
 */
function showEmptyState() {
    const container = document.getElementById('matchesContainer');
    const messages = [
        'No matches found! 🤷‍♂️ Maybe the teams are still warming up?',
        'Nothing here! The pitch is empty... ⚽',
        'No matches today! Time for a coffee break! ☕',
        'Zilch! Nada! Nothing! The football gods are sleeping! 😴',
        'No matches found! Did you check if it\'s a match day? 📅'
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    container.innerHTML = `
        <div class="empty-state">
            <h2>No Matches Found</h2>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Setup club search autocomplete
 */
function setupClubSearch() {
    const clubSearch = document.getElementById('clubSearch');
    const suggestions = document.getElementById('suggestions');
    
    clubSearch.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            suggestions.classList.add('hidden');
            hideError();
            return;
        }
        
        const matches = searchClubs(query);
        
        if (matches.length > 0) {
            displaySuggestions(matches, query);
            suggestions.classList.remove('hidden');
            hideError();
        } else {
            // No matches found - show funny message
            const similar = findSimilarClubs(query);
            if (similar.length > 0) {
                showClubError(query, similar);
                displaySuggestions(similar, query);
                suggestions.classList.remove('hidden');
            } else {
                showClubError(query, []);
                suggestions.classList.add('hidden');
            }
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            suggestions.classList.add('hidden');
        }
    });
    
    // Handle suggestion selection
    suggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            clubSearch.value = e.target.textContent;
            suggestions.classList.add('hidden');
            hideError();
            // Filter matches by selected club
            filterByClub(e.target.textContent);
        }
    });
}

/**
 * Display suggestions dropdown
 */
function displaySuggestions(matches, query) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = matches.map(club => 
        `<div class="suggestion-item">${highlightMatch(club, query)}</div>`
    ).join('');
}

/**
 * Highlight matching text in suggestion
 */
function highlightMatch(club, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return club.replace(regex, '<strong>$1</strong>');
}

/**
 * Show funny error message for misspelled club
 */
function showClubError(input, suggestions) {
    const errorDiv = document.getElementById('errorMessage');
    
    if (suggestions.length > 0) {
        const message = getFunnyClubMessage(input, suggestions);
        errorDiv.innerHTML = `
            <div style="margin-bottom: 10px;">${message}</div>
            <div style="font-size: 0.9em; opacity: 0.8;">💡 Tip: Click on a suggestion to search for that club!</div>
        `;
    } else {
        errorDiv.innerHTML = `
            <div>"${input}"? That's definitely not a football club! 😂</div>
            <div style="font-size: 0.9em; opacity: 0.8; margin-top: 10px;">Try searching for: Arsenal, Barcelona, Manchester United, etc.</div>
        `;
    }
    
    errorDiv.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.classList.add('hidden');
}

/**
 * Filter matches by club name
 */
function filterByClub(clubName) {
    if (!clubName) {
        displayMatches(currentMatches);
        return;
    }
    
    const filtered = currentMatches.filter(match => 
        match.homeTeam.toLowerCase().includes(clubName.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(clubName.toLowerCase())
    );
    
    if (filtered.length === 0) {
        const messages = [
            `No matches found for "${clubName}"! They must be on vacation! 🏖️`,
            `"${clubName}" isn't playing today! Maybe check tomorrow? 📅`,
            `No matches for "${clubName}"! Did they forget to show up? 😅`,
            `"${clubName}"? Not in today's schedule! They're probably training! ⚽`
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        document.getElementById('matchesContainer').innerHTML = `
            <div class="empty-state">
                <h2>No Matches Found</h2>
                <p>${message}</p>
            </div>
        `;
    } else {
        displayMatches(filtered);
    }
}

