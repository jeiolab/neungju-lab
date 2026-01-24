import React, { useState } from 'react';
import { GamificationBar } from './components/GamificationBar';
import { Tab1Concepts } from './components/Tab1Concepts';
import { Tab2Simulation } from './components/Tab2Simulation';
import { Tab3Cases } from './components/Tab3Cases';
import { Tab4Quiz } from './components/Tab4Quiz';
import { Tab5Wizard } from './components/Tab5Wizard';
import { BookOpen, Activity, Search, ClipboardList, PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);

  const addXp = (amount: number) => setXp(prev => prev + amount);
  
  const unlockBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges([...badges, badge]);
      // Show notification logic could go here
    }
  };

  const markTabComplete = (tabIdx: number) => {
    if (!completedTabs.includes(tabIdx)) {
      setCompletedTabs([...completedTabs, tabIdx]);
      addXp(20);
      if (tabIdx === 0) unlockBadge("기초 마스터");
      if (tabIdx === 1) unlockBadge("실험가");
    }
  };

  const tabs = [
    { name: "개념 익히기", icon: <BookOpen size={20} /> },
    { name: "센서 실험실", icon: <Activity size={20} /> },
    { name: "사례 탐구", icon: <Search size={20} /> },
    { name: "퀴즈 풀기", icon: <ClipboardList size={20} /> },
    { name: "프로젝트 설계", icon: <PenTool size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <GamificationBar xp={xp} badges={badges} streak={streak} />
      
      {/* Tab Navigation */}
      <div className="bg-white border-b border-indigo-100 shadow-sm sticky top-[73px] z-40 no-print overflow-x-auto">
        <div className="max-w-5xl mx-auto flex">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap
                ${activeTab === idx 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                  : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-50'
                }
                ${completedTabs.includes(idx) ? 'text-indigo-400' : ''}
              `}
            >
              {tab.icon}
              {tab.name}
              {completedTabs.includes(idx) && <span className="ml-1 w-2 h-2 rounded-full bg-green-400" />}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto mt-6 px-4 md:px-0">
        <div className="bg-transparent animate-fade-in">
          {activeTab === 0 && <Tab1Concepts onComplete={() => markTabComplete(0)} />}
          {activeTab === 1 && <Tab2Simulation onComplete={() => markTabComplete(1)} />}
          {activeTab === 2 && <Tab3Cases onPin={() => addXp(5)} />} 
          {/* Tab 3 gives XP for interacting, doesn't necessarily 'complete' */}
          {activeTab === 3 && (
            <Tab4Quiz 
                onComplete={(score) => {
                    addXp(score);
                    if(score >= 8) unlockBadge("퀴즈왕");
                    markTabComplete(3);
                }} 
            />
          )}
          {activeTab === 4 && <Tab5Wizard onComplete={() => {
              markTabComplete(4);
              unlockBadge("설계 마스터");
          }} />}
        </div>
      </main>
    </div>
  );
};

export default App;