import React from 'react';
import { UserStats } from '../types';
import { BarChart, Trophy, BookOpen, AlertCircle } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const totalScore = stats.gameHighScore + stats.quizScore;
  let level = "초보 연구원";
  if (totalScore > 100) level = "선임 연구원";
  if (totalScore > 200) level = "수석 분석가";

  return (
    <div className="w-full md:w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto shadow-sm">
      <h1 className="text-xl font-bold text-slate-800 mb-8">
        능력의 저울
      </h1>

      <div className="space-y-6">
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">My Insight Score</h3>
          <div className="text-3xl font-bold text-indigo-600 mb-1">{totalScore}</div>
          <div className="text-sm font-medium text-indigo-700">{level}</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2"><Trophy size={16}/> 게임 최고점</span>
            <span className="text-slate-900 font-bold">{stats.gameHighScore}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2"><BookOpen size={16}/> 퀴즈 점수</span>
            <span className="text-slate-900 font-bold">{stats.quizScore}</span>
          </div>
        </div>

        {stats.weakConcepts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-bold text-red-600 uppercase mb-3 flex items-center gap-2">
              <AlertCircle size={14} /> 취약 개념 분석
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(stats.weakConcepts)).map((concept, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto text-xs text-slate-500 pt-6">
        <p>미래 직업 연구소</p>
        <p>Ver 1.0.0</p>
      </div>
    </div>
  );
};

export default Dashboard;