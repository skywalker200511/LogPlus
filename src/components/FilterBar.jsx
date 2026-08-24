import React from 'react';

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-[#27272a] border border-[#3f3f46] rounded-md">
      <div className="flex-1 min-w-[200px] relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-sm">search</span>
        <input 
          type="text" 
          placeholder="Search IPs, endpoints..." 
          className="w-full pl-9 pr-3 py-1.5 bg-[#09090b] border border-[#3f3f46] text-white text-sm rounded-md focus:border-[#3b82f6] focus:ring-0 placeholder-[#71717a]"
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>

      <select 
        className="bg-[#09090b] border border-[#3f3f46] text-white text-sm rounded-md px-3 py-1.5 focus:border-[#3b82f6] focus:ring-0"
        value={filters.statusCode || ''}
        onChange={(e) => onFilterChange({ statusCode: e.target.value })}
      >
        <option value="">Status: All</option>
        <option value="200">2xx Success</option>
        <option value="300">3xx Redirect</option>
        <option value="400">4xx Client Error</option>
        <option value="500">5xx Server Error</option>
      </select>

      <select 
        className="bg-[#09090b] border border-[#3f3f46] text-white text-sm rounded-md px-3 py-1.5 focus:border-[#3b82f6] focus:ring-0"
        value={filters.requestType || ''}
        onChange={(e) => onFilterChange({ requestType: e.target.value })}
      >
        <option value="">Method: All</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
      
      <div className="flex items-center gap-2 ml-auto pl-2 border-l border-[#3f3f46]">
        <span className="text-sm text-[#a1a1aa]">Anomalies only</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={filters.anomalyStatus === 'anomaly'}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              anomalyStatus: e.target.checked ? 'anomaly' : 'all' 
            })}
          />
          <div className="w-9 h-5 bg-[#3f3f46] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3b82f6]"></div>
        </label>
        
        <button className="ml-2 text-[#71717a] hover:text-white p-1 flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
        </button>
      </div>
    </div>
  );
}
