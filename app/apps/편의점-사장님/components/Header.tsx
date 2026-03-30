import React from 'react';
import { Database, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onOpenQuiz: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuiz }) => {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">데이터 타이쿤</h1>
            <p className="text-xs text-slate-400">정형 데이터 경영 시뮬레이션</p>
          </div>
        </div>
        
        <button 
          onClick={onOpenQuiz}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md group"
        >
          <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-sm">데이터 퀴즈 풀기</span>
        </button>
      </div>
    </header>
  );
};