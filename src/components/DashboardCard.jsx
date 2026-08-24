export default function DashboardCard({ title, value, color = 'text-white', subtitle, pipColor }) {
  return (
    <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-5 flex flex-col justify-between">
      <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] flex items-center gap-1.5">
        {pipColor && <span className={`w-2 h-2 rounded-full ${pipColor}`}></span>}
        {title}
      </span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-3xl font-semibold ${color}`}>{value}</span>
        {subtitle && <span className="text-sm text-[#71717a]">{subtitle}</span>}
      </div>
    </div>
  );
}
