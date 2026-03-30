import React, { useEffect, useState } from 'react';
import { getStats } from '../services/gamification';
import { UserStats } from '../types';
import { Flame, Medal, Target, BrainCircuit } from 'lucide-react';
import { AppView } from '../types';

interface DashboardProps {
    onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  if (!stats) return null;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 md:pb-4">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-black text-slate-900">파이프라인 조립소 <span className="text-blue-600">.</span></h1>
        <p className="text-slate-500 mt-1">지능형 에이전트 마스터가 되어보세요!</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="bg-orange-100 p-3 rounded-full mb-2">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.puzzleStreak}일</div>
          <div className="text-xs text-slate-500 font-medium">연속 학습</div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="bg-blue-100 p-3 rounded-full mb-2">
            <Medal className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.quizScore}점</div>
          <div className="text-xs text-slate-500 font-medium">최고 퀴즈 점수</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-slate-400" /> 나의 배지
        </h3>
        <div className="flex flex-wrap gap-2">
            {stats.badges.length === 0 ? (
                <p className="text-sm text-slate-400 py-4">아직 획득한 배지가 없습니다. 퍼즐과 퀴즈에 도전하세요!</p>
            ) : (
                stats.badges.map(badge => (
                    <span key={badge} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-200">
                        🏆 {badge}
                    </span>
                ))
            )}
        </div>
      </div>

      <div className="space-y-4">
        <button 
            onClick={() => onNavigate(AppView.THEORY)}
            className="w-full bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform shadow-lg shadow-slate-200"
        >
            <div className="text-left">
                <div className="font-bold text-lg">개념 학습 시작하기</div>
                <div className="text-sm text-slate-400">인식, 학습, 추론, 행동의 정의</div>
            </div>
            <BrainCircuit className="w-8 h-8 text-slate-400" />
        </button>
        
        <button 
             onClick={() => onNavigate(AppView.PUZZLE)}
             className="w-full bg-blue-600 text-white p-5 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform shadow-lg shadow-blue-200"
        >
            <div className="text-left">
                <div className="font-bold text-lg">파이프라인 퍼즐 도전</div>
                <div className="text-sm text-blue-200">초급부터 고급 시나리오까지</div>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">GO</div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
