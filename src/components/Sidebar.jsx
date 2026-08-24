import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/logs', icon: 'list_alt', label: 'Logs' },
  { to: '/anomalies', icon: 'error', label: 'Anomalies' },
  { to: '/import', icon: 'upload_file', label: 'Import Logs' },
];

export default function Sidebar() {
  return (
    <nav className="bg-[#18181b] h-screen w-[260px] fixed left-0 top-0 border-r border-[#3f3f46] flex flex-col py-6 px-4 z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <span className="material-symbols-outlined text-[#3b82f6] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white tracking-tight">LOGPLUS</span>
          <span className="text-[11px] font-bold tracking-[0.05em] text-[#a1a1aa] uppercase">SOC Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              isActive
                ? 'nav-item-active flex items-center gap-3 px-3 py-2 rounded-md text-[#3b82f6] font-semibold bg-[#3b82f6]/10 border-r-2 border-[#3b82f6]'
                : 'flex items-center gap-3 px-3 py-2 rounded-md text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors'
            }
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom section */}
      <div className="mt-auto space-y-1 pt-4 border-t border-[#3f3f46]">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-md hover:bg-blue-600 transition-colors mb-4 text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Report
        </button>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-sm">Settings</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
          <span className="text-sm">Profile</span>
        </a>
      </div>
    </nav>
  );
}
