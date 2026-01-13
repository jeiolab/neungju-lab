import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabQuiz from './components/TabQuiz';
import TabRealWorld from './components/TabRealWorld';
import TabDataCleaning from './components/TabDataCleaning';
import TabDiscussion from './components/TabDiscussion';
import { GraduationCap, PlayCircle, ClipboardCheck, Globe, Eraser, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.THEORY);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    // Simple mock streak logic
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
        localStorage.setItem('lastVisit', today);
        const savedStreak = parseInt(localStorage.getItem('streak') || '0');
        const newStreak = savedStreak + 1;
        localStorage.setItem('streak', newStreak.toString());
        setStreak(newStreak);
    } else {
        setStreak(parseInt(localStorage.getItem('streak') || '1'));
    }
  }, []);

  const navItems = [
    { id: AppTab.THEORY, label: '이론 학습', icon: <GraduationCap size={18} /> },
    { id: AppTab.SIMULATION, label: '모델 훈련', icon: <PlayCircle size={18} /> },
    { id: AppTab.CLEANING, label: '데이터 클리닝', icon: <Eraser size={18} /> },
    { id: AppTab.REAL_WORLD, label: '실생활 예시', icon: <Globe size={18} /> },
    { id: AppTab.QUIZ, label: '퀴즈', icon: <ClipboardCheck size={18} /> },
    { id: AppTab.DISCUSSION, label: '토론하기', icon: <MessageCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">선생님: 정답을 알려줘</h1>
          </div>
          
          <div className="flex items-center gap-4">
             {streak >= 3 && (
                 <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                     🔥 성실한 트레이너 ({streak}일째)
                 </span>
             )}
          </div>
        </div>
        
        {/* Navigation - Scrollable on mobile */}
        <div className="border-t border-gray-100 overflow-x-auto no-scrollbar">
          <nav className="max-w-7xl mx-auto px-4 flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative
                  ${activeTab === item.id 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                {item.icon}
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
            {activeTab === AppTab.THEORY && <TabTheory />}
            {activeTab === AppTab.SIMULATION && <TabSimulation />}
            {activeTab === AppTab.CLEANING && <TabDataCleaning />}
            {activeTab === AppTab.REAL_WORLD && <TabRealWorld />}
            {activeTab === AppTab.QUIZ && <TabQuiz />}
            {activeTab === AppTab.DISCUSSION && <TabDiscussion />}
        </div>
      </main>
    </div>
  );
};

export default App;