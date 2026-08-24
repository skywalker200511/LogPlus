import { useState, useEffect } from 'react';
import { fetchLogs } from '../services/logService';
import AnomalyBadge from '../components/AnomalyBadge';
import LogDetailModal from '../components/LogDetailModal';

export default function Anomalies() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    suspicious: 0
  });

  useEffect(() => {
    loadAnomalies();
  }, []);

  async function loadAnomalies() {
    setLoading(true);
    const { data, error } = await fetchLogs({ anomalyStatus: 'anomaly' });
    
    if (error) {
      console.error("Failed to load anomalies", error);
    } else {
      const logs = data || [];
      setAnomalies(logs);
      
      // Calculate stats based on risk_level
      const criticalCount = logs.filter(l => l.risk_level === 'CRITICAL').length;
      const highCount = logs.filter(l => l.risk_level === 'HIGH').length;
      const suspiciousCount = logs.filter(l => l.risk_level === 'ELEVATED' || l.risk_level === 'LOW').length;
      
      setStats({
        total: logs.length,
        critical: criticalCount,
        high: highCount,
        suspicious: suspiciousCount
      });
    }
    
    setLoading(false);
  }

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Rough relative time
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (Math.abs(daysDifference) < 1) {
      const hoursDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60));
      if (Math.abs(hoursDifference) < 1) {
        const minsDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60));
        return rtf.format(minsDifference, 'minute');
      }
      return rtf.format(hoursDifference, 'hour');
    }
    return date.toLocaleString();
  };

  const getFilteredAnomalies = () => {
    return anomalies.filter(log => {
      // Risk filter
      if (filter === 'Critical' && log.risk_level !== 'CRITICAL') return false;
      if (filter === 'High' && log.risk_level !== 'HIGH') return false;
      if (filter === 'Suspicious' && log.risk_level !== 'ELEVATED' && log.risk_level !== 'LOW') return false;
      
      // Search filter (IP or reason)
      if (search) {
        const q = search.toLowerCase();
        const reason = log.anomaly_reason ? (Array.isArray(log.anomaly_reason) ? log.anomaly_reason.join(' ') : log.anomaly_reason) : '';
        return (log.ip_address?.toLowerCase().includes(q) || reason.toLowerCase().includes(q));
      }
      
      return true;
    });
  };

  const filteredAnomalies = getFilteredAnomalies();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-white">Anomaly Detection</h1>
        <p className="text-sm text-[#a1a1aa] mt-1">Real-time threat analysis and behavioral deviations.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-5 flex flex-col justify-center">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-2">TOTAL DETECTED</h3>
          <div className="text-3xl font-light text-white">{stats.total}</div>
        </div>
        
        <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-5 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5"></div>
          <div className="relative">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              CRITICAL
            </h3>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-light text-red-500">{stats.critical}</div>
              <div className="text-xs text-red-500/70 mb-1.5">Needs Action</div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-5 flex flex-col justify-center">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            HIGH RISK
          </h3>
          <div className="text-3xl font-light text-orange-500">{stats.high}</div>
        </div>
        
        <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-5 flex flex-col justify-center">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            SUSPICIOUS
          </h3>
          <div className="text-3xl font-light text-yellow-500">{stats.suspicious}</div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-[#27272a] border border-[#3f3f46] rounded-md overflow-hidden">
        {/* Toolbar */}
        <div className="bg-[#18181b] border-b border-[#3f3f46] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Critical', 'High', 'Suspicious'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === f 
                    ? 'bg-[#3f3f46] text-white' 
                    : 'bg-transparent text-[#a1a1aa] hover:bg-[#3f3f46]/50 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search IP or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-1.5 bg-[#27272a] border border-[#3f3f46] rounded-md text-sm text-white placeholder-[#71717a] focus:outline-none focus:border-[#a1a1aa] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#18181b] text-[#71717a] text-[11px] font-bold uppercase tracking-[0.05em] border-b border-[#3f3f46]">
              <tr>
                <th className="px-5 py-3 font-medium">Score</th>
                <th className="px-5 py-3 font-medium">IP Address</th>
                <th className="px-5 py-3 font-medium">Detection Reason</th>
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3f3f46]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-[#71717a]">
                    <span className="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
                    <p>Loading anomalies...</p>
                  </td>
                </tr>
              ) : filteredAnomalies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-[#71717a]">
                    No anomalies found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredAnomalies.map((log) => {
                  let firstReason = 'No reason provided';
                  if (log.anomaly_reason) {
                    if (Array.isArray(log.anomaly_reason) && log.anomaly_reason.length > 0) {
                      firstReason = log.anomaly_reason[0];
                    } else if (typeof log.anomaly_reason === 'string') {
                      firstReason = log.anomaly_reason;
                    }
                  }
                  // truncate reason if too long
                  if (firstReason.length > 50) firstReason = firstReason.substring(0, 50) + '...';

                  return (
                    <tr 
                      key={log.id} 
                      className="hover:bg-[#3f3f46]/30 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <AnomalyBadge 
                          score={log.anomaly_score} 
                          riskLevel={log.risk_level} 
                          isAnomaly={true}
                          showScore={true}
                        />
                      </td>
                      <td className="px-5 py-3 font-mono-data text-[#a1a1aa] text-xs">
                        {log.ip_address}
                      </td>
                      <td className="px-5 py-3 text-white truncate max-w-[300px]" title={firstReason}>
                        {firstReason}
                      </td>
                      <td className="px-5 py-3 text-[#71717a] text-xs">
                        {formatTime(log.timestamp)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button 
                          onClick={() => setSelectedLog(log)}
                          className="text-[#3b82f6] hover:text-blue-400 font-medium text-sm transition-colors"
                        >
                          Investigate
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedLog && (
        <LogDetailModal 
          log={selectedLog} 
          onClose={() => setSelectedLog(null)} 
        />
      )}
    </div>
  );
}
