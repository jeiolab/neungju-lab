import React from 'react';
import { UserStats } from '../types';
import { Award, Target, Flame, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  stats: UserStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const chartData = Object.entries(stats.weaknesses).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
          <span className="text-slate-500 text-sm mb-1">총 점수</span>
          <span className="text-3xl font-bold text-indigo-600">{stats.score}</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
          <span className="text-slate-500 text-sm mb-1">연속 정답</span>
          <div className="flex items-center space-x-1">
             <Flame className="w-5 h-5 text-orange-500" />
             <span className="text-3xl font-bold text-orange-500">{stats.streak}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
          <span className="text-slate-500 text-sm mb-1">판별 횟수</span>
          <span className="text-3xl font-bold text-slate-700">{stats.totalPlayed}</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
          <span className="text-slate-500 text-sm mb-1">정답률</span>
          <span className="text-3xl font-bold text-green-600">
            {stats.totalPlayed > 0 ? Math.round((stats.correctCount / stats.totalPlayed) * 100) : 0}%
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            획득 배지
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.badges.length > 0 ? (
              stats.badges.map((badge, idx) => (
                <span key={idx} className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">
                  {badge}
                </span>
              ))
            ) : (
              <p className="text-slate-400 text-sm">아직 획득한 배지가 없습니다. 게임을 시작해보세요!</p>
            )}
            {stats.streak >= 5 && !stats.badges.includes("연속 5회") && (
                <span className="bg-gray-100 text-gray-400 text-sm px-3 py-1 rounded-full border border-dashed border-gray-300">
                    다음 목표: 5연속 정답
                </span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            오답 분석 (약점 유형)
          </h2>
          <div className="h-48">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f87171" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#f87171" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                데이터가 충분하지 않습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
