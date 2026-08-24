import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats, fetchChartData, fetchRecentAnomalies } from '../services/logService';
import DashboardCard from '../components/DashboardCard';
import { TrafficChart, StatusCodesChart, RequestMethodsChart } from '../components/Charts';
import AnomalyBadge from '../components/AnomalyBadge';
import LogDetailModal from '../components/LogDetailModal';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalLogs: 0, anomalyCount: 0, normalCount: 0, anomalyRate: '0.00' });
  const [chartData, setChartData] = useState({ logsOverTime: [], anomaliesOverTime: [], statusCodeDist: [], requestTypeDist: [] });
  const [recentAnomalies, setRecentAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, chartInfo, anomaliesRes] = await Promise.all([
          fetchDashboardStats(),
          fetchChartData(),
          fetchRecentAnomalies(5)
        ]);
        
        setStats(statsData);
        setChartData(chartInfo);
        
        if (anomaliesRes.data) {
          setRecentAnomalies(anomaliesRes.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'text-green-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-yellow-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-[#a1a1aa]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-white">Security Overview</h1>
        <p className="text-sm text-[#a1a1aa] mt-1">Monitor incoming logs and identify unusual activity.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="TOTAL LOGS" 
          value={stats.totalLogs.toLocaleString()} 
          subtitle="/24h"
          valueColor="text-white"
          icon="data_usage"
        />
        <DashboardCard 
          title="DETECTED ANOMALIES" 
          value={stats.anomalyCount.toLocaleString()} 
          valueColor="text-amber-400"
          icon="warning"
        />
        <DashboardCard 
          title="NORMAL ACTIVITY" 
          value={stats.normalCount.toLocaleString()} 
          valueColor="text-green-400"
          icon="check_circle"
        />
        <DashboardCard 
          title="ANOMALY RATE" 
          value={`${stats.anomalyRate}%`} 
          valueColor="text-amber-400"
          icon="trending_up"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Activity Overview (3/4) */}
        <div className="lg:col-span-3 bg-[#27272a] border border-[#3f3f46] rounded-md p-5 flex flex-col">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-4">Activity Overview</h3>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-[#71717a]">Loading chart...</div>
            ) : (
              <TrafficChart data={chartData.logsOverTime} />
            )}
          </div>
        </div>

        {/* Right: Stacked Cards (1/4) */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-5 flex-1 min-h-[180px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-4">HTTP Status Codes</h3>
            <div className="h-[120px]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-[#71717a]">Loading...</div>
              ) : (
                <StatusCodesChart data={chartData.statusCodeDist} />
              )}
            </div>
          </div>
          
          <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-5 flex-1 min-h-[180px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-4">Request Methods</h3>
            <div className="h-[120px]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-[#71717a]">Loading...</div>
              ) : (
                <RequestMethodsChart data={chartData.requestTypeDist} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Anomalies Table */}
      <div className="bg-[#27272a] border border-[#3f3f46] rounded-md overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#3f3f46] bg-[#18181b]">
          <h3 className="text-white font-semibold">Recent Anomalies</h3>
          <Link to="/anomalies" className="text-sm text-[#3b82f6] hover:text-blue-400 flex items-center gap-1 transition-colors">
            View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#18181b] text-[#71717a] text-[11px] font-bold uppercase tracking-[0.05em] border-b border-[#3f3f46]">
              <tr>
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium">IP Address</th>
                <th className="px-5 py-3 font-medium">Request</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Score</th>
                <th className="px-5 py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3f3f46]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-[#71717a]">Loading anomalies...</td>
                </tr>
              ) : recentAnomalies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-[#71717a]">No recent anomalies found.</td>
                </tr>
              ) : (
                recentAnomalies.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-[#3f3f46]/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-5 py-3 font-mono-data text-[#a1a1aa] text-xs">{formatTime(log.timestamp)}</td>
                    <td className="px-5 py-3 font-mono-data text-[#a1a1aa] text-xs">{log.ip_address}</td>
                    <td className="px-5 py-3 font-mono-data text-xs">
                      <span className={getMethodColor(log.request_type)}>{log.request_type}</span>{' '}
                      <span className="text-[#a1a1aa]">{log.endpoint || '/'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2 py-0.5 border border-[#3f3f46] rounded text-xs text-[#a1a1aa]">
                        {log.status_code}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#a1a1aa] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#71717a]"></span>
                      {log.location || 'Unknown'}
                    </td>
                    <td className="px-5 py-3 text-white">{log.anomaly_score}</td>
                    <td className="px-5 py-3">
                      <AnomalyBadge 
                        score={log.anomaly_score} 
                        riskLevel={log.risk_level} 
                        isAnomaly={true}
                        showScore={false}
                      />
                    </td>
                  </tr>
                ))
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
