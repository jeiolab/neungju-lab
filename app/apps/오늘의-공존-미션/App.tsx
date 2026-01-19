import React, { useState, useEffect } from 'react';
import { TabType, UserState } from './types';
import { getStorage, saveStorage } from './services/storageService';
import { BookOpen, Target, CheckSquare, HelpCircle, Brain, Trophy, Flame } from 'lucide-react';

import TabConcepts from './components/TabConcepts';
import TabMission from './components/TabMission';
import TabLearnMore from './components/TabLearnMore';
import TabQuiz from './components/TabQuiz';
import TabThink from './components/TabThink';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('mission');
  const [userState, setUserState] = useState<UserState>(getStorage());

  // Save state whenever it changes
  useEffect(() => {
    saveStorage(userState);
  }, [userState]);

  const renderTab = () => {
    switch (activeTab) {
      case 'concepts': return <TabConcepts />;
      case 'mission': return <TabMission userState={userState} onUpdateState={setUserState} />;
      case 'learn': return <TabLearnMore userState={userState} onUpdateState={setUserState} />;
      case 'quiz': return <TabQuiz userState={userState} onUpdateState={setUserState} />;
      case 'think': return <TabThink />;
      default: return <TabMission userState={userState} onUpdateState={setUserState} />;
    }
  };

  const NavButton = ({ id, icon, label }: { id: TabType, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center p-2 flex-1 transition-colors ${
        activeTab === id ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <div className={`mb-1 ${activeTab === id ? 'scale-110 transition-transform' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] sm:text-xs">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden border-x border-slate-200">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="font-bold text-lg text-slate-800 tracking-tight">
          오늘의 공존 미션
        </h1>
        <div className="flex gap-3 text-xs font-bold">
          <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
            <Flame size={14} fill="currentColor" /> {userState.streak}일
          </div>
          <div className="flex items-center gap-1 text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full">
            <Trophy size={14} /> {userState.totalPoints}P
          </div>
        </div>
      </header>

      {/* MAIN CONTENT Area */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
        {renderTab()}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full max-w-md flex justify-around pb-safe z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavButton id="concepts" icon={<BookOpen size={20} />} label="개념" />
        <NavButton id="mission" icon={<Target size={20} />} label="미션" />
        <NavButton id="learn" icon={<CheckSquare size={20} />} label="진단" />
        <NavButton id="quiz" icon={<HelpCircle size={20} />} label="퀴즈" />
        <NavButton id="think" icon={<Brain size={20} />} label="생각" />
      </nav>
    </div>
  );
};

export default App;