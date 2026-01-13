import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { SimStats } from '../types';

interface Props {
  stats: SimStats;
}

const RadarScore: React.FC<Props> = ({ stats }) => {
  const data = [
    { subject: '환경 점수', A: stats.environment, fullMark: 100 },
    { subject: '시간 효율성', A: stats.time, fullMark: 100 },
    { subject: '정확도', A: stats.accuracy, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 bg-white rounded-xl shadow-sm p-4 border border-green-100">
      <h3 className="text-center text-sm font-semibold text-gray-500 mb-2">의사결정 균형</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="현재 기록"
            dataKey="A"
            stroke="#16a34a"
            strokeWidth={2}
            fill="#22c55e"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarScore;