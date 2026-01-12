import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const PerformanceChart: React.FC = () => {
  const data = [
    { n: 10, linear: 10, binary: 4 },
    { n: 50, linear: 50, binary: 6 },
    { n: 100, linear: 100, binary: 7 },
    { n: 250, linear: 250, binary: 8 },
    { n: 500, linear: 500, binary: 9 },
    { n: 1000, linear: 1000, binary: 10 },
  ];

  return (
    <div className="w-full h-64 mt-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">성능 비교 (최악의 경우)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="n" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="linear"
            name="선형 (거북이)"
            stroke="#10b981" // emerald-500
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="binary"
            name="이진 (토끼)"
            stroke="#f43f5e" // rose-500
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};