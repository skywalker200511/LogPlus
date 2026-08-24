import React, { useEffect } from 'react';
import AnomalyBadge from './AnomalyBadge';

export default function LogDetailModal({ log, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!log) return null;

  const score = log.anomaly_score;
  let scoreBarColor = 'bg-[#a1a1aa]';
  if (score >= 80) scoreBarColor = 'bg-red-500';
  else if (score >= 60) scoreBarColor = 'bg-orange-500';
  else if (score >= 30) scoreBarColor = 'bg-yellow-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div 
        className="bg-[#27272a] border border-[#3f3f46] rounded-md max-w-2xl w-full flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-[#3f3f46] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Log Details</h2>
          <button onClick={onClose} className="text-[#a1a1aa] hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          {score != null && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-2">Anomaly Score</div>
              <div className="flex items-center gap-3">
                <AnomalyBadge score={score} />
                <div className="flex-1 h-2 bg-[#18181b] rounded-full overflow-hidden">
                  <div className={`h-full ${scoreBarColor} rounded-full`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }}></div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-1">Timestamp</div>
              <div className="text-sm text-white font-mono-data">{new Date(log.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-1">Source IP</div>
              <div className="text-sm text-white font-mono-data">{log.ip_address}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-1">Method</div>
              <div className="text-sm text-white font-mono-data">{log.request_type}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-1">Status Code</div>
              <div className="text-sm text-white font-mono-data">{log.status_code}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-1">User Agent</div>
              <div className="text-sm text-white break-all">{log.user_agent}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-1">Location</div>
              <div className="text-sm text-white">{log.location || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-1">Session ID</div>
              <div className="text-sm text-white font-mono-data">{log.session_id || 'N/A'}</div>
            </div>
          </div>

          {log.anomaly_reason && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-2">Detection Reason</div>
              <div className="text-sm text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {log.anomaly_reason}
              </div>
            </div>
          )}

          {log.ai_explanation && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-2">AI Explanation</div>
              <div className="bg-[#18181b] border border-[#3f3f46] p-4 rounded-md text-sm text-[#a1a1aa] leading-relaxed">
                {log.ai_explanation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
