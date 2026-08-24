import React from 'react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#18181b] border border-[#3f3f46] p-2 rounded-md text-sm text-white shadow-lg">
        <p className="font-semibold mb-1 text-[#a1a1aa]">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color || entry.fill }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartWrapper = ({ title, children }) => (
  <div className="bg-[#27272a] border border-[#3f3f46] rounded-md p-5 flex flex-col h-full w-full min-h-[250px]">
    <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#71717a] mb-4">{title}</h3>
    <div className="flex-1 w-full h-full min-h-[150px] relative">
      {/* Absolute position wrapper helps Recharts ResponsiveContainer calculate height correctly in flex layouts */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  </div>
);

export function TrafficChart({ data }) {
  return (
    <ChartWrapper title="Traffic Volume">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="date" stroke="#3f3f46" tick={{fill: '#71717a', fontSize: 11}} tickLine={false} />
          <YAxis stroke="#3f3f46" tick={{fill: '#71717a', fontSize: 11}} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function AnomaliesChart({ data }) {
  return (
    <ChartWrapper title="Anomalies Detected">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="time" stroke="#3f3f46" tick={{fill: '#71717a', fontSize: 11}} tickLine={false} />
          <YAxis stroke="#3f3f46" tick={{fill: '#71717a', fontSize: 11}} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#ef4444" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function RequestMethodsChart({ data }) {
  return (
    <ChartWrapper title="Request Methods">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
          <XAxis type="number" stroke="#3f3f46" tick={{fill: '#71717a', fontSize: 11}} tickLine={false} axisLine={false} />
          <YAxis dataKey="name" type="category" stroke="#3f3f46" tick={{fill: '#71717a', fontSize: 11}} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#3f3f46" radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

const STATUS_COLORS = {
  '200': '#22c55e',
  '301': '#3b82f6',
  '302': '#60a5fa',
  '401': '#fbbf24',
  '403': '#f59e0b',
  '404': '#a1a1aa',
  '429': '#ea580c',
  '500': '#ef4444',
  '502': '#dc2626',
  '503': '#b91c1c',
  'Other': '#71717a'
};

export function StatusCodesChart({ data }) {
  return (
    <ChartWrapper title="Status Codes">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="40%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || STATUS_COLORS['Other']} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={70} 
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', color: '#a1a1aa', paddingTop: '5px' }}
            formatter={(value, entry) => `${value} (${entry.payload.value})`}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
