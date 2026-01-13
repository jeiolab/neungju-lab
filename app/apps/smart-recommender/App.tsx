import React, { useState, useEffect, useMemo } from 'react';
import { AppTab, Receipt, ITEMS } from './types';
import { SimulationTab } from './components/SimulationTab';
import { TheoryTab } from './components/TheoryTab';
import { QuizTab } from './components/QuizTab';
import { AdvancedTab } from './components/AdvancedTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.THEORY);
  const [hasBadge, setHasBadge] = useState(false);
  const [dailySeed, setDailySeed] = useState(0);

  // Generate Daily Receipts based on a seed
  const receipts = useMemo(() => {
    // Determine seed from date to simulate "Daily Mission"
    const today = new Date();
    const seedStr = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
    const seed = parseInt(seedStr);
    
    // Pseudo-random generator
    const random = (seed: number) => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const data: Receipt[] = [];
    // Generating 10 receipts with some hidden patterns
    // Patterns to embed: Bread+Milk, Diapers+Beer, Eggs+Butter+Bread
    
    for (let i = 0; i < 10; i++) {
      const items = new Set<string>();
      const r = random(seed + i);
      
      // Pattern 1: Bread & Milk (High probability)
      if (r > 0.3) {
        items.add('bread');
        items.add('milk');
      }

      // Pattern 2: Diapers & Beer (Medium probability)
      if (random(seed + i + 100) > 0.5) {
        items.add('diapers');
        items.add('beer');
      }

      // Pattern 3: Breakfast (Eggs, Butter)
      if (random(seed + i + 200) > 0.6) {
        items.add('eggs');
        items.add('butter');
        if (!items.has('bread')) items.add('bread');
      }

      // Noise items
      if (random(seed + i + 300) > 0.7) items.add('cola');
      
      // Ensure at least 2 items
      while(items.size < 2) {
          items.add(ITEMS[Math.floor(random(seed + i + items.size * 50) * ITEMS.length)].id);
      }

      data.push({
        id: i + 1,
        items: Array.from(items),
      });
    }
    return data;
  }, []);

  const handleBadgeEarned = () => {
    if (!hasBadge) {
      setHasBadge(true);
      // Could add a confetti effect here
    }
  };

  const tabs = [
    { id: AppTab.THEORY, label: '추천의 원리', icon: '📚' },
    { id: AppTab.SIMULATION, label: '시뮬레이션 (Game)', icon: '🎮' },
    { id: AppTab.QUIZ, label: '퀴즈', icon: '📝' },
    { id: AppTab.ADVANCED, label: '더 알아보기', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
                <span className="text-2xl">🤖</span>
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">Smart-Recommender</h1>
                <p className="text-xs text-slate-500 mt-1">AI 추천 알고리즘 제작소</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {hasBadge && (
                <div className="animate-pulse-slow flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full border border-yellow-200 shadow-sm">
                    <span>🏆</span>
                    <span className="text-xs font-bold">알고리즘 마스터</span>
                </div>
             )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="border-t border-slate-100 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <nav className="flex space-x-6 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                        flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                        ${
                            activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }
                        `}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                    ))}
                </nav>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto h-full">
          {activeTab === AppTab.THEORY && <TheoryTab />}
          {activeTab === AppTab.SIMULATION && (
            <div className="h-[600px]">
                <SimulationTab receipts={receipts} onBadgeEarned={handleBadgeEarned} />
            </div>
          )}
          {activeTab === AppTab.QUIZ && <QuizTab />}
          {activeTab === AppTab.ADVANCED && <AdvancedTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 Smart-Recommender Edu. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;