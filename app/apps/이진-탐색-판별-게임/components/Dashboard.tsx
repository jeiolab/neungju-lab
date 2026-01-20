import React from 'react';
import { UserStats, Badge } from '../types';
import { BADGES } from '../constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Trophy, Flame, AlertCircle } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  // Calculate Radar Data
  const radarData = [
    { subject: '정렬 중요성', A: 10 - stats.misconceptions.ignoreSorting, fullMark: 10 },
    { subject: '비용 계산', A: 10 - stats.misconceptions.alwaysFast, fullMark: 10 },
    { subject: '동적 데이터', A: 10 - stats.misconceptions.dynamicCost, fullMark: 10 },
    { subject: '연속 집중력', A: Math.min(stats.maxStreak, 10), fullMark: 10 },
    { subject: '경험치', A: Math.min(stats.totalPlayed, 10), fullMark: 10 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
      {/* Left Column: Stats & Radar */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" /> 나의 탐색 능력치
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} hide />
                <Radar name="My Stats" dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{stats.score}</div>
              <div className="text-xs text-slate-500">총 점수</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-orange-500 flex justify-center items-center gap-1">
                {stats.streak} <Flame size={16} />
              </div>
              <div className="text-xs text-slate-500">현재 스트릭</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-slate-700">{stats.totalPlayed}</div>
              <div className="text-xs text-slate-500">푼 문제</div>
            </div>
          </div>
        </div>

        {/* Misconception Alert */}
        {(stats.misconceptions.ignoreSorting > 2 || stats.misconceptions.alwaysFast > 2) && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3 items-start">
             <AlertCircle className="text-red-500 shrink-0 mt-1" />
             <div>
               <h3 className="font-bold text-red-800 text-sm">오개념 주의보!</h3>
               <p className="text-xs text-red-600 mt-1">
                 "정렬되지 않은 데이터"에서 이진 탐색을 시도하는 실수가 잦습니다. 탐색 전에 데이터가 정렬되어 있는지 반드시 확인하세요!
               </p>
             </div>
          </div>
        )}
      </div>

      {/* Right Column: Badges & History */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">획득 배지</h2>
          <div className="grid grid-cols-2 gap-3">
            {BADGES.map((badge) => {
              const isUnlocked = badge.condition(stats);
              return (
                <div 
                  key={badge.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    isUnlocked 
                      ? 'bg-indigo-50 border-indigo-200 opacity-100' 
                      : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">{badge.name}</div>
                    <div className="text-[10px] text-slate-500">{badge.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">오답 노트 (최근 3개)</h2>
          {stats.wrongNotes.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">틀린 문제가 없습니다. 완벽해요! 🎉</p>
          ) : (
            <ul className="space-y-3">
              {stats.wrongNotes.slice(-3).reverse().map((note, idx) => (
                <li key={idx} className="text-sm bg-slate-50 p-3 rounded-lg">
                  <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded mr-2 font-bold">오답</span>
                  <span className="text-slate-700">{note.description.substring(0, 40)}...</span>
                  <p className="text-xs text-slate-500 mt-1">💡 {note.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;