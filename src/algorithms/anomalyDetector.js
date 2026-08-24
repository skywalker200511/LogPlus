/**
 * Returns the risk level string for a given score.
 * @param {number} score - The calculated anomaly score (0-100)
 * @returns {string} Risk level category
 */
export function getRiskLevel(score) {
  if (score < 30) return 'Normal';
  if (score < 60) return 'Suspicious';
  if (score < 80) return 'High Risk';
  return 'Critical';
}

/**
 * Returns a tailwind color class based on the risk level.
 * @param {string} riskLevel - The risk level string
 * @returns {string} Tailwind text color class
 */
export function getRiskColor(riskLevel) {
  switch (riskLevel) {
    case 'Normal':
      return 'text-green-400';
    case 'Suspicious':
      return 'text-amber-400';
    case 'High Risk':
      return 'text-red-500';
    case 'Critical':
      return 'text-red-700';
    default:
      return 'text-gray-500';
  }
}

/**
 * Analyzes an array of logs and detects anomalies based on behavior and individual log properties.
 * @param {Array} logs - Array of log objects to analyze
 * @returns {Array} Array of analysis result objects for each log
 */
export function analyzeAllLogs(logs) {
  // Pass 1: Build behavioral profiles
  const ipStats = {};
  const sessionStats = {};

  logs.forEach(log => {
    const { ip_address, session_id, status_code } = log;
    const isFailure = status_code >= 400 && status_code < 600;
    const is404 = status_code === 404;

    // Track IP behavior
    if (!ipStats[ip_address]) {
      ipStats[ip_address] = { total: 0, failures: 0, count404: 0 };
    }
    ipStats[ip_address].total += 1;
    if (isFailure) ipStats[ip_address].failures += 1;
    if (is404) ipStats[ip_address].count404 += 1;

    // Track Session behavior
    if (session_id) {
      if (!sessionStats[session_id]) {
        sessionStats[session_id] = { total: 0, failures: 0 };
      }
      sessionStats[session_id].total += 1;
      if (isFailure) sessionStats[session_id].failures += 1;
    }
  });

  // Pass 2: Score each log
  return logs.map(log => {
    let score = 0;
    const reasons = [];

    // 1. HTTP Status scoring
    const statusScores = {
      401: { points: 15, msg: 'HTTP 401 Unauthorized response' },
      403: { points: 20, msg: 'HTTP 403 Forbidden response' },
      404: { points: 5, msg: 'HTTP 404 Not Found response' },
      429: { points: 20, msg: 'HTTP 429 Too Many Requests' },
      500: { points: 15, msg: 'HTTP 500 Internal Server Error' },
      502: { points: 10, msg: 'HTTP 502 Bad Gateway' },
      503: { points: 10, msg: 'HTTP 503 Service Unavailable' },
    };

    if (statusScores[log.status_code]) {
      score += statusScores[log.status_code].points;
      reasons.push(statusScores[log.status_code].msg);
    }

    // 2. Request method scoring
    const methodScores = {
      'DELETE': { points: 10, msg: 'DELETE request method used' },
      'PUT': { points: 5, msg: 'PUT request method used' },
      'PATCH': { points: 5, msg: 'PATCH request method used' },
    };
    const methodUpper = String(log.request_type).toUpperCase();
    if (methodScores[methodUpper]) {
      score += methodScores[methodUpper].points;
      reasons.push(methodScores[methodUpper].msg);
    }

    // 3. User agent scoring
    const ua = log.user_agent ? log.user_agent.trim() : '';
    const uaLower = ua.toLowerCase();
    if (!ua) {
      score += 20;
      reasons.push('Missing or empty user agent');
    } else if (['bot', 'crawler', 'scanner', 'spider', 'scraper'].some(keyword => uaLower.includes(keyword))) {
      score += 15;
      reasons.push('Suspicious automated user agent detected');
    } else if (ua.length < 10) {
      score += 10;
      reasons.push('Unusually short user agent string');
    }

    // 4. IP behavior scoring
    const ipStat = ipStats[log.ip_address];
    if (ipStat) {
      if (ipStat.total > 50) {
        score += 15;
        reasons.push(`High request volume from IP (${ipStat.total} requests)`);
      } else if (ipStat.total > 20) {
        score += 10;
        reasons.push(`Elevated request volume from IP (${ipStat.total} requests)`);
      }

      const ipFailRate = (ipStat.failures / ipStat.total) * 100;
      if (ipFailRate > 50) {
        score += 20;
        reasons.push(`High failure rate from IP (${ipFailRate.toFixed(1)}% of requests failed)`);
      } else if (ipFailRate > 25) {
        score += 10;
        reasons.push(`Elevated failure rate from IP (${ipFailRate.toFixed(1)}% of requests failed)`);
      }

      // 404 boost
      if (ipStat.total > 10 && log.status_code === 404) {
        const rate404 = (ipStat.count404 / ipStat.total) * 100;
        if (rate404 > 30) {
          score += 10;
          reasons.push('Frequent 404 errors from this IP suggest scanning');
        }
      }
    }

    // 5. Session behavior scoring
    if (log.session_id) {
      const sessionStat = sessionStats[log.session_id];
      if (sessionStat) {
        if (sessionStat.total > 30) {
          score += 10;
          reasons.push(`High session activity (${sessionStat.total} requests in session)`);
        }
        const sessionFailRate = (sessionStat.failures / sessionStat.total) * 100;
        if (sessionFailRate > 50) {
          score += 15;
          reasons.push(`High failure rate in session (${sessionFailRate.toFixed(1)}% failed)`);
        }
      }
    }

    // Cap score at 100
    if (score > 100) score = 100;

    // Classify
    const riskLevel = getRiskLevel(score);
    const isAnomaly = score >= 30;

    return {
      id: log.id,
      score,
      isAnomaly,
      riskLevel,
      reasons
    };
  });
}
