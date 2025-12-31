/**
 * Main Application Logic
 */

let currentMatches = [];
let allClubs = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Setup tabs
    setupTabs();
    
    // Matches tab
    const fetchBtn = document.getElementById('fetchMatches');
    const leagueSelect = document.getElementById('leagueSelect');
    fetchBtn.addEventListener('click', handleFetchMatches);
    leagueSelect.addEventListener('change', () => {
        if (currentMatches.length > 0) {
            filterMatches();
        }
    });
    
    // Setup club search autocomplete for matches tab
    setupClubSearch();
    
    // H2H tab
    setupH2HSearch();
    const compareBtn = document.getElementById('compareH2H');
    compareBtn.addEventListener('click', handleH2HComparison);
    
    // Team Analysis tab
    setupTeamAnalysisSearch();
    const analyzeBtn = document.getElementById('analyzeTeam');
    analyzeBtn.addEventListener('click', handleTeamAnalysis);
});

/**
 * Setup tab switching
 */
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            document.getElementById(`${targetTab}Tab`).classList.add('active');
            
            // Clear container when switching tabs
            document.getElementById('matchesContainer').innerHTML = '';
            hideError();
        });
    });
}

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
    
    // Setup prediction reasons after cards are created
    setTimeout(() => {
        setupPredictionReasons();
    }, 100);
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
                <div class="prediction-item" data-prediction-id="pred-${match.id}-${pred.rank}">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; flex-wrap: wrap;">
                                <span class="prediction-rank rank-${pred.rank}">${pred.rank}</span>
                                <span class="prediction-label">${pred.type}</span>
                                <button class="reason-toggle" data-target="pred-${match.id}-${pred.rank}" style="margin-left: 10px; background: none; border: 2px solid #000; border-radius: 5px; padding: 2px 8px; cursor: pointer; font-family: 'Kalam', cursive; font-size: 0.8em;">Why?</button>
                            </div>
                        </div>
                        <div class="prediction-percentage">${pred.points}%</div>
                    </div>
                    <div class="prediction-reasons hidden" id="pred-${match.id}-${pred.rank}">
                        ${pred.reasons && pred.reasons.length > 0 ? `
                            <div style="margin-top: 10px; padding: 10px; background: #f9f9f9; border: 2px dashed #000; border-radius: 8px; font-size: 0.9em;">
                                <strong style="text-decoration: underline;">Reasons:</strong>
                                <ul style="margin-top: 8px; margin-left: 20px;">
                                    ${pred.reasons.map(reason => `<li style="margin-bottom: 5px;">${reason}</li>`).join('')}
                                </ul>
                            </div>
                        ` : '<div style="margin-top: 10px; padding: 10px; font-size: 0.9em; opacity: 0.7;">No specific reasons available</div>'}
                    </div>
                </div>
            `).join('')}
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                <div style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
                    <strong>All Predictions:</strong>
                </div>
                ${predictions.map(pred => `
                    <div class="prediction-item" style="padding: 10px; margin-bottom: 8px;" data-prediction-id="pred-all-${match.id}-${pred.rank}">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; flex-wrap: wrap;">
                                    <span class="prediction-rank rank-${pred.rank <= 3 ? pred.rank : ''}" 
                                          style="${pred.rank > 3 ? 'background: #999;' : ''}">
                                        ${pred.rank}
                                    </span>
                                    <span class="prediction-label">${pred.type}</span>
                                    <button class="reason-toggle" data-target="pred-all-${match.id}-${pred.rank}" style="margin-left: 10px; background: none; border: 2px solid #000; border-radius: 5px; padding: 2px 8px; cursor: pointer; font-family: 'Kalam', cursive; font-size: 0.8em;">Why?</button>
                                </div>
                            </div>
                            <div class="prediction-percentage">${pred.points}%</div>
                        </div>
                        <div class="prediction-reasons hidden" id="pred-all-${match.id}-${pred.rank}">
                            ${pred.reasons && pred.reasons.length > 0 ? `
                                <div style="margin-top: 10px; padding: 10px; background: #f9f9f9; border: 2px dashed #000; border-radius: 8px; font-size: 0.9em;">
                                    <strong style="text-decoration: underline;">Reasons:</strong>
                                    <ul style="margin-top: 8px; margin-left: 20px;">
                                        ${pred.reasons.map(reason => `<li style="margin-bottom: 5px;">${reason}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : '<div style="margin-top: 10px; padding: 10px; font-size: 0.9em; opacity: 0.7;">No specific reasons available</div>'}
                        </div>
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

/**
 * Setup H2H search autocomplete
 */
function setupH2HSearch() {
    const team1Input = document.getElementById('team1Input');
    const team2Input = document.getElementById('team2Input');
    const suggestions1 = document.getElementById('suggestions1');
    const suggestions2 = document.getElementById('suggestions2');
    
    [team1Input, team2Input].forEach((input, index) => {
        const suggestions = index === 0 ? suggestions1 : suggestions2;
        
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                suggestions.classList.add('hidden');
                return;
            }
            
            const matches = searchClubs(query);
            if (matches.length > 0) {
                displaySuggestionsForInput(matches, query, suggestions);
                suggestions.classList.remove('hidden');
            } else {
                suggestions.classList.add('hidden');
            }
        });
        
        // Handle suggestion selection
        suggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                input.value = e.target.textContent.replace(/<[^>]*>/g, '');
                suggestions.classList.add('hidden');
            }
        });
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!team1Input.contains(e.target) && !suggestions1.contains(e.target)) {
            suggestions1.classList.add('hidden');
        }
        if (!team2Input.contains(e.target) && !suggestions2.contains(e.target)) {
            suggestions2.classList.add('hidden');
        }
    });
}

/**
 * Display suggestions for H2H inputs
 */
function displaySuggestionsForInput(matches, query, container) {
    container.innerHTML = matches.map(club => 
        `<div class="suggestion-item">${highlightMatch(club, query)}</div>`
    ).join('');
}

/**
 * Handle H2H comparison
 */
async function handleH2HComparison() {
    const team1 = document.getElementById('team1Input').value.trim();
    const team2 = document.getElementById('team2Input').value.trim();
    const container = document.getElementById('matchesContainer');
    const loading = document.getElementById('loading');
    
    if (!team1 || !team2) {
        showError('Please enter both team names! 😅');
        return;
    }
    
    // Validate team names
    const team1Matches = searchClubs(team1);
    const team2Matches = searchClubs(team2);
    
    if (team1Matches.length === 0 || !team1Matches.some(t => t.toLowerCase() === team1.toLowerCase())) {
        showError(`"${team1}"? That's not a real team! 🤔 Did you mean: ${team1Matches.slice(0, 3).join(', ')}?`);
        return;
    }
    
    if (team2Matches.length === 0 || !team2Matches.some(t => t.toLowerCase() === team2.toLowerCase())) {
        showError(`"${team2}"? That's not a real team! 🤔 Did you mean: ${team2Matches.slice(0, 3).join(', ')}?`);
        return;
    }
    
    loading.classList.remove('hidden');
    container.innerHTML = '';
    hideError();
    
    try {
        const h2hData = await fetchHeadToHead(team1, team2);
        displayH2HResult(h2hData);
    } catch (error) {
        showError(`Oops! Couldn't fetch H2H data! ${error.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

/**
 * Display H2H comparison result
 */
function displayH2HResult(h2hData) {
    const container = document.getElementById('matchesContainer');
    const team1WinRate = ((h2hData.team1Wins / h2hData.totalMatches) * 100).toFixed(1);
    const team2WinRate = ((h2hData.team2Wins / h2hData.totalMatches) * 100).toFixed(1);
    const drawRate = ((h2hData.draws / h2hData.totalMatches) * 100).toFixed(1);
    
    container.innerHTML = `
        <div class="h2h-result">
            <div class="h2h-header">
                <h2 style="font-size: 2em; text-decoration: underline; margin-bottom: 10px;">${h2hData.team1} vs ${h2hData.team2}</h2>
                <p style="font-size: 1.2em;">Head-to-Head Analysis</p>
            </div>
            
            <div class="h2h-stats">
                <div class="h2h-stat">
                    <div class="h2h-stat-label">Total Matches</div>
                    <div class="h2h-stat-value">${h2hData.totalMatches}</div>
                </div>
                <div class="h2h-stat">
                    <div class="h2h-stat-label">${h2hData.team1} Wins</div>
                    <div class="h2h-stat-value">${h2hData.team1Wins}</div>
                </div>
                <div class="h2h-stat">
                    <div class="h2h-stat-label">${h2hData.team2} Wins</div>
                    <div class="h2h-stat-value">${h2hData.team2Wins}</div>
                </div>
                <div class="h2h-stat">
                    <div class="h2h-stat-label">Draws</div>
                    <div class="h2h-stat-value">${h2hData.draws}</div>
                </div>
            </div>
            
            <div class="analysis-section">
                <div class="analysis-title">📊 Win Rates</div>
                <div class="analysis-item">
                    <span class="analysis-label">${h2hData.team1}:</span>
                    <span class="analysis-value">${team1WinRate}%</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">${h2hData.team2}:</span>
                    <span class="analysis-value">${team2WinRate}%</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Draws:</span>
                    <span class="analysis-value">${drawRate}%</span>
                </div>
            </div>
            
            <div class="analysis-section">
                <div class="analysis-title">⚽ Goals Statistics</div>
                <div class="analysis-item">
                    <span class="analysis-label">${h2hData.team1} Goals:</span>
                    <span class="analysis-value">${h2hData.team1Goals} (Avg: ${(h2hData.team1Goals / h2hData.totalMatches).toFixed(2)})</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">${h2hData.team2} Goals:</span>
                    <span class="analysis-value">${h2hData.team2Goals} (Avg: ${(h2hData.team2Goals / h2hData.totalMatches).toFixed(2)})</span>
                </div>
            </div>
            
            <div class="analysis-section">
                <div class="analysis-title">📈 Current Form</div>
                <div class="analysis-item">
                    <span class="analysis-label">${h2hData.team1} Form:</span>
                    <span class="analysis-value">${h2hData.team1Form.join(' ')}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">${h2hData.team2} Form:</span>
                    <span class="analysis-value">${h2hData.team2Form.join(' ')}</span>
                </div>
            </div>
            
            <div class="predictions">
                <div class="predictions-title">🎯 Prediction</div>
                ${generateH2HPrediction(h2hData)}
            </div>
        </div>
    `;
}

/**
 * Generate H2H prediction
 */
function generateH2HPrediction(h2hData) {
    const team1Advantage = h2hData.team1Wins > h2hData.team2Wins;
    const team2Advantage = h2hData.team2Wins > h2hData.team1Wins;
    const isEven = h2hData.team1Wins === h2hData.team2Wins;
    
    let prediction = '';
    if (team1Advantage) {
        prediction = `${h2hData.team1} has the historical advantage!`;
    } else if (team2Advantage) {
        prediction = `${h2hData.team2} has the historical advantage!`;
    } else {
        prediction = 'Very even matchup historically!';
    }
    
    return `<div class="prediction-item"><div class="prediction-label">${prediction}</div></div>`;
}

/**
 * Setup Team Analysis search
 */
function setupTeamAnalysisSearch() {
    const teamAnalysisSearch = document.getElementById('teamAnalysisSearch');
    const suggestions = document.getElementById('suggestionsAnalysis');
    
    teamAnalysisSearch.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            suggestions.classList.add('hidden');
            return;
        }
        
        const matches = searchClubs(query);
        if (matches.length > 0) {
            displaySuggestionsForInput(matches, query, suggestions);
            suggestions.classList.remove('hidden');
        } else {
            suggestions.classList.add('hidden');
        }
    });
    
    suggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            teamAnalysisSearch.value = e.target.textContent.replace(/<[^>]*>/g, '');
            suggestions.classList.add('hidden');
        }
    });
    
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('#teamAnalysisTab .search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            suggestions.classList.add('hidden');
        }
    });
}

/**
 * Handle Team Analysis
 */
async function handleTeamAnalysis() {
    const teamName = document.getElementById('teamAnalysisSearch').value.trim();
    const container = document.getElementById('matchesContainer');
    const loading = document.getElementById('loading');
    
    if (!teamName) {
        showError('Please enter a team name! 😅');
        return;
    }
    
    // Validate team name
    const teamMatches = searchClubs(teamName);
    if (teamMatches.length === 0 || !teamMatches.some(t => t.toLowerCase() === teamName.toLowerCase())) {
        showError(`"${teamName}"? That's not a real team! 🤔 Did you mean: ${teamMatches.slice(0, 3).join(', ')}?`);
        return;
    }
    
    loading.classList.remove('hidden');
    container.innerHTML = '';
    hideError();
    
    try {
        const analysis = await fetchTeamAnalysis(teamName);
        displayTeamAnalysis(analysis);
    } catch (error) {
        showError(`Oops! Couldn't fetch team analysis! ${error.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

/**
 * Display Team Analysis
 */
function displayTeamAnalysis(analysis) {
    const container = document.getElementById('matchesContainer');
    const winRate = ((analysis.wins / analysis.played) * 100).toFixed(1);
    
    container.innerHTML = `
        <div class="team-analysis-result">
            <div class="h2h-header">
                <h2 style="font-size: 2.5em; text-decoration: underline; margin-bottom: 10px;">${analysis.teamName}</h2>
                <p style="font-size: 1.3em;">${analysis.league} - Position: ${analysis.position}</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-label">Played</div>
                    <div class="stat-value">${analysis.played}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Wins</div>
                    <div class="stat-value">${analysis.wins}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Draws</div>
                    <div class="stat-value">${analysis.draws}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Losses</div>
                    <div class="stat-value">${analysis.losses}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Points</div>
                    <div class="stat-value">${analysis.points}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Win Rate</div>
                    <div class="stat-value">${winRate}%</div>
                </div>
            </div>
            
            <div class="analysis-section">
                <div class="analysis-title">⚽ Goals</div>
                <div class="analysis-item">
                    <span class="analysis-label">Goals For:</span>
                    <span class="analysis-value">${analysis.goalsFor} (${analysis.goalsPerGame} per game)</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Goals Against:</span>
                    <span class="analysis-value">${analysis.goalsAgainst} (${analysis.concededPerGame} per game)</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Goal Difference:</span>
                    <span class="analysis-value">${analysis.goalDifference > 0 ? '+' : ''}${analysis.goalDifference}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Clean Sheets:</span>
                    <span class="analysis-value">${analysis.cleanSheets}</span>
                </div>
            </div>
            
            <div class="analysis-section">
                <div class="analysis-title">📊 Form & Records</div>
                <div class="analysis-item">
                    <span class="analysis-label">Recent Form:</span>
                    <span class="analysis-value">${analysis.recentForm.join(' ')}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Home Record:</span>
                    <span class="analysis-value">${analysis.homeRecord.wins}W ${analysis.homeRecord.draws}D ${analysis.homeRecord.losses}L (${analysis.homeRecord.goalsFor}GF, ${analysis.homeRecord.goalsAgainst}GA)</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Away Record:</span>
                    <span class="analysis-value">${analysis.awayRecord.wins}W ${analysis.awayRecord.draws}D ${analysis.awayRecord.losses}L (${analysis.awayRecord.goalsFor}GF, ${analysis.awayRecord.goalsAgainst}GA)</span>
                </div>
            </div>
            
            <div class="analysis-section">
                <div class="analysis-title">⭐ Top Scorer</div>
                <div class="analysis-item">
                    <span class="analysis-label">${analysis.topScorer}:</span>
                    <span class="analysis-value">${analysis.topScorerGoals} goals</span>
                </div>
            </div>
            
            ${analysis.injuries.length > 0 ? `
            <div class="analysis-section">
                <div class="analysis-title">⚠️ Injuries</div>
                <div class="analysis-item">
                    <span class="analysis-label">Injured Players:</span>
                    <span class="analysis-value">${analysis.injuries.join(', ')}</span>
                </div>
            </div>
            ` : ''}
            
            <div class="strengths-weaknesses">
                <div>
                    <div class="analysis-title">💪 Strengths</div>
                    ${analysis.strengths.map(s => `<div class="strength-item">${s}</div>`).join('')}
                </div>
                <div>
                    <div class="analysis-title">⚠️ Weaknesses</div>
                    ${analysis.weaknesses.map(w => `<div class="weakness-item">${w}</div>`).join('')}
                </div>
            </div>
            
            <div class="analysis-section">
                <div class="analysis-title">🔮 Prediction</div>
                <div class="analysis-item">
                    <span class="analysis-value">${analysis.prediction}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

/**
 * Setup prediction reason toggles
 */
function setupPredictionReasons() {
    const reasonToggles = document.querySelectorAll('.reason-toggle');
    
    reasonToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = toggle.getAttribute('data-target');
            const reasonsDiv = document.getElementById(targetId);
            
            if (reasonsDiv) {
                reasonsDiv.classList.toggle('hidden');
                if (reasonsDiv.classList.contains('hidden')) {
                    toggle.textContent = 'Why?';
                } else {
                    toggle.textContent = 'Hide';
                }
            }
        });
    });
}

