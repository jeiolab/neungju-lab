import React, { useState } from 'react';
import Header from './components/Header';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import ExploreTab from './components/ExploreTab';
import ThinkingTab from './components/ThinkingTab';
import { UserStats } from './types';
import { BookOpen, Gamepad2, Globe, Brain, CheckSquare, Layout, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'quiz' | 'explore' | 'think'>('theory');
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 1, // Mock data for demo
    masteredCards: [],
    wrongQuestionIds: []
  });

  // --- Logic ---
  const handleCardResult = (id: string, success: boolean) => {
    setStats(prev => {
      let newXp = prev.xp;
      let newMastered = [...prev.masteredCards];

      if (success) {
        newXp += 10;
        if (!newMastered.includes(id)) {
          newMastered.push(id);
        }
      } else {
        newMastered = newMastered.filter(cid => cid !== id);
      }

      let newLevel = 1;
      if (newXp >= 300) newLevel = 3;
      else if (newXp >= 100) newLevel = 2;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        masteredCards: newMastered
      };
    });
  };

  const handleSimComplete = () => {
    setStats(prev => ({
      ...prev,
      xp: prev.xp + 20
    }));
  };

  const handleQuizComplete = (score: number, wrongIds: string[]) => {
    setStats(prev => {
      const newWrongIds = Array.from(new Set([...prev.wrongQuestionIds, ...wrongIds]));
      const newXp = prev.xp + (score * 5);
      let newLevel = 1;
      if (newXp >= 300) newLevel = 3;
      else if (newXp >= 100) newLevel = 2;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        wrongQuestionIds: newWrongIds
      };
    });
    alert(`퀴즈 완료! ${score * 5} XP 획득!`);
  };

  const navItems = [
    { id: 'theory', label: '개념 학습', icon: BookOpen },
    { id: 'sim', label: '시뮬레이션', icon: Gamepad2 },
    { id: 'explore', label: '더 알아보기', icon: Globe },
    { id: 'quiz', label: '실전 퀴즈', icon: CheckSquare },
    { id: 'think', label: '생각해보기', icon: Brain },
  ] as const;

  // --- Render ---
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-gray-100">
          <Layout className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">NetMaster</h1>
            <p className="text-xs text-gray-500">네트워크 완전 정복</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-sm ring-1 ring-blue-100' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
           <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
             <p className="text-xs font-medium opacity-80 mb-1">현재 레벨</p>
             <p className="font-bold text-lg">{stats.level === 1 ? '네트워크 초보' : stats.level === 2 ? 'LAN 마스터' : '통신 전문가'}</p>
             <div className="mt-3 text-xs opacity-90 flex justify-between">
               <span>다음 레벨까지</span>
               <span>{stats.level === 1 ? 100 - stats.xp : stats.level === 2 ? 300 - stats.xp : 0} XP</span>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <Header stats={stats} />
        
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex flex-col">
             {activeTab === 'theory' && <TheoryTab masteredIds={stats.masteredCards} onCardResult={handleCardResult} />}
             {activeTab === 'sim' && <SimulationTab onComplete={handleSimComplete} />}
             {activeTab === 'quiz' && <QuizTab stats={stats} onQuizComplete={handleQuizComplete} />}
             {activeTab === 'explore' && <ExploreTab />}
             {activeTab === 'think' && <ThinkingTab />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;