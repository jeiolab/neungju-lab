import React from 'react';
import { Layers, GraduationCap, BrainCircuit } from 'lucide-react';

interface HeaderProps {
  currentTab: 'learn' | 'quiz';
  setTab: (tab: 'learn' | 'quiz') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setTab }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            RLE
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
            RLE Master
          </h1>
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full ml-2 hidden md:block">
            정보 교과: 자료와 정보
          </span>
        </div>

        <nav className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setTab('learn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentTab === 'learn'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers size={16} />
            실습하기
          </button>
          <button
            onClick={() => setTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentTab === 'quiz'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BrainCircuit size={16} />
            퀴즈
          </button>
        </nav>
      </div>
    </header>
  );
};