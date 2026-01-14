import React from 'react';
import { UserProgress, Badge, MasteryState } from '../types';
import { BADGES, CONCEPTS } from '../constants';
import { Trophy, Flame, Star, Target, AlertCircle } from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  mastery: MasteryState;
  onNavigateToStudy: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress, mastery, onNavigateToStudy }) => {
  const knownCount = Object.values(mastery).filter(s => s === 'known').length;
  const masteryPercentage = Math.round((knownCount / CONCEPTS.length) * 100);

  // Identify weak concepts (confused or unknown)
  const weakConcepts = CONCEPTS.filter(c => mastery[c.id] === 'confused' || !mastery[c.id]).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">현재 레벨</p>
            <p className="text-xl font-bold text-slate-800">Lv.{progress.level}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">총 경험치</p>
            <p className="text-xl font-bold text-slate-800">{progress.xp} XP</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">연속 학습</p>
            <p className="text-xl font-bold text-slate-800">{progress.streak}일 째</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg text-green-600">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">개념 완성도</p>
            <p className="text-xl font-bold text-slate-800">{masteryPercentage}%</p>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Weakness & Recommendation */}
        <div className="lg:col-span-2 space-y-6">
           {/* Weakness Analysis */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <AlertCircle className="mr-2 text-rose-500" size={20} />
              취약 개념 집중 공략
            </h3>
            {weakConcepts.length > 0 ? (
              <div className="space-y-3">
                {weakConcepts.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full mr-2">
                        {mastery[c.id] === 'confused' ? '헷갈림' : '미학습'}
                      </span>
                      <span className="font-medium text-slate-700">{c.title}</span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={onNavigateToStudy}
                  className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  바로 복습하기
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <p>🎉 완벽해요! 모든 개념을 마스터했습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Badge Showcase */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">내 배지 진열장</h3>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map(badge => {
              const isUnlocked = badge.condition(progress, mastery, []); // simplified logic passing empty wrongNotes for display
              return (
                <div key={badge.id} className={`flex flex-col items-center p-2 rounded-lg text-center ${isUnlocked ? 'bg-indigo-50' : 'bg-slate-50 opacity-50'}`}>
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-medium text-slate-700 leading-tight">{badge.name}</div>
                  {!isUnlocked && <div className="mt-1 text-[10px] text-slate-400">잠김</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};