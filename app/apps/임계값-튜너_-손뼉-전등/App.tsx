import React, { useState, useEffect } from 'react';
import { Brain, Sliders, BookOpen, PenTool, Layout, Award, Flame } from 'lucide-react';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import InfoTab from './components/InfoTab';
import * as storageService from './services/storageService';
import { BADGES } from './constants';
import { Badge } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concept' | 'simulation' | 'quiz' | 'reflection' | 'info'>('concept');
  const [badges, setBadges] = useState<Badge[]>([]);
  const [streakUpdated, setStreakUpdated] = useState(false);

  useEffect(() => {
    // Initialize badges if empty
    const savedBadges = storageService.getBadges();
    if (!savedBadges) {
        storageService.saveBadges(BADGES);
        setBadges(BADGES);
    } else {
        setBadges(savedBadges);
    }
  }, []);

  const handleBadgeCheck = () => {
      const currentBadges = [...badges];
      let updated = false;
      
      // Zero Malfunction Badge Logic
      const zeroMalfunctionBadge = currentBadges.find(b => b.id === 'zero_malfunction');
      if (zeroMalfunctionBadge && !zeroMalfunctionBadge.earned) {
          zeroMalfunctionBadge.earned = true;
          updated = true;
          alert(`🎉 배지 획득: ${zeroMalfunctionBadge.name}!`);
      }
      
      if (updated) {
          setBadges(currentBadges);
          storageService.saveBadges(currentBadges);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Layout className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">임계값 튜너: <span className="text-indigo-600">손뼉 전등</span></h1>
            <h1 className="text-xl font-bold text-slate-800 sm:hidden">손뼉 전등 튜너</h1>
          </div>

          <div className="flex items-center gap-4">
             {/* Gamification Items */}
             <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                 <Flame size={14} /> 
                 <span>Daily Streak</span>
             </div>
             
             <div className="flex gap-1">
                 {badges.map(badge => (
                     <div key={badge.id} title={badge.name} className={`p-1.5 rounded-full ${badge.earned ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-300'}`}>
                         <Award size={18} />
                     </div>
                 ))}
             </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex gap-6 min-w-max">
            {[
                { id: 'concept', label: '개념 학습', icon: Brain },
                { id: 'simulation', label: '시뮬레이션', icon: Sliders },
                { id: 'info', label: '더 알아보기', icon: BookOpen },
                { id: 'quiz', label: '퀴즈', icon: Layout }, // Using generic icon for quiz
                { id: 'reflection', label: '반례/설계', icon: PenTool },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors text-sm font-medium ${
                        activeTab === tab.id 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {activeTab === 'concept' && <ConceptTab />}
        {activeTab === 'simulation' && <SimulationTab onBadgeUpdate={handleBadgeCheck} />}
        {activeTab === 'info' && <InfoTab />}
        {activeTab === 'quiz' && <QuizTab />}
        {activeTab === 'reflection' && <ReflectionTab />}
      </main>
    </div>
  );
};

export default App;