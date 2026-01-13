import React, { useState } from 'react';
import { TabId } from './types';
import TheoryTab from './components/TheoryTab';
import GameTab from './components/GameTab';
import JobTab from './components/JobTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import EncyclopediaModal from './components/EncyclopediaModal';
import { BookOpen, Play, Briefcase, HelpCircle, MessageSquare, Grid } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.THEORY);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);

  const handleUnlockItem = (itemId: string) => {
    setUnlockedItems((prev) => {
      if (prev.includes(itemId)) return prev;
      return [...prev, itemId];
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TabId.THEORY: return <TheoryTab />;
      case TabId.GAME: return <GameTab onUnlockItem={handleUnlockItem} />;
      case TabId.JOBS: return <JobTab />;
      case TabId.QUIZ: return <QuizTab />;
      case TabId.REFLECTION: return <ReflectionTab />;
      default: return <TheoryTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md text-white">
              <span className="text-xl">🕰️</span>
            </div>
            <div>
               <h1 className="text-xl font-bold text-slate-900 leading-none">시간여행자의 IoT 도감</h1>
               <p className="text-xs text-cyan-600 font-medium mt-1">과거 vs 미래 기술 판별기</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowEncyclopedia(true)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 group"
          >
            <Grid size={18} className="text-slate-500 group-hover:text-cyan-600" />
            <span className="text-sm font-medium hidden sm:inline text-slate-600">도감 보기</span>
            {unlockedItems.length > 0 && (
                <span className="bg-cyan-500 text-white text-xs font-bold px-1.5 rounded-full">
                    {unlockedItems.length}
                </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto h-full">
            {renderTabContent()}
        </div>
      </main>

      {/* Navigation Tabs (Bottom Sticky) */}
      <nav className="bg-white border-t border-slate-200 shrink-0 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex justify-between md:justify-around px-2 py-2">
          <TabButton 
            active={activeTab === TabId.THEORY} 
            onClick={() => setActiveTab(TabId.THEORY)} 
            icon={<BookOpen size={20} />} 
            label="이론" 
          />
          <TabButton 
            active={activeTab === TabId.GAME} 
            onClick={() => setActiveTab(TabId.GAME)} 
            icon={<Play size={20} />} 
            label="게임" 
          />
          <TabButton 
            active={activeTab === TabId.JOBS} 
            onClick={() => setActiveTab(TabId.JOBS)} 
            icon={<Briefcase size={20} />} 
            label="직업" 
          />
          <TabButton 
            active={activeTab === TabId.QUIZ} 
            onClick={() => setActiveTab(TabId.QUIZ)} 
            icon={<HelpCircle size={20} />} 
            label="퀴즈" 
          />
          <TabButton 
            active={activeTab === TabId.REFLECTION} 
            onClick={() => setActiveTab(TabId.REFLECTION)} 
            icon={<MessageSquare size={20} />} 
            label="토론" 
          />
        </div>
      </nav>

      {/* Modals */}
      {showEncyclopedia && (
        <EncyclopediaModal unlockedIds={unlockedItems} onClose={() => setShowEncyclopedia(false)} />
      )}
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[64px] ${
      active ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
    }`}
  >
    <div className={`mb-1 transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
        {icon}
    </div>
    <span className="text-[10px] md:text-xs font-medium">{label}</span>
  </button>
);

export default App;