'use client';

import React, { ReactNode } from 'react';
import { Beaker } from 'lucide-react';
import { getStats } from '../utils/storageUtils';
import { LucideIcon } from 'lucide-react';

type TabType = 'home' | 'concepts' | 'simulation' | 'quiz' | 'reflection';

interface Tab {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

interface LayoutProps {
  children: ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  tabs: Tab[];
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, tabs }) => {
  const stats = getStats();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-5xl mx-auto border-x border-slate-200 shadow-xl">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        {/* Header Top */}
        <div className="px-4 py-3 flex items-center justify-between">
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
        </div>

        {/* Navigation Menu */}
        <nav className="border-t border-slate-100 overflow-x-auto no-scrollbar">
          <div className="flex px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    isActive 
                      ? 'text-indigo-600' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
