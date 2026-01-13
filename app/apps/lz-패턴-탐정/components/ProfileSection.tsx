import React from 'react';
import { UserProgress } from '../types';
import { BADGES } from '../constants';
import {  PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Lock, Unlock } from 'lucide-react';

interface ProfileSectionProps {
  progress: UserProgress;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ progress }) => {
  const earnedBadges = BADGES.filter(b => b.condition(progress));
  const lockedBadges = BADGES.filter(b => !b.condition(progress));

  const data = [
    { name: '해결한 퍼즐', value: progress.solvedPuzzles, color: '#4f46e5' },
    { name: '퀴즈 정답', value: Math.floor(progress.xp / 10), color: '#10b981' }, // Rough estimate
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Level</div>
          <div className="text-3xl font-black text-indigo-600">{progress.level}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total XP</div>
          <div className="text-3xl font-black text-yellow-500">{progress.xp}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Streak</div>
          <div className="text-3xl font-black text-orange-500">{progress.streak}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Badges</div>
          <div className="text-3xl font-black text-purple-500">{earnedBadges.length}/{BADGES.length}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Badges Grid */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">내 배지 보관함</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {earnedBadges.map(badge => (
              <div key={badge.id} className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="text-2xl">{badge.icon}</div>
                <div>
                  <div className="font-bold text-slate-800">{badge.name}</div>
                  <div className="text-xs text-slate-500">{badge.description}</div>
                </div>
              </div>
            ))}
            {lockedBadges.map(badge => (
              <div key={badge.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100 opacity-60 grayscale">
                <div className="p-2 bg-slate-200 rounded-lg"><Lock className="w-4 h-4 text-slate-500" /></div>
                <div>
                  <div className="font-bold text-slate-500">???</div>
                  <div className="text-xs text-slate-400">조건을 달성하여 잠금해제</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center justify-center">
           <h3 className="text-xl font-bold text-slate-800 mb-2">활동 분석</h3>
           <div className="w-full h-64 flex justify-center">
             <PieChart width={200} height={200}>
               <Pie
                 data={data}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={80}
                 paddingAngle={5}
                 dataKey="value"
               >
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Pie>
               <Tooltip />
             </PieChart>
           </div>
           <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-slate-600">퍼즐</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">퀴즈</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;