import React from 'react';
import { UserState } from '../types';
import { BADGES, LEVEL_THRESHOLDS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Flame, Target, ShieldAlert } from 'lucide-react';

interface StatsDashboardProps {
  userState: UserState;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ userState }) => {
  // Process history for chart
  const getLast7Days = () => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      data.push({
        day: d.toLocaleDateString('ko-KR', { weekday: 'short' }),
        completed: userState.history[dateStr]?.completed ? 1 : 0,
      });
    }
    return data;
  };

  const chartData = getLast7Days();

  // Determine next level
  const nextLevelXp = LEVEL_THRESHOLDS[userState.level] || 9999;
  const progressPercent = Math.min(100, (userState.xp / nextLevelXp) * 100);
  
  // Find top weakness
  const sortedWeaknesses = Object.entries(userState.quizHistory.weaknessTags)
    .sort((a, b) => (b[1] as number) - (a[1] as number));
  const topWeakness = sortedWeaknesses.length > 0 ? sortedWeaknesses[0][0] : '없음';

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Flame size={16} className="text-orange-500" /> 현재 스트릭
          </div>
          <div className="text-2xl font-bold text-gray-800">{userState.currentStreak}일</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Trophy size={16} className="text-yellow-500" /> 현재 레벨
          </div>
          <div className="text-2xl font-bold text-gray-800">LV.{userState.level}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Target size={16} className="text-blue-500" /> 총 XP
          </div>
          <div className="text-2xl font-bold text-gray-800">{userState.xp}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <ShieldAlert size={16} className="text-red-500" /> 취약 개념
          </div>
          <div className="text-lg font-bold text-gray-800 truncate">{topWeakness}</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between mb-2 text-sm font-medium">
          <span>다음 레벨까지</span>
          <span>{userState.xp} / {nextLevelXp} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">주간 미션 달성</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="completed" radius={[4, 4, 4, 4]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.completed ? '#4f46e5' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">내 배지</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.values(BADGES).map((badge) => {
              const hasBadge = userState.badges.includes(badge.id);
              return (
                <div key={badge.id} className="flex flex-col items-center text-center group relative">
                  <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-full mb-1 transition ${hasBadge ? 'bg-indigo-100 grayscale-0' : 'bg-gray-100 grayscale opacity-50'}`}>
                    {badge.icon}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{badge.name}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 p-2 bg-gray-800 text-white text-xs rounded z-10 pointer-events-none">
                    {badge.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};