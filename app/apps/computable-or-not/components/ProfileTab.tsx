import React from 'react';
import { UserStats, RefinedProblem, ProblemCard } from '../types';
import { PROBLEM_CARDS, BADGES } from '../constants';
import { Trophy, Medal, History } from 'lucide-react';

interface ProfileTabProps {
  stats: UserStats;
  refinedProblems: RefinedProblem[];
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ stats, refinedProblems }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Header */}
      <div className="flex items-center space-x-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
          <Trophy size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">나의 기록</h2>
          <p className="text-sm text-slate-500">연속 학습 {stats.streak}일째 🔥</p>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">획득 배지</h3>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const hasBadge = stats.badges.includes(badge.id);
            return (
              <div key={badge.id} className={`flex flex-col items-center p-3 rounded-xl border ${hasBadge ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                <Medal size={24} className={`mb-2 ${hasBadge ? 'text-yellow-500' : 'text-slate-300'}`} />
                <span className="text-[10px] text-center font-bold text-slate-700">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Refined Gallery */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
            <History size={18} className="text-slate-400"/>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">내가 재정의한 문제들</h3>
        </div>
        
        {refinedProblems.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
            아직 보완한 문제가 없어요.<br/>
            '실전' 탭에서 조건부 문제를 해결해보세요!
          </div>
        ) : (
          <div className="space-y-3">
            {refinedProblems.map((rp, idx) => {
              const original = PROBLEM_CARDS.find(p => p.id === rp.originalId);
              return (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                   <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-indigo-600">{original?.title || '알 수 없는 문제'}</span>
                       <span className="text-[10px] text-slate-400">{new Date(rp.timestamp).toLocaleDateString()}</span>
                   </div>
                   <div className="space-y-2">
                       <p className="text-xs text-slate-500 line-through truncate">{original?.description}</p>
                       <div className="bg-indigo-50 p-2 rounded text-indigo-900 font-medium">
                           {rp.userRefinement}
                       </div>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
