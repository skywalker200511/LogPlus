import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const navigate = useNavigate();
  
  return (
    <header className="bg-[#09090b] h-14 border-b border-[#3f3f46] flex justify-between items-center px-6 shrink-0 z-10">
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search logs, IPs, rules..."
            className="bg-[#09090b] border border-[#3f3f46] text-white text-sm rounded-md pl-9 pr-4 py-1.5 w-80 focus:outline-none focus:border-[#3b82f6] placeholder-[#71717a]"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-[#a1a1aa] hover:text-white hover:bg-[#27272a] p-2 rounded-full transition-all">
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
        <button onClick={() => navigate('/')} className="px-3 py-1.5 border border-[#3f3f46] text-white rounded-md text-sm hover:bg-[#27272a] transition-colors">
          Security Overview
        </button>
        <button className="text-[#a1a1aa] hover:text-white hover:bg-[#27272a] p-2 rounded-full transition-all">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
        <button className="text-[#a1a1aa] hover:text-white hover:bg-[#27272a] p-2 rounded-full transition-all">
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>
      </div>
    </header>
  );
}
