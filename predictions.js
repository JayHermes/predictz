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
    
    const finalProb = Math.min(0.95, Math.max(0.05, probability));
    
    // Generate reasons
    const reasons = [];
    if (expectedGoals > 2.0) {
        reasons.push(`High expected goals (${expectedGoals.toFixed(1)}) based on both teams' scoring averages`);
    } else if (expectedGoals > 1.5) {
        reasons.push(`Moderate expected goals (${expectedGoals.toFixed(1)}) from team statistics`);
    } else {
        reasons.push(`Lower expected goals (${expectedGoals.toFixed(1)}) - teams tend to score less`);
    }
    
    if (homeFormPoints + awayFormPoints > 20) {
        reasons.push(`Both teams in good form (${homeFormPoints + awayFormPoints}/30 points)`);
    } else if (homeFormPoints + awayFormPoints < 10) {
        reasons.push(`Both teams struggling for form (${homeFormPoints + awayFormPoints}/30 points)`);
    }
    
    if (match.injuries.home.length === 0 && match.injuries.away.length === 0) {
        reasons.push('No major injuries - full squads available');
    } else if (match.injuries.home.length + match.injuries.away.length > 3) {
        reasons.push(`${match.injuries.home.length + match.injuries.away.length} injuries may reduce goal-scoring`);
    }
    
    if (homeStats.avgScored > 2 || awayStats.avgScored > 2) {
        reasons.push(`Strong attacking teams (${match.homeTeam}: ${homeStats.avgScored.toFixed(1)} goals/game, ${match.awayTeam}: ${awayStats.avgScored.toFixed(1)} goals/game)`);
    }
    
    return {
        probability: finalProb,
        reasons: reasons
    };
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
    
    const finalProb = Math.min(0.95, Math.max(0.05, probability));
    
    // Generate reasons
    const reasons = [];
    if (match.homeGoalsAvg > 1.5 && match.awayGoalsAvg > 1.5) {
        reasons.push(`Both teams score regularly (${match.homeTeam}: ${match.homeGoalsAvg.toFixed(1)} goals/game, ${match.awayTeam}: ${match.awayGoalsAvg.toFixed(1)} goals/game)`);
    } else if (match.homeGoalsAvg < 1.0 || match.awayGoalsAvg < 1.0) {
        reasons.push(`One or both teams struggle to score (${match.homeTeam}: ${match.homeGoalsAvg.toFixed(1)}, ${match.awayTeam}: ${match.awayGoalsAvg.toFixed(1)} goals/game)`);
    }
    
    if (match.homeConcededAvg > 1.5 && match.awayConcededAvg > 1.5) {
        reasons.push(`Both teams concede frequently (${match.homeTeam}: ${match.homeConcededAvg.toFixed(1)}, ${match.awayTeam}: ${match.awayConcededAvg.toFixed(1)} conceded/game)`);
    } else if (match.homeConcededAvg < 0.8 && match.awayConcededAvg < 0.8) {
        reasons.push(`Strong defensive records may prevent both teams scoring`);
    }
    
    if (homeFormPoints > 10 && awayFormPoints > 10) {
        reasons.push('Both teams in good form increases scoring chances');
    }
    
    if (match.injuries.home.length > 2 || match.injuries.away.length > 2) {
        reasons.push(`Injuries (${match.injuries.home.length + match.injuries.away.length} total) may affect attacking options`);
    }
    
    return {
        probability: finalProb,
        reasons: reasons
    };
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
    
    const finalProb = Math.min(0.90, Math.max(0.05, probability));
    
    // Generate reasons
    const reasons = [];
    if (expectedGoals > 2.5) {
        reasons.push(`Very high expected goals (${expectedGoals.toFixed(1)}) suggests multiple goals likely`);
    } else if (expectedGoals > 2.0) {
        reasons.push(`Moderate-high expected goals (${expectedGoals.toFixed(1)})`);
    } else {
        reasons.push(`Lower expected goals (${expectedGoals.toFixed(1)}) makes Over 2.5 less likely`);
    }
    
    if (homeStats.avgScored > 2 || awayStats.avgScored > 2) {
        reasons.push(`High-scoring teams (${match.homeTeam}: ${homeStats.avgScored.toFixed(1)} or ${match.awayTeam}: ${awayStats.avgScored.toFixed(1)} goals/game) boost probability`);
    }
    
    if (homeFormPoints + awayFormPoints > 22) {
        reasons.push(`Excellent combined form (${homeFormPoints + awayFormPoints}/30) increases goal potential`);
    }
    
    if (match.homeConcededAvg > 1.5 || match.awayConcededAvg > 1.5) {
        reasons.push(`Defensive vulnerabilities (${match.homeTeam}: ${match.homeConcededAvg.toFixed(1)}, ${match.awayTeam}: ${match.awayConcededAvg.toFixed(1)} conceded/game)`);
    }
    
    return {
        probability: finalProb,
        reasons: reasons
    };
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
    
    const finalHome = Math.min(0.95, Math.max(0.05, homeWinProb));
    const finalDraw = Math.min(0.95, Math.max(0.05, drawProb));
    const finalAway = Math.min(0.95, Math.max(0.05, awayWinProb));
    
    // Generate reasons for each outcome
    const homeReasons = [];
    const awayReasons = [];
    const drawReasons = [];
    
    // Home win reasons
    if (homeFormPoints > awayFormPoints + 3) {
        homeReasons.push(`${match.homeTeam} in much better form (${homeFormPoints} vs ${awayFormPoints} points)`);
    } else if (homeFormPoints > awayFormPoints) {
        homeReasons.push(`${match.homeTeam} slightly better form`);
    }
    
    if (match.headToHead.homeWins > match.headToHead.awayWins) {
        homeReasons.push(`Historical advantage (${match.headToHead.homeWins}-${match.headToHead.awayWins} in H2H)`);
    }
    
    homeReasons.push('Home advantage typically adds 10% to win probability');
    
    if (match.injuries.away.length > match.injuries.home.length) {
        homeReasons.push(`${match.awayTeam} has more injuries (${match.injuries.away.length} vs ${match.injuries.home.length})`);
    }
    
    // Away win reasons
    if (awayFormPoints > homeFormPoints + 3) {
        awayReasons.push(`${match.awayTeam} in much better form (${awayFormPoints} vs ${homeFormPoints} points)`);
    } else if (awayFormPoints > homeFormPoints) {
        awayReasons.push(`${match.awayTeam} slightly better form`);
    }
    
    if (match.headToHead.awayWins > match.headToHead.homeWins) {
        awayReasons.push(`Historical advantage (${match.headToHead.awayWins}-${match.headToHead.homeWins} in H2H)`);
    }
    
    if (match.injuries.home.length > match.injuries.away.length) {
        awayReasons.push(`${match.homeTeam} has more injuries (${match.injuries.home.length} vs ${match.injuries.away.length})`);
    }
    
    // Draw reasons
    if (Math.abs(homeFormPoints - awayFormPoints) <= 2) {
        drawReasons.push('Very evenly matched teams based on form');
    }
    
    if (match.headToHead.draws > 2) {
        drawReasons.push(`History shows ${match.headToHead.draws} draws between these teams`);
    }
    
    if (match.homeGoalsAvg === match.awayGoalsAvg || Math.abs(match.homeGoalsAvg - match.awayGoalsAvg) < 0.3) {
        drawReasons.push('Similar goal-scoring averages suggest close match');
    }
    
    return {
        home: finalHome,
        draw: finalDraw,
        away: finalAway,
        homeReasons: homeReasons,
        awayReasons: awayReasons,
        drawReasons: drawReasons
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
            probability: over15.probability,
            points: Math.round(over15.probability * 100),
            reasons: over15.reasons
        },
        {
            type: 'Both Teams to Score',
            probability: btts.probability,
            points: Math.round(btts.probability * 100),
            reasons: btts.reasons
        },
        {
            type: 'Over 2.5 Goals',
            probability: over25.probability,
            points: Math.round(over25.probability * 100),
            reasons: over25.reasons
        },
        {
            type: `${match.homeTeam} Win`,
            probability: winner.home,
            points: Math.round(winner.home * 100),
            reasons: winner.homeReasons
        },
        {
            type: 'Draw',
            probability: winner.draw,
            points: Math.round(winner.draw * 100),
            reasons: winner.drawReasons
        },
        {
            type: `${match.awayTeam} Win`,
            probability: winner.away,
            points: Math.round(winner.away * 100),
            reasons: winner.awayReasons
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

