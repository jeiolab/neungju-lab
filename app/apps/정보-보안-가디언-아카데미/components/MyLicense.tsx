import React from 'react';
import { UserState, LEVELS, ModuleType } from '../types';
import { MODULE_INFO } from '../constants';
import { Award, Shield, Star, Lock } from 'lucide-react';

interface Props {
  userState: UserState;
}

const MyLicense: React.FC<Props> = ({ userState }) => {
  const currentLevelInfo = LEVELS.slice().reverse().find(l => userState.totalScore >= l.minScore) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.minScore > userState.totalScore);
  const progressToNext = nextLevel 
    ? ((userState.totalScore - currentLevelInfo.minScore) / (nextLevel.minScore - currentLevelInfo.minScore)) * 100 
    : 100;

  return (
    <div className="space-y-8">
      {/* ID Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-700 rounded-xl border-2 border-slate-500 flex items-center justify-center shadow-inner">
             <Shield className="w-12 h-12 md:w-16 md:h-16 text-slate-400" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                 <h2 className="text-2xl md:text-3xl font-black tracking-tight">{currentLevelInfo.name}</h2>
                 <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-slate-400 text-sm">정보 보안 가디언 아카데미 소속</p>
            </div>
            
            {/* XP Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>TOTAL SCORE: {userState.totalScore}</span>
                {nextLevel && <span>NEXT: {nextLevel.name} ({nextLevel.minScore})</span>}
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-700" 
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Mastery & Badges */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" /> 훈련 숙련도
          </h3>
          <div className="space-y-4">
            {Object.entries(MODULE_INFO).map(([key, info]) => {
              const mastery = userState.moduleMastery[key as ModuleType] || 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{info.title}</span>
                    <span className="font-bold text-blue-600">{Math.min(mastery, 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${mastery >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(mastery, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" /> 보유 뱃지
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(MODULE_INFO).map((key) => {
              const isUnlocked = userState.badges.includes(key as ModuleType);
              return (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${
                    isUnlocked 
                      ? 'bg-gradient-to-tr from-yellow-300 to-yellow-500 border-yellow-200 shadow-lg scale-100' 
                      : 'bg-slate-100 border-slate-200 opacity-50 grayscale scale-95'
                  }`}>
                    {isUnlocked ? <Award className="w-8 h-8 text-white" /> : <Lock className="w-6 h-6 text-slate-400" />}
                  </div>
                  <span className={`text-xs text-center font-bold ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                    {isUnlocked ? MODULE_INFO[key as ModuleType].title.split(' ')[0] : '???'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLicense;