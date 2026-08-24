import React from 'react';
import AnomalyBadge from './AnomalyBadge';

const getMethodColor = (method) => {
  switch(method) {
    case 'DELETE': return 'text-red-400';
    case 'PUT':
    case 'PATCH': return 'text-amber-400';
    case 'POST': return 'text-green-400';
    case 'GET': return 'text-blue-400';
    default: return 'text-white';
  }
};

const getStatusColor = (status) => {
  if (status >= 500) return 'text-red-500 border-red-500/20 bg-red-500/10';
  if (status === 401) return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
  if (status === 403) return 'text-red-400 border-red-400/20 bg-red-400/10';
  if (status >= 400) return 'text-amber-400 border-amber-400/20 bg-amber-400/10';
  if (status >= 300) return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
  if (status >= 200) return 'text-green-400 border-green-400/20 bg-green-400/10';
  return 'text-white border-[#3f3f46] bg-zinc-700/30';
};

const getScoreColorInfo = (score) => {
  if (score == null) return { bar: 'bg-[#3f3f46]', text: 'text-[#a1a1aa]', border: 'border-l-transparent' };
  if (score >= 80) return { bar: 'bg-red-500', text: 'text-red-500', border: 'border-l-red-500' };
  if (score >= 60) return { bar: 'bg-orange-500', text: 'text-orange-500', border: 'border-l-orange-500' };
  if (score >= 30) return { bar: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-l-yellow-500' };
  return { bar: 'bg-[#a1a1aa]', text: 'text-[#a1a1aa]', border: 'border-l-transparent' };
};

export default function LogsTable({ logs, onRowClick, loading }) {
  if (loading) {
    return <div className="p-8 text-center text-[#71717a]">Loading logs...</div>;
  }

  if (!logs || logs.length === 0) {
    return <div className="p-8 text-center text-[#71717a]">No logs found.</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[#18181b] border-b border-[#3f3f46] text-[#71717a] text-[11px] font-bold uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 font-bold">Timestamp</th>
            <th className="px-4 py-3 font-bold">Source IP</th>
            <th className="px-4 py-3 font-bold">Method</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">User Agent</th>
            <th className="px-4 py-3 font-bold">Session</th>
            <th className="px-4 py-3 font-bold">Location</th>
            <th className="px-4 py-3 font-bold">Anomaly Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#18181b]">
          {logs.map((log) => {
            const scoreInfo = getScoreColorInfo(log.anomaly_score);
            return (
              <tr 
                key={log.id} 
                onClick={() => onRowClick && onRowClick(log)}
                className={`hover:bg-[#18181b] transition-colors cursor-pointer bg-[#09090b] border-l-4 ${scoreInfo.border}`}
              >
                <td className="px-4 py-3 font-mono-data text-[#a1a1aa]">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono-data text-white">
                  {log.source_ip}
                </td>
                <td className={`px-4 py-3 font-mono-data font-semibold ${getMethodColor(log.method)}`}>
                  {log.method}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs border font-mono-data ${getStatusColor(log.status_code)}`}>
                    {log.status_code}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#a1a1aa] max-w-xs truncate" title={log.user_agent}>
                  {log.user_agent?.substring(0, 30)}{log.user_agent?.length > 30 ? '...' : ''}
                </td>
                <td className="px-4 py-3 text-[#a1a1aa]">
                  {log.session_id ? (log.session_id.substring(0,8) + '...') : '-'}
                </td>
                <td className="px-4 py-3 text-white">
                  {log.location || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${scoreInfo.bar}`} style={{ width: `${Math.min(100, Math.max(0, log.anomaly_score || 0))}%` }}></div>
                    </div>
                    <span className={`font-mono-data text-sm ${scoreInfo.text}`}>
                      {log.anomaly_score != null ? log.anomaly_score : '-'}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
