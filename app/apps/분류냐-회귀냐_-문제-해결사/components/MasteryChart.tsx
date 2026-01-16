import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { MasteryStats } from '../types';

interface MasteryChartProps {
  stats: MasteryStats;
}

const MasteryChart: React.FC<MasteryChartProps> = ({ stats }) => {
  const classificationRate = stats.classificationTotal === 0 
    ? 0 
    : Math.round((stats.classificationCorrect / stats.classificationTotal) * 100);

  const regressionRate = stats.regressionTotal === 0 
    ? 0 
    : Math.round((stats.regressionCorrect / stats.regressionTotal) * 100);

  const data = [
    { name: '분류 (Classification)', score: classificationRate, color: '#6366f1' }, // Indigo-500
    { name: '회귀 (Regression)', score: regressionRate, color: '#ec4899' }, // Pink-500
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📊</span> 나의 학습 마스터리
      </h3>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
            <Tooltip 
                cursor={{fill: 'transparent'}}
                formatter={(value: number | undefined) => value !== undefined ? [`${value}점`, '이해도'] : ['', '이해도']}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-sm text-gray-500 text-center">
        문제를 많이 맞힐수록 그래프가 채워집니다!
      </div>
    </div>
  );
};

export default MasteryChart;
