import React from 'react';
import { LayoutDashboard, Award } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  streak: number;
  badges: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, streak, badges }) => {
  const tabs = [
    "개념 학습",
    "농장 시뮬레이션",
    "기술 원리",
    "운영 퀴즈",
    "확장 적용"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">나의 디지털 트윈 농장</h1>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight sm:hidden">디지털 농장</h1>
          </div>
          
          <div className="flex items-center space-x-4 text-sm font-medium">
             <div className="flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                 <span className="mr-1">🔥</span> {streak}일째 접속
             </div>
             <div className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                 <Award className="w-4 h-4 mr-1" /> 배지 {badges}개
             </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-1">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium transition-colors text-sm
                            ${activeTab === idx 
                                ? 'border-indigo-600 text-indigo-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;