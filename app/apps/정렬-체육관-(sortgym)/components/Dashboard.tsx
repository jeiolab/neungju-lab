import React from 'react';
import { UserStats, AlgorithmType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Flame, Activity } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const chartData = [
    { name: 'Selection', score: 100 - (stats.weaknesses['Selection'] || 0) * 10 },
    { name: 'Bubble', score: 100 - (stats.weaknesses['Bubble'] || 0) * 10 },
    { name: 'Insertion', score: 100 - (stats.weaknesses['Insertion'] || 0) * 10 },
    { name: 'Quick', score: 100 - (stats.weaknesses['Quick'] || 0) * 10 },
    { name: 'Merge', score: 100 - (stats.weaknesses['Merge'] || 0) * 10 },
  ].map(d => ({ ...d, score: Math.max(0, d.score) })); // Ensure no negative scores

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">👋 환영합니다, 알고리즘 마스터!</h1>
        <p className="text-slate-600 mt-2">오늘의 훈련을 시작해볼까요?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            <Flame size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">연속 학습 (Streak)</p>
            <p className="text-2xl font-bold text-slate-800">{stats.streak}일 째 🔥</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
            <Trophy size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">총 해결 문제</p>
            <p className="text-2xl font-bold text-slate-800">{stats.solvedCount}개</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">평균 정확도</p>
            <p className="text-2xl font-bold text-slate-800">
              {stats.solvedCount > 0 ? Math.round((stats.correctCount / stats.solvedCount) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">🏆 알고리즘별 마스터리 점수</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[0, 100]} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10b981' : entry.score > 50 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          * 오답이 많을수록 해당 알고리즘 점수가 낮아집니다.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
