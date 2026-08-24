import { useState } from 'react';
import CsvImport from '../components/CsvImport';
import { useNavigate } from 'react-router-dom';

export default function ImportLogs() {
  const navigate = useNavigate();
  
  const handleImportComplete = () => {
    // Navigate to anomalies or just stay
    navigate('/logs');
  };

  const handleDownloadSample = () => {
    const link = document.createElement('a');
    link.href = '/sample_logs.csv';
    link.download = 'sample_logs.csv';
    link.click();
  };

  const columns = [
    { name: 'Timestamp', type: 'ISO 8601' },
    { name: 'IP_Address', type: 'STRING' },
    { name: 'Request_Type', type: 'ENUM' },
    { name: 'Status_Code', type: 'INT' },
    { name: 'User_Agent', type: 'STRING' },
    { name: 'Session_ID', type: 'UUID' },
    { name: 'Location', type: 'STRING' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-white">Import Logs</h1>
        <p className="text-sm text-[#a1a1aa] mt-1">Upload server logs for anomaly analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CsvImport onImportComplete={handleImportComplete} />
        </div>
        <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-5 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#a1a1aa] text-[20px]">code</span>
            <h3 className="text-sm font-semibold text-white">Required Format</h3>
          </div>
          <p className="text-sm text-[#71717a] mb-4">Ensure your CSV file contains the following columns exactly as named below to guarantee accurate parsing.</p>
          <div className="space-y-0 border border-[#3f3f46] rounded-md overflow-hidden">
            {columns.map((col, i) => (
              <div key={col.name} className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-[#18181b]' : 'bg-[#27272a]'}`}>
                <span className="text-white font-mono-data">{col.name}</span>
                <span className="text-[#71717a] font-bold text-xs uppercase">{col.type}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleDownloadSample}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#3f3f46] text-[#a1a1aa] rounded-md hover:bg-[#18181b] hover:text-white transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download sample CSV
          </button>
        </div>
      </div>
    </div>
  );
}
