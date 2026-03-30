import React, { useState, useEffect } from 'react';
import { FlaskConical, BookOpen, PlayCircle, Layers, CheckSquare, BrainCircuit } from 'lucide-react';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';
import { SimulationResult, UserData } from './types';
import { INITIAL_BADGES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'THEORY' | 'SIM' | 'DEEP' | 'QUIZ' | 'THINK'>('SIM');
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('commuteLabUser');
    return saved ? JSON.parse(saved) : {
      badges: INITIAL_BADGES,
      streak: 0,
      lastLogin: new Date().toISOString(),
      mastery: { modeling: 0, tradeoff: 0 },
      wrongNotes: []
    };
  });

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('commuteLabUser', JSON.stringify(userData));
  }, [userData]);

  const handleSimulationComplete = (result: SimulationResult) => {
    // Check for Badge Unlocks
    const newBadges = [...userData.badges];
    let badgeUnlocked = false;

    // Badge: Balance Master
    if (result.timeScore >= 70 && result.costScore >= 70 && result.envScore >= 70 && !result.isLate) {
      const badgeIndex = newBadges.findIndex(b => b.id === 'balance_master');
      if (badgeIndex !== -1 && !newBadges[badgeIndex].unlocked) {
        newBadges[badgeIndex].unlocked = true;
        badgeUnlocked = true;
        showNotification(`🎉 배지 획득: ${newBadges[badgeIndex].name}`);
      }
    }

    // Badge: Eco Sprinter
    if (result.carbonEmissions <= 3 && !result.isLate) { // Carbon 10-score -> emissions low
        const badgeIndex = newBadges.findIndex(b => b.id === 'eco_sprinter');
        if (badgeIndex !== -1 && !newBadges[badgeIndex].unlocked) {
          newBadges[badgeIndex].unlocked = true;
          badgeUnlocked = true;
          showNotification(`🎉 배지 획득: ${newBadges[badgeIndex].name}`);
        }
    }

    if (badgeUnlocked) {
      setUserData(prev => ({ ...prev, badges: newBadges }));
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'THEORY': return <TheoryTab />;
      case 'SIM': return <SimulationTab onSimulationComplete={handleSimulationComplete} />;
      case 'DEEP': return <DeepDiveTab />;
      case 'QUIZ': return <QuizTab />;
      case 'THINK': return <ThinkingTab />;
      default: return <SimulationTab onSimulationComplete={handleSimulationComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FlaskConical className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              등교 최적화 트레이드오프 랩
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
             <div className="hidden md:flex gap-2">
               {userData.badges.filter(b => b.unlocked).map(b => (
                 <span key={b.id} title={b.name} className="cursor-help text-lg bg-slate-100 p-1 rounded hover:bg-slate-200 transition">
                   {b.icon}
                 </span>
               ))}
             </div>
             <div className="font-mono text-slate-500">
                실험실 모드
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'THEORY', label: '1. 이론 개념', icon: BookOpen },
            { id: 'SIM', label: '2. 시뮬레이션', icon: PlayCircle },
            { id: 'DEEP', label: '3. 더 알아보기', icon: Layers },
            { id: 'QUIZ', label: '4. 퀴즈', icon: CheckSquare },
            { id: 'THINK', label: '5. 생각해보기', icon: BrainCircuit },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[500px]">
          {renderTabContent()}
        </div>
      </main>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          {notification}
        </div>
      )}
    </div>
  );
};

export default App;