import React from 'react';
import { Database, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onOpenQuiz: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuiz }) => {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
            <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">편의점 사장님</h1>
            <p className="text-sm text-slate-300 leading-tight mt-0.5">정형 데이터의 특성과 SQL 쿼리를 시뮬레이션하며 배우는 인터랙티브 교육 앱입니다.</p>
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