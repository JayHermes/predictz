/**
 * Prediction Engine
 * Analyzes match data and generates predictions with probability scores
 */

/**
 * Calculate team form points (last 5 matches)
 * W = 3 points, D = 1 point, L = 0 points
 */
function calculateFormPoints(form) {
    return form.reduce((points, result) => {
        if (result === 'W') return points + 3;
        if (result === 'D') return points + 1;
        return points;
    }, 0);
}

/**
 * Calculate average goals scored/conceded
 */
function calculateGoalStats(goalsAvg, concededAvg) {
    return {
        avgScored: goalsAvg,
        avgConceded: concededAvg,
        totalAvg: goalsAvg + concededAvg
    };
}

/**
 * Calculate head-to-head advantage
 */
function calculateH2HAdvantage(homeWins, awayWins, draws) {
    const total = homeWins + awayWins + draws;
    if (total === 0) return 0.5; // Neutral if no history
    
    const homeWinRate = homeWins / total;
    const awayWinRate = awayWins / total;
    return homeWinRate - awayWinRate; // Positive favors home
}

/**
 * Calculate injury impact
 */
function calculateInjuryImpact(injuries, isHome) {
    // More injuries = lower score
    const injuryCount = injuries.length;
    const maxImpact = 0.3; // Maximum 30% impact
    return 1 - (injuryCount * 0.05 * maxImpact);
}

/**
 * Predict Over 1.5 Goals
 */
function predictOver15(match) {
    const homeStats = calculateGoalStats(match.homeGoalsAvg, match.homeConcededAvg);
    const awayStats = calculateGoalStats(match.awayGoalsAvg, match.awayConcededAvg);
    
    // Average total goals expected
    const expectedGoals = (homeStats.avgScored + awayStats.avgConceded + 
                          awayStats.avgScored + homeStats.avgConceded) / 2;
    
    // Base probability
    let probability = Math.min(0.95, Math.max(0.05, expectedGoals / 2.5));
    
    // Adjust based on form
    const homeFormPoints = calculateFormPoints(match.homeForm);
    const awayFormPoints = calculateFormPoints(match.awayForm);
    const formFactor = (homeFormPoints + awayFormPoints) / 30; // Max 30 points
    probability += formFactor * 0.1;
    
    // Adjust for injuries (fewer injuries = more goals)
    const homeInjuryImpact = calculateInjuryImpact(match.injuries.home, true);
    const awayInjuryImpact = calculateInjuryImpact(match.injuries.away, false);
    probability *= (homeInjuryImpact + awayInjuryImpact) / 2;
    
    return Math.min(0.95, Math.max(0.05, probability));
}

/**
 * Predict Both Teams to Score (BTTS)
 */
function predictBTTS(match) {
    const homeScoringRate = match.homeGoalsAvg / 2; // Normalized
    const awayScoringRate = match.awayGoalsAvg / 2;
    const homeConcedingRate = match.homeConcededAvg / 2;
    const awayConcedingRate = match.awayConcededAvg / 2;
    
    // Probability both teams score
    const homeScores = Math.min(0.95, homeScoringRate * (1 + awayConcedingRate));
    const awayScores = Math.min(0.95, awayScoringRate * (1 + homeConcedingRate));
    
    let probability = homeScores * awayScores;
    
    // Adjust based on form
    const homeFormPoints = calculateFormPoints(match.homeForm);
    const awayFormPoints = calculateFormPoints(match.awayForm);
    const avgForm = (homeFormPoints + awayFormPoints) / 30;
    probability *= (0.7 + avgForm * 0.3);
    
    // Adjust for injuries
    const homeInjuryImpact = calculateInjuryImpact(match.injuries.home, true);
    const awayInjuryImpact = calculateInjuryImpact(match.injuries.away, false);
    probability *= (homeInjuryImpact + awayInjuryImpact) / 2;
    
    return Math.min(0.95, Math.max(0.05, probability));
}

/**
 * Predict Over 2.5 Goals
 */
function predictOver25(match) {
    const homeStats = calculateGoalStats(match.homeGoalsAvg, match.homeConcededAvg);
    const awayStats = calculateGoalStats(match.awayGoalsAvg, match.awayConcededAvg);
    
    const expectedGoals = (homeStats.avgScored + awayStats.avgConceded + 
                          awayStats.avgScored + homeStats.avgConceded) / 2;
    
    let probability = Math.min(0.90, Math.max(0.05, (expectedGoals - 1.5) / 2));
    
    // High-scoring teams boost probability
    if (homeStats.avgScored > 2 || awayStats.avgScored > 2) {
        probability += 0.15;
    }
    
    // Form adjustment
    const homeFormPoints = calculateFormPoints(match.homeForm);
    const awayFormPoints = calculateFormPoints(match.awayForm);
    const formFactor = (homeFormPoints + awayFormPoints) / 30;
    probability += formFactor * 0.1;
    
    return Math.min(0.90, Math.max(0.05, probability));
}

/**
 * Predict Match Winner
 */
function predictWinner(match) {
    const homeFormPoints = calculateFormPoints(match.homeForm);
    const awayFormPoints = calculateFormPoints(match.awayForm);
    
    // Base probabilities
    let homeWinProb = 0.33;
    let drawProb = 0.33;
    let awayWinProb = 0.34;
    
    // Form adjustment
    const formDiff = (homeFormPoints - awayFormPoints) / 15; // Normalize
    homeWinProb += formDiff * 0.2;
    awayWinProb -= formDiff * 0.2;
    drawProb -= Math.abs(formDiff) * 0.1;
    
    // H2H adjustment
    const h2hAdvantage = calculateH2HAdvantage(
        match.headToHead.homeWins,
        match.headToHead.awayWins,
        match.headToHead.draws
    );
    homeWinProb += h2hAdvantage * 0.15;
    awayWinProb -= h2hAdvantage * 0.15;
    
    // Home advantage
    homeWinProb += 0.1;
    awayWinProb -= 0.05;
    
    // Injury adjustment
    const homeInjuryImpact = calculateInjuryImpact(match.injuries.home, true);
    const awayInjuryImpact = calculateInjuryImpact(match.injuries.away, false);
    homeWinProb *= homeInjuryImpact;
    awayWinProb *= awayInjuryImpact;
    
    // Normalize probabilities
    const total = homeWinProb + drawProb + awayWinProb;
    homeWinProb /= total;
    drawProb /= total;
    awayWinProb /= total;
    
    return {
        home: Math.min(0.95, Math.max(0.05, homeWinProb)),
        draw: Math.min(0.95, Math.max(0.05, drawProb)),
        away: Math.min(0.95, Math.max(0.05, awayWinProb))
    };
}

/**
 * Generate all predictions for a match
 */
function generatePredictions(match) {
    const over15 = predictOver15(match);
    const btts = predictBTTS(match);
    const over25 = predictOver25(match);
    const winner = predictWinner(match);
    
    const predictions = [
        {
            type: 'Over 1.5 Goals',
            probability: over15,
            points: Math.round(over15 * 100)
        },
        {
            type: 'Both Teams to Score',
            probability: btts,
            points: Math.round(btts * 100)
        },
        {
            type: 'Over 2.5 Goals',
            probability: over25,
            points: Math.round(over25 * 100)
        },
        {
            type: `${match.homeTeam} Win`,
            probability: winner.home,
            points: Math.round(winner.home * 100)
        },
        {
            type: 'Draw',
            probability: winner.draw,
            points: Math.round(winner.draw * 100)
        },
        {
            type: `${match.awayTeam} Win`,
            probability: winner.away,
            points: Math.round(winner.away * 100)
        }
    ];
    
    // Sort by probability (highest first)
    predictions.sort((a, b) => b.probability - a.probability);
    
    // Add rank
    predictions.forEach((pred, index) => {
        pred.rank = index + 1;
    });
    
    return predictions;
}

/**
 * Get analysis summary
 */
function getAnalysisSummary(match) {
    const homeFormPoints = calculateFormPoints(match.homeForm);
    const awayFormPoints = calculateFormPoints(match.awayForm);
    const homeInjuryCount = match.injuries.home.length;
    const awayInjuryCount = match.injuries.away.length;
    
    return {
        homeForm: {
            points: homeFormPoints,
            maxPoints: 15,
            percentage: Math.round((homeFormPoints / 15) * 100)
        },
        awayForm: {
            points: awayFormPoints,
            maxPoints: 15,
            percentage: Math.round((awayFormPoints / 15) * 100)
        },
        homeInjuries: homeInjuryCount,
        awayInjuries: awayInjuryCount,
        homeGoalsAvg: match.homeGoalsAvg.toFixed(1),
        awayGoalsAvg: match.awayGoalsAvg.toFixed(1),
        homeConcededAvg: match.homeConcededAvg.toFixed(1),
        awayConcededAvg: match.awayConcededAvg.toFixed(1)
    };
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generatePredictions,
        getAnalysisSummary,
        predictOver15,
        predictBTTS,
        predictOver25,
        predictWinner
    };
}

