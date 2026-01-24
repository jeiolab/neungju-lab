import React from 'react';
import { GameStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, AlertTriangle, Flame } from 'lucide-react';

interface DashboardProps {
  stats: GameStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const data = Object.entries(stats.mistakes).map(([key, value]) => ({
    name: key,
    value: value,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
      {/* Score & Streak */}
      <div className="flex gap-6 w-full md:w-auto justify-center md:justify-start">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Total Score</p>
                <p className="text-2xl font-black text-gray-800">{stats.score}</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
             <div className="p-3 bg-orange-100 rounded-full">
                <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Streak</p>
                <p className="text-2xl font-black text-gray-800">{stats.streak}일 연속</p>
            </div>
        </div>
      </div>

       {/* Mistake Analysis Chart */}
      {data.length > 0 && (
        <div className="flex-1 w-full h-24 md:h-20 flex items-center gap-4 border-l border-gray-200 pl-4 md:pl-6">
            <div className="hidden md:block">
                 <p className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3"/> 실수 분석
                 </p>
                 <p className="text-xs text-gray-400">자주 틀리는 유형</p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} interval={0} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px'}} />
                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={10}>
                         {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#818cf8' : '#6366f1'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
