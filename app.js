/**
 * Main Application Logic
 */

let currentMatches = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetchMatches');
    const leagueSelect = document.getElementById('leagueSelect');
    
    fetchBtn.addEventListener('click', handleFetchMatches);
    leagueSelect.addEventListener('change', () => {
        if (currentMatches.length > 0) {
            filterMatches();
        }
    });
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
        container.innerHTML = `
            <div class="empty-state">
                <h2>Error Loading Matches</h2>
                <p>Please check your API configuration and try again.</p>
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
    container.innerHTML = `
        <div class="empty-state">
            <h2>No Matches Found</h2>
            <p>No matches available for the selected criteria.</p>
        </div>
    `;
}

