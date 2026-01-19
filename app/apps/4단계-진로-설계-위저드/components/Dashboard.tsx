import React from 'react';
import { UserProgress, AppView } from '../types';

interface DashboardProps {
  progress: UserProgress;
  onChangeView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress, onChangeView }) => {
  const progressPercent = (progress.completedSteps.length / 4) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">👋 환영합니다, 미래의 꿈나무님!</h1>
        <p className="text-blue-100 mb-4">오늘도 진로 목표를 향해 한 걸음 더 나아가 볼까요?</p>
        
        <div className="flex items-center space-x-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div>
            <span className="block text-xs text-blue-200">LEVEL</span>
            <span className="text-2xl font-bold">{progress.level}</span>
          </div>
          <div>
            <span className="block text-xs text-blue-200">XP</span>
            <span className="text-2xl font-bold">{progress.xp}</span>
          </div>
          <div>
            <span className="block text-xs text-blue-200">STREAK</span>
            <span className="text-2xl font-bold">🔥 {progress.streak}일</span>
          </div>
          <div className="flex-1">
             <div className="flex justify-between text-xs mb-1">
               <span>위저드 진행률</span>
               <span>{Math.round(progressPercent)}%</span>
             </div>
             <div className="w-full bg-blue-900/30 rounded-full h-2.5">
               <div className="bg-green-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Action Card */}
        <button 
          onClick={() => onChangeView(AppView.WIZARD)}
          className="col-span-1 md:col-span-2 group bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left flex justify-between items-center"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">🚀 진로 설계 위저드 시작하기</h2>
            <p className="text-slate-500 text-sm">4단계로 완성하는 나만의 커리어 로드맵</p>
          </div>
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            ➜
          </div>
        </button>

        {/* Secondary Cards */}
        <button onClick={() => onChangeView(AppView.THEORY)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
          <div className="text-2xl mb-2">📚</div>
          <h3 className="font-bold text-slate-800">이론 개념 학습</h3>
          <p className="text-xs text-slate-500 mt-1">진로 설계의 기초 다지기</p>
        </button>
        
        <button onClick={() => onChangeView(AppView.QUIZ)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
          <div className="text-2xl mb-2">📝</div>
          <h3 className="font-bold text-slate-800">확인 퀴즈</h3>
          <p className="text-xs text-slate-500 mt-1">나의 지식 점검하기</p>
        </button>

        <button onClick={() => onChangeView(AppView.SIMULATION)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
          <div className="text-2xl mb-2">🧪</div>
          <h3 className="font-bold text-slate-800">시뮬레이션</h3>
          <p className="text-xs text-slate-500 mt-1">계획 변경 실험실</p>
        </button>

        <button onClick={() => onChangeView(AppView.REPORT)} className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-all text-left">
          <div className="text-2xl mb-2">📑</div>
          <h3 className="font-bold text-emerald-800">최종 리포트</h3>
          <p className="text-xs text-emerald-600 mt-1">수행평가 제출용 산출물</p>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">🏆 나의 획득 배지</h3>
        <div className="flex gap-3 flex-wrap">
          {progress.badges.length === 0 && <span className="text-sm text-slate-400">아직 획득한 배지가 없습니다.</span>}
          {progress.badges.includes('completed_wizard') && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-bold border border-yellow-200">✨ 설계 마스터</span>
          )}
          {progress.badges.includes('quiz_whiz') && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-bold border border-purple-200">🧠 퀴즈 천재</span>
          )}
           {progress.badges.includes('info_master') && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold border border-blue-200">🔍 정보 탐색가</span>
          )}
        </div>
      </div>
    </div>
  );
};
