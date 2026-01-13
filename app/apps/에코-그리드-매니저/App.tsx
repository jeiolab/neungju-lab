import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { UserState, TabId } from './types';
import TabConcepts from './components/TabConcepts';
import TabSimulation from './components/TabSimulation';
import Tab3D from './components/Tab3D';
import TabQuiz from './components/TabQuiz';
import TabDesign from './components/TabDesign';
import { LayoutDashboard, BookOpen, Layers, ClipboardCheck, PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('concepts');
  const [user, setUser] = useState<UserState>({
    xp: 120,
    level: 2,
    streak: 3,
    badges: [],
    lastPlayed: new Date().toISOString(),
    quizScore: 0
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('ecoGridUser');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('ecoGridUser', JSON.stringify(user));
  }, [user]);

  const handleScoreUpdate = (xpGain: number) => {
    setUser(prev => {
        const newXp = prev.xp + xpGain;
        const newLevel = Math.floor(newXp / 100) + 1;
        return {
            ...prev,
            xp: newXp,
            level: newLevel
        }
    });
  };

  const navItems = [
    { id: 'concepts', label: '개념', icon: <BookOpen size={20} /> },
    { id: 'simulation', label: '시뮬레이션', icon: <LayoutDashboard size={20} /> },
    { id: '3d', label: '3D 보기', icon: <Layers size={20} /> },
    { id: 'quiz', label: '퀴즈', icon: <ClipboardCheck size={20} /> },
    { id: 'design', label: '설계', icon: <PenTool size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />

      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 pb-20 md:pb-0">
            {activeTab === 'concepts' && <TabConcepts onComplete={() => setActiveTab('simulation')} />}
            {activeTab === 'simulation' && <TabSimulation onScoreUpdate={handleScoreUpdate} />}
            {activeTab === '3d' && <Tab3D />}
            {activeTab === 'quiz' && <TabQuiz onComplete={(score) => handleScoreUpdate(score * 10)} />}
            {activeTab === 'design' && <TabDesign />}
        </div>
      </main>

      {/* Bottom Navigation for Mobile / Sidebar for Desktop */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:static md:w-20 md:border-r md:border-t-0 md:h-screen md:hidden">
         {/* Rendered only on mobile, logic handled by media queries if we wanted a sidebar layout, 
             but for simplicity keeping bottom nav for mobile-first feel */}
      </nav>
      
      {/* Mobile-First Bottom Nav (actually used everywhere for this SPA style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto md:max-w-none md:justify-center md:gap-12">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabId)}
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === item.id ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    {item.icon}
                    <span className="text-[10px] font-medium mt-1">{item.label}</span>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;