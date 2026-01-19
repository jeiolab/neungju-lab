import React from 'react';
import { UserState, Concept } from '../types';
import { calculateMasteryColor, SAMPLE_BADGES } from '../utils';
import ConceptCard from './ConceptCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface Props {
  userState: UserState;
  dailyConcepts: Concept[];
}

const Dashboard: React.FC<Props> = ({ userState, dailyConcepts }) => {
  const masteryData = Object.entries(userState.mastery).map(([name, score]) => ({ name, score }));

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Streak</div>
          <div className="text-3xl font-black text-indigo-600">{userState.streak} <span className="text-sm font-normal text-slate-400">days</span></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Total Score</div>
          <div className="text-3xl font-black text-indigo-600">{userState.points}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Badges</div>
          <div className="text-3xl font-black text-indigo-600">{userState.badges.length}</div>
        </div>
      </div>

      {/* Badges */}
      {userState.badges.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">🏆 획득한 배지</h3>
          <div className="flex flex-wrap gap-4">
            {SAMPLE_BADGES.filter(b => userState.badges.includes(b.id)).map(badge => (
              <div key={badge.id} className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-bold text-sm text-yellow-900">{badge.name}</div>
                  <div className="text-xs text-yellow-700">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concepts */}
      {dailyConcepts.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-800 mb-4 px-1">💡 오늘의 핵심 개념</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dailyConcepts.map((c, i) => (
              <ConceptCard key={i} concept={c} />
            ))}
          </div>
        </div>
      )}

      {/* Mastery Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-6">📊 나의 학습 마스터리</h3>
        <div className="h-64 w-full">
           {masteryData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={masteryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                 <XAxis type="number" domain={[0, 100]} hide />
                 <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="score" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           ) : (
             <div className="h-full flex items-center justify-center text-slate-400 text-sm">
               아직 학습 데이터가 충분하지 않습니다. 미션과 퀴즈를 진행해보세요!
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
