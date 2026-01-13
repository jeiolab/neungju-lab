import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Beaker, BookOpen, BrainCircuit, LayoutDashboard, UserCheck } from 'lucide-react';
import { getStats } from '../utils/storageUtils';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const stats = getStats();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors ${
      isActive ? 'text-indigo-600 bg-indigo-50 rounded-lg' : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-5xl mx-auto border-x border-slate-200 shadow-xl">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Beaker className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-slate-800 text-lg md:text-xl tracking-tight">급식 잔반 예측 미니랩</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            <span>🔥</span>
            <span className="font-bold">{stats.streak}일</span>
          </div>
          <div className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            <span>💎</span>
            <span className="font-bold">{stats.points}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe md:max-w-5xl md:mx-auto">
        <div className="flex justify-around items-center h-16 px-2">
          <NavLink to="/" className={navClass}>
            <LayoutDashboard className="w-6 h-6 mb-1" />
            홈
          </NavLink>
          <NavLink to="/concepts" className={navClass}>
            <BookOpen className="w-6 h-6 mb-1" />
            개념
          </NavLink>
          <NavLink to="/simulation" className={navClass}>
            <Beaker className="w-6 h-6 mb-1" />
            실험실
          </NavLink>
          <NavLink to="/quiz" className={navClass}>
            <BrainCircuit className="w-6 h-6 mb-1" />
            퀴즈
          </NavLink>
          <NavLink to="/reflection" className={navClass}>
            <UserCheck className="w-6 h-6 mb-1" />
            성찰
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Layout;