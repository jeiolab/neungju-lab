import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ value }) => {
  const data = [{ name: 'reliability', value: value, fill: value > 80 ? '#22c55e' : value > 50 ? '#eab308' : '#ef4444' }];

  return (
    <div className="relative h-48 w-full flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="70%" 
          innerRadius="60%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] text-center">
        <div className="text-3xl font-bold text-slate-700">{value}%</div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">신뢰도</div>
      </div>
    </div>
  );
};