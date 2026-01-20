import React, { useState } from 'react';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabPuzzle from './components/TabPuzzle';
import TabQuiz from './components/TabQuiz';
import TabMoreInfo from './components/TabMoreInfo';
import { BookOpen, PlayCircle, Gamepad2, GraduationCap, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'puzzle' | 'quiz' | 'info'>('theory');

  const tabs = [
    { id: 'theory', label: '개념 배우기', icon: BookOpen },
    { id: 'sim', label: '시뮬레이션', icon: PlayCircle },
    { id: 'puzzle', label: '보물찾기 퍼즐', icon: Gamepad2 },
    { id: 'quiz', label: '퀴즈 & 확인', icon: GraduationCap },
    { id: 'info', label: '더 알아보기', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white pb-20">
      {/* Header */}
      <header className="bg-ocean text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-display flex items-center gap-2">
            🏝️ 보물섬 탐험대 <span className="text-sm md:text-lg opacity-90 font-sans font-normal hidden md:inline">| 그래프 탐색의 기초</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto mt-6 p-4">
        {activeTab === 'theory' && <TabTheory />}
        {activeTab === 'sim' && <TabSimulation />}
        {activeTab === 'puzzle' && <TabPuzzle />}
        {activeTab === 'quiz' && <TabQuiz />}
        {activeTab === 'info' && <TabMoreInfo />}
      </main>

      {/* Bottom Navigation for Mobile / Tab Bar for Desktop */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 z-50 safe-area-pb">
        <div className="max-w-4xl mx-auto flex justify-around p-2">
          {tabs.map((tab) => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 min-w-[60px] md:w-24 ${
                   isActive ? 'text-ocean -translate-y-2 bg-white shadow-lg border border-gray-100' : 'text-gray-400 hover:text-gray-600'
                 }`}
               >
                 <Icon size={isActive ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
                 <span className={`text-[10px] md:text-xs font-bold mt-1 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                   {tab.label}
                 </span>
               </button>
             );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;