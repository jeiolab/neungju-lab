import React, { useState, useEffect } from 'react';
import TabGame from './components/TabGame';
import TabGuide from './components/TabGuide';
import TabHistory from './components/TabHistory';
import TabRanking from './components/TabRanking';
import TabDeepDive from './components/TabDeepDive';
import { GameHistoryItem, Achievement } from './types';

enum Tab {
  GUIDE = 'GUIDE',
  GAME = 'GAME',
  HISTORY = 'HISTORY',
  RANKING = 'RANKING',
  DEEPDIVE = 'DEEPDIVE',
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GAME);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [notification, setNotification] = useState<Achievement | null>(null);

  // History handler
  const handleHistoryUpdate = (item: GameHistoryItem) => {
    setHistory(prev => [...prev, item]);
  };

  // Achievement Notification
  const handleAchievement = (ach: Achievement) => {
     // Check if already unlocked locally to avoid spam (simplified)
     const unlocked = localStorage.getItem(`ach_${ach.id}`);
     if (!unlocked) {
         setNotification(ach);
         localStorage.setItem(`ach_${ach.id}`, 'true');
         setTimeout(() => setNotification(null), 3000);
     }
  };

  const renderTab = () => {
    switch (activeTab) {
      case Tab.GUIDE: return <TabGuide />;
      case Tab.GAME: return <TabGame onHistoryUpdate={handleHistoryUpdate} onAchievementUnlock={handleAchievement} />;
      case Tab.HISTORY: return <TabHistory history={history} />;
      case Tab.RANKING: return <TabRanking />;
      case Tab.DEEPDIVE: return <TabDeepDive />;
      default: return <TabGame onHistoryUpdate={handleHistoryUpdate} onAchievementUnlock={handleAchievement} />;
    }
  };

  return (
    <div className="h-screen w-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden max-w-lg mx-auto shadow-2xl relative">
      
      {/* Achievement Notification */}
      <div className={`absolute top-4 left-4 right-4 z-50 transform transition-all duration-500 ${notification ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg p-4 shadow-lg flex items-center gap-4 text-white">
              <div className="text-3xl"><i className={`fas ${notification?.icon || 'fa-trophy'}`}></i></div>
              <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-100">Achievement Unlocked</div>
                  <div className="font-bold text-lg leading-none">{notification?.title}</div>
                  <div className="text-sm opacity-90">{notification?.description}</div>
              </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative bg-slate-900">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        {renderTab()}
      </div>

      {/* Tab Navigation */}
      <nav className="h-20 bg-slate-800 border-t border-slate-700 flex justify-around items-center px-2 z-40">
        <button 
          onClick={() => setActiveTab(Tab.GUIDE)}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === Tab.GUIDE ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <i className="fas fa-book text-xl mb-1"></i>
          <span className="text-[10px] font-bold">GUIDE</span>
        </button>
        
        <button 
          onClick={() => setActiveTab(Tab.HISTORY)}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === Tab.HISTORY ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <i className="fas fa-clock-rotate-left text-xl mb-1"></i>
          <span className="text-[10px] font-bold">HISTORY</span>
        </button>

        <button 
          onClick={() => setActiveTab(Tab.GAME)}
          className={`relative -top-6 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white shadow-lg border-4 border-slate-900 transition-transform hover:scale-105 ${activeTab === Tab.GAME ? 'bg-blue-500' : 'bg-blue-700'}`}
        >
          <i className="fas fa-gamepad text-2xl"></i>
        </button>

        <button 
          onClick={() => setActiveTab(Tab.RANKING)}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === Tab.RANKING ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <i className="fas fa-trophy text-xl mb-1"></i>
          <span className="text-[10px] font-bold">RANK</span>
        </button>

        <button 
          onClick={() => setActiveTab(Tab.DEEPDIVE)}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === Tab.DEEPDIVE ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <i className="fas fa-robot text-xl mb-1"></i>
          <span className="text-[10px] font-bold">AI DIVE</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
