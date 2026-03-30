import React, { useState, useEffect } from 'react';
import { loadState, saveState, updateMastery } from './services/storage';
import { UserState } from './types';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import NetworkMapTab from './components/NetworkMapTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';

// Tabs definition
const TABS = [
  { id: 'concept', label: '📖 개념 학습', icon: '📚' },
  { id: 'sim', label: '🧪 실험실', icon: '⚗️' },
  { id: 'map', label: '🏗️ 네트워크 지도', icon: '🗺️' },
  { id: 'quiz', label: '✍️ 퀴즈', icon: '💯' },
  { id: 'think', label: '🤔 생각하기', icon: '💭' },
];

function App() {
  const [activeTab, setActiveTab] = useState('concept');
  const [userState, setUserState] = useState<UserState>(loadState());
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    // Save state whenever it changes
    saveState(userState);
  }, [userState]);

  // Check for level up
  useEffect(() => {
    const calculatedLevel = Math.floor(userState.totalScore / 100) + 1;
    if (calculatedLevel > userState.level) {
      setUserState(prev => ({ ...prev, level: calculatedLevel }));
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [userState.totalScore, userState.level]);

  const handleUpdateMastery = (id: string, delta: number) => {
    setUserState(prev => updateMastery(prev, id, delta));
  };

  const handleUpdateState = (newState: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...newState }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Level Up Notification */}
      {showLevelUp && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in">
          <div className="bg-yellow-400 text-yellow-900 px-8 py-6 rounded-3xl shadow-2xl border-4 border-yellow-200 text-center">
             <div className="text-5xl mb-2">🎉</div>
             <h2 className="text-2xl font-black uppercase tracking-wider">Level Up!</h2>
             <p className="font-bold mt-1">Lv. {userState.level} 달성</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg text-lg">🌐</span>
            <h1 className="font-bold text-lg md:text-xl tracking-tight text-slate-800">네트워크 마스터리</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-slate-500 font-medium">현재 레벨</span>
                <span className="font-bold text-slate-800">Lv. {userState.level}</span>
             </div>
             <div className="hidden md:block w-px h-8 bg-slate-200"></div>
             <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                <span className="text-yellow-500">⭐</span>
                <span className="font-bold text-slate-700">{userState.totalScore} P</span>
             </div>
             <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                <span className="text-orange-500">🔥</span>
                <span className="font-bold text-orange-700">{userState.streak}일</span>
             </div>
          </div>
        </div>
      </header>

      {/* Desktop Tab Navigation (Top - under header) */}
      <nav className="hidden md:block max-w-7xl mx-auto px-4 mt-6 mb-8">
        <div className="flex space-x-2 bg-slate-200/50 p-1.5 rounded-xl inline-flex">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>
      </nav>

      {/* Mobile Tab Navigation (Top - under header) */}
      <nav className="md:hidden bg-white border-b border-slate-200 px-4 py-2 z-40 shadow-sm">
        <div className="flex justify-between items-center overflow-x-auto">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <span className="text-xl mb-1">{tab.icon}</span>
                    <span className="text-[10px] font-bold">{tab.label.split(' ')[1] || tab.label}</span>
                </button>
            ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {activeTab === 'concept' && <ConceptTab userState={userState} onUpdateMastery={handleUpdateMastery} />}
        {activeTab === 'sim' && <SimulationTab userState={userState} onUpdateState={handleUpdateState} />}
        {activeTab === 'map' && <NetworkMapTab userState={userState} onUpdateState={handleUpdateState} />}
        {activeTab === 'quiz' && <QuizTab userState={userState} onUpdateState={handleUpdateState} onUpdateMastery={handleUpdateMastery} />}
        {activeTab === 'think' && <ThinkingTab userState={userState} />}
      </main>

    </div>
  );
}

export default App;
