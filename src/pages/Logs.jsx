import { useState, useEffect } from 'react';
import { fetchLogs, updateAnomalyResults } from '../services/logService';
import { analyzeAllLogs } from '../algorithms/anomalyDetector';
import { generateExplanation, generateBriefExplanation } from '../utils/explanationGenerator';
import FilterBar from '../components/FilterBar';
import LogsTable from '../components/LogsTable';
import LogDetailModal from '../components/LogDetailModal';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    anomalyStatus: 'all',
    requestType: 'all',
    statusCode: 'all'
  });
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    loadLogs();
  }, [filters]);

  async function loadLogs() {
    setLoading(true);
    const { data, error } = await fetchLogs(filters);
    
    if (error) {
      console.error("Failed to load logs", error);
    } else {
      setLogs(data || []);
    }
    
    setLoading(false);
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAnalyzeLogs = async () => {
    setAnalyzing(true);
    try {
      const logsToAnalyze = logs.filter(l => l.anomaly_score === null || l.anomaly_score === undefined);
      const targetLogs = logsToAnalyze.length > 0 ? logsToAnalyze : logs;
      
      if (targetLogs.length === 0) {
        alert("No logs to analyze.");
        setAnalyzing(false);
        return;
      }
      
      const analysisResults = analyzeAllLogs(targetLogs);
      
      const updates = analysisResults.map(result => {
        const originalLog = targetLogs.find(l => l.id === result.id);
        const explanation = generateExplanation(originalLog, result.reasons, result.score, result.riskLevel);
        const briefReason = generateBriefExplanation(result.reasons);
        
        return {
          id: result.id,
          is_anomaly: result.isAnomaly,
          anomaly_score: result.score,
          anomaly_reason: briefReason,
          ai_explanation: explanation
        };
      });
      
      const { success, errorCount } = await updateAnomalyResults(updates);
      
      if (success || updates.length > 0) {
        alert(`Successfully analyzed ${updates.length - (errorCount || 0)} logs.`);
        loadLogs();
      } else {
        alert("Failed to update some log results.");
      }
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Error analyzing logs.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-white">Log Explorer</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Search and investigate incoming request logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAnalyzeLogs}
            disabled={analyzing || logs.length === 0}
            className="px-4 py-2 bg-[#3b82f6] hover:bg-blue-600 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                Analyzing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                Analyze Logs
              </>
            )}
          </button>
          <button className="px-4 py-2 border border-[#3f3f46] text-white rounded-md text-sm font-medium hover:bg-[#27272a] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            Save View
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-4">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Logs Table Area */}
      <div className="flex-1 bg-[#27272a] border border-[#3f3f46] rounded-md flex flex-col min-h-[400px] overflow-hidden">
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#71717a] py-12">
              <span className="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
              <p>Loading logs...</p>
            </div>
          ) : (
            <LogsTable logs={logs} onRowClick={setSelectedLog} />
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-[#18181b] border-t border-[#3f3f46] p-4 flex items-center justify-between text-sm text-[#a1a1aa]">
          <div>
            Showing {logs.length} logs {filters.search || filters.anomalyStatus !== 'all' || filters.requestType !== 'all' || filters.statusCode !== 'all' ? '(filtered)' : ''}
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-[#3f3f46] hover:bg-[#27272a] hover:text-white disabled:opacity-50">
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#3f3f46] text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-[#3f3f46] hover:bg-[#27272a] hover:text-white disabled:opacity-50">
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
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
