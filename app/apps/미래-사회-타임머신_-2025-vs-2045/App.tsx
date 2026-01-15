import React, { useState } from 'react';
import TimelineGameTab from './components/TimelineGameTab';
import FeaturesTab from './components/FeaturesTab';
import SectorFuturesTab from './components/SectorFuturesTab';
import PredictionQuizTab from './components/PredictionQuizTab';
import FutureDiaryTab from './components/FutureDiaryTab';
import { LayoutDashboard, Gamepad2, Layers, BookOpen, PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const tabs = [
    { id: 0, label: '3대 특징', icon: LayoutDashboard, component: <FeaturesTab /> },
    { id: 1, label: '타임라인', icon: Gamepad2, component: <TimelineGameTab /> },
    { id: 2, label: '분야별 미래', icon: Layers, component: <SectorFuturesTab /> },
    { id: 3, label: '예측 퀴즈', icon: BookOpen, component: <PredictionQuizTab /> },
    { id: 4, label: '미래 일기', icon: PenTool, component: <FutureDiaryTab /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              FT
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">미래 사회 타임머신</h1>
          </div>
          <div className="text-xs text-slate-400 border border-slate-700 rounded-full px-2 py-1">
            2025 vs 2045
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-3xl mx-auto min-h-screen">
        <div className="animate-fade-in">
          {tabs[activeTab].component}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 pb-safe">
        <div className="max-w-3xl mx-auto flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {isActive && <div className="absolute top-0 w-8 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Safe area padding for bottom nav */}
      <div className="h-16" />
    </div>
  );
};

export default App;