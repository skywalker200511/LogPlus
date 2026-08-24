import React, { useState, useRef } from 'react';
import { parseCSVFile } from '../utils/csvParser';
import { insertLogs, updateAnomalyResults } from '../services/logService';
import { analyzeAllLogs } from '../algorithms/anomalyDetector';
import { generateExplanation, generateBriefExplanation } from '../utils/explanationGenerator';

export default function CsvImport({ onImportComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null); // 'success', 'error', null
  const [errorDetails, setErrorDetails] = useState('');
  const [stats, setStats] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setStatus('error');
      setErrorDetails('Please upload a valid CSV file.');
      return;
    }

    setLoading(true);
    setStatus(null);
    setProgress(10);

    try {
      // Step 1: Parse CSV
      const { data, errors: parseErrs } = await parseCSVFile(file);
      
      if (parseErrs && parseErrs.length > 0) {
        setStatus('error');
        setErrorDetails(parseErrs.map(e => typeof e === 'string' ? e : `Row ${e.row}: ${e.reason}`).join(', '));
        if (!data || data.length === 0) {
          setLoading(false);
          return;
        }
      }

      if (!data || data.length === 0) {
        setStatus('error');
        setErrorDetails('No valid rows found in CSV file.');
        setLoading(false);
        return;
      }
      setProgress(30);

      // Step 2: Insert into Supabase
      const { data: insertedLogs, error: insertError } = await insertLogs(data);
      
      if (insertError) {
        setStatus('error');
        setErrorDetails(`Database error: ${insertError.message}`);
        setLoading(false);
        return;
      }

      if (!insertedLogs || insertedLogs.length === 0) {
        setStatus('error');
        setErrorDetails('Failed to insert logs into database. Check Supabase RLS policies.');
        setLoading(false);
        return;
      }
      setProgress(60);

      // Step 3: Run anomaly detection on inserted logs
      const analysisResults = analyzeAllLogs(insertedLogs);
      
      // Step 4: Generate explanations and build update array
      let anomalyCount = 0;
      const updates = analysisResults.map(result => {
        const matchingLog = insertedLogs.find(l => l.id === result.id);
        const explanation = generateExplanation(matchingLog, result.reasons, result.score, result.riskLevel);
        const briefReason = generateBriefExplanation(result.reasons);
        
        if (result.isAnomaly) anomalyCount++;
        
        return {
          id: result.id,
          is_anomaly: result.isAnomaly,
          anomaly_score: result.score,
          anomaly_reason: briefReason,
          ai_explanation: explanation
        };
      });
      setProgress(85);

      // Step 5: Update anomaly results in Supabase
      await updateAnomalyResults(updates);
      
      setProgress(100);
      setStatus('success');
      setStats({ total: insertedLogs.length, anomalies: anomalyCount });
      
      if (onImportComplete) {
        onImportComplete();
      }

    } catch (err) {
      console.error('CSV import error:', err);
      setStatus('error');
      setErrorDetails(err.message || 'An unexpected error occurred during import.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <div 
        className={`bg-[#27272a] border-2 border-dashed rounded-md p-12 text-center transition-colors ${
          isDragging ? 'border-[#3b82f6] bg-[#3b82f6]/5' : 
          status === 'error' ? 'border-red-500/50' : 
          'border-[#3f3f46]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv" 
          className="hidden" 
        />
        
        {loading ? (
          <div className="space-y-4">
            <span className="material-symbols-outlined text-4xl text-[#3b82f6] animate-pulse">sync</span>
            <div>
              <p className="text-lg font-semibold text-white">Importing logs...</p>
              <div className="w-64 h-2 bg-[#18181b] rounded-full mx-auto mt-4 overflow-hidden">
                <div className="h-full bg-[#3b82f6] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-4">
            <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
            <div>
              <p className="text-lg font-semibold text-white">Import Complete</p>
              <p className="text-sm text-[#71717a] mt-1">Successfully imported {stats?.total} logs.</p>
              {stats?.anomalies > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  {stats.anomalies} anomalies detected
                </div>
              )}
            </div>
            <button 
              onClick={() => { setStatus(null); setStats(null); }}
              className="mt-6 border border-[#3f3f46] text-[#a1a1aa] hover:text-white hover:bg-[#18181b] px-4 py-1.5 rounded-md text-sm transition-colors"
            >
              Import Another
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <span className="material-symbols-outlined text-4xl text-[#71717a]">cloud_upload</span>
            <div>
              <p className="text-lg font-semibold text-white">Drop CSV file here or Browse files</p>
              <p className="text-sm text-[#71717a] mt-1">Maximum file size: 500MB. Supported formats: .csv</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
            >
              Select File
            </button>
          </div>
        )}
      </div>

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 flex gap-3 text-red-500">
          <span className="material-symbols-outlined">error</span>
          <div>
            <p className="font-medium">Import Failed</p>
            <p className="text-sm mt-1">{errorDetails}</p>
          </div>
        </div>
      )}
    </div>
  );
}
