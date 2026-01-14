import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, BookOpen, Calculator, Brain, PenTool } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: '홈', icon: LayoutDashboard },
    { id: 'theory', label: '학습', icon: BookOpen },
    { id: 'simulation', label: '시뮬레이션', icon: Calculator },
    { id: 'quiz', label: '퀴즈', icon: Brain },
    { id: 'reflection', label: '생각하기', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-600 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="font-bold text-lg">마이데이터 딜레마</h1>
      </div>

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <nav className="
        fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around p-2
        md:relative md:w-64 md:flex-col md:justify-start md:border-t-0 md:border-r md:h-screen md:p-6 md:bg-white
      ">
        <div className="hidden md:block mb-8">
          <h1 className="text-2xl font-bold text-indigo-600">마이데이터<br/>딜레마</h1>
          <p className="text-xs text-slate-500 mt-2">이득 vs 위험, 당신의 선택은?</p>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`
                flex flex-col items-center p-2 rounded-lg transition-colors
                md:flex-row md:mb-2 md:p-3 md:w-full
                ${isActive ? 'text-indigo-600 bg-indigo-50 md:bg-indigo-50' : 'text-slate-500 hover:bg-slate-100'}
              `}
            >
              <Icon size={24} className="mb-1 md:mb-0 md:mr-3" />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;