import { supabase } from './supabase';

/**
 * Fetches logs with optional filtering.
 * @param {Object} filters - Optional filters object.
 * @returns {Object} { data, error }
 */
export async function fetchLogs(filters = {}) {
  try {
    let query = supabase.from('logs').select('*');

    // Filter by anomaly status (accepts 'all', 'anomaly', 'normal', 'All', 'Anomaly', 'Normal')
    const anomalyStatus = (filters.anomalyStatus || '').toLowerCase();
    if (anomalyStatus === 'anomaly') {
      query = query.eq('is_anomaly', true);
    } else if (anomalyStatus === 'normal') {
      query = query.eq('is_anomaly', false);
    }

    // Filter by status code (ignore 'All', 'all', or empty)
    if (filters.statusCode && String(filters.statusCode).toLowerCase() !== 'all') {
      const baseCode = parseInt(filters.statusCode, 10);
      if (!isNaN(baseCode)) {
        query = query.gte('status_code', baseCode).lt('status_code', baseCode + 100);
      }
    }

    // Filter by request type (ignore 'All', 'all', or empty)
    if (filters.requestType && String(filters.requestType).toLowerCase() !== 'all') {
      query = query.eq('request_type', filters.requestType);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    // Search by IP
    const searchText = filters.searchText || filters.search || '';
    if (searchText) {
      query = query.ilike('ip_address', `%${searchText}%`);
    }

    query = query.order('timestamp', { ascending: false }).limit(500);
    const { data, error } = await query;

    return { data: data || [], error };
  } catch (error) {
    console.error('Error fetching logs:', error);
    return { data: [], error };
  }
}

/**
 * Fetches a single log by its ID.
 * @param {number} id - The ID of the log.
 * @returns {Object} { data, error }
 */
export async function fetchLogById(id) {
  try {
    const { data, error } = await supabase.from('logs').select('*').eq('id', id).single();
    return { data, error };
  } catch (error) {
    console.error(`Error fetching log with id ${id}:`, error);
    return { data: null, error };
  }
}

/**
 * Inserts an array of log objects into the database.
 * Uses .select() to return the inserted rows with their generated IDs.
 * @param {Array} logs - Array of log objects.
 * @returns {Object} { data, error }
 */
export async function insertLogs(logs) {
  try {
    const { data, error } = await supabase.from('logs').insert(logs).select();
    return { data: data || [], error };
  } catch (error) {
    console.error('Error inserting logs:', error);
    return { data: [], error };
  }
}

/**
 * Updates the anomaly detection results for a batch of logs.
 * Loops through the array and updates each log individually.
 * @param {Array} results - Array of result objects { id, is_anomaly, anomaly_score, anomaly_reason, ai_explanation }
 * @returns {Object} { success: boolean, errorCount: number }
 */
export async function updateAnomalyResults(results) {
  let errorCount = 0;
  for (const result of results) {
    try {
      const { error } = await supabase
        .from('logs')
        .update({
          is_anomaly: result.is_anomaly,
          anomaly_score: result.anomaly_score,
          anomaly_reason: result.anomaly_reason,
          ai_explanation: result.ai_explanation
        })
        .eq('id', result.id);
      
      if (error) {
        console.error(`Error updating log ${result.id}:`, error);
        errorCount++;
      }
    } catch (error) {
      console.error(`Exception updating log ${result.id}:`, error);
      errorCount++;
    }
  }
  return { success: errorCount === 0, errorCount };
}

/**
 * Fetches high-level stats for the dashboard.
 * @returns {Object} The calculated dashboard stats.
 */
export async function fetchDashboardStats() {
  try {
    const { data, error } = await supabase.from('logs').select('id, is_anomaly');
    if (error) throw error;

    const totalLogs = data.length;
    const anomalyCount = data.filter(log => log.is_anomaly).length;
    const normalCount = totalLogs - anomalyCount;
    const anomalyRate = totalLogs > 0 ? ((anomalyCount / totalLogs) * 100).toFixed(2) : '0.00';

    return { totalLogs, anomalyCount, normalCount, anomalyRate };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { totalLogs: 0, anomalyCount: 0, normalCount: 0, anomalyRate: '0.00' };
  }
}

/**
 * Fetches and processes log data to be used in charts.
 * @returns {Object} An object containing 4 dataset arrays for charts.
 */
export async function fetchChartData() {
  try {
    const { data, error } = await supabase.from('logs').select('timestamp, is_anomaly, status_code, request_type');
    if (error) throw error;

    const logsOverTimeMap = {};
    const anomaliesOverTimeMap = {};
    const statusCodeDistMap = {};
    const requestTypeDistMap = {};

    data.forEach(log => {
      // Format YYYY-MM-DD
      const date = new Date(log.timestamp).toISOString().split('T')[0];

      // Logs over time
      logsOverTimeMap[date] = (logsOverTimeMap[date] || 0) + 1;
      
      // Anomalies over time
      if (log.is_anomaly) {
        anomaliesOverTimeMap[date] = (anomaliesOverTimeMap[date] || 0) + 1;
      }

      // Status code dist
      statusCodeDistMap[log.status_code] = (statusCodeDistMap[log.status_code] || 0) + 1;

      // Request type dist
      requestTypeDistMap[log.request_type] = (requestTypeDistMap[log.request_type] || 0) + 1;
    });

    // Sort time-based data by date
    const logsOverTime = Object.keys(logsOverTimeMap).sort().map(date => ({ date, count: logsOverTimeMap[date] }));
    const anomaliesOverTime = Object.keys(anomaliesOverTimeMap).sort().map(date => ({ date, count: anomaliesOverTimeMap[date] }));
    const statusCodeDist = Object.keys(statusCodeDistMap).map(name => ({ name: String(name), value: statusCodeDistMap[name] }));
    const requestTypeDist = Object.keys(requestTypeDistMap).map(name => ({ name, value: requestTypeDistMap[name] }));

    return { logsOverTime, anomaliesOverTime, statusCodeDist, requestTypeDist };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return { logsOverTime: [], anomaliesOverTime: [], statusCodeDist: [], requestTypeDist: [] };
  }
}

/**
 * Fetches the most recent anomalies.
 * @param {number} limit - The maximum number of anomalies to return.
 * @returns {Object} { data, error }
 */
export async function fetchRecentAnomalies(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('is_anomaly', true)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    return { data: data || [], error };
  } catch (error) {
    console.error('Error fetching recent anomalies:', error);
    return { data: [], error };
  }
}
