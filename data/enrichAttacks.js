function calculateDosScore(a) {
  return (a.requestsPerSecond * 0.6) + (a.failedRequests * 0.4);
}

function classifyRisk(score) {
  if (score > 800) return "HIGH";
  if (score > 400) return "MEDIUM";
  return "LOW";
}

function enrichAttacks(rawAttacks) {
  const now = Date.now();

  return rawAttacks.map(a => {
    const score = calculateDosScore(a);
    
    return {
      ...a,
      dosScore: Math.round(score),
      riskLevel: classifyRisk(score),
      timestamp: new Date(now + a.timeOffsetSec * 1000)
    };
  }); 
}

module.exports = enrichAttacks;