import React, { useState } from 'react';
import { BookOpen, Gamepad2, Lightbulb, CheckSquare, MessageSquare, Search } from 'lucide-react';
import { Tab } from './types';
import ConceptTab from './components/ConceptTab';
import GameTab from './components/GameTab';
import LearnMoreTab from './components/LearnMoreTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('concept');
  const [globalBadges, setGlobalBadges] = useState<string[]>([]);

  const unlockBadge = (badge: string) => {
    if (!globalBadges.includes(badge)) {
      setGlobalBadges((prev) => [...prev, badge]);
      // Simple notification could go here
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'concept':
        return <ConceptTab changeTab={setActiveTab} />;
      case 'game':
        return <GameTab unlockBadge={unlockBadge} />;
      case 'learn':
        return <LearnMoreTab />;
      case 'quiz':
        return <QuizTab />;
      case 'reflection':
        return <ReflectionTab />;
      default:
        return <ConceptTab changeTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header with Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-indigo-600">이상치 탐정</h1>
                <p className="text-xs text-slate-500">Anomaly Detective: 이 점... 튀었는데?</p>
              </div>
            </div>
            
            {/* Badge Display Area */}
            <div className="hidden md:flex space-x-2">
              {globalBadges.map((badge, idx) => (
                <span key={idx} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-200 flex items-center">
                  🏆 {badge}
                </span>
              ))}
              {globalBadges.length === 0 && (
                <span className="text-xs text-slate-400 italic">배지를 획득해보세요!</span>
              )}
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="border-t border-slate-200">
            <div className="flex justify-around items-center py-2">
              <NavButton 
                active={activeTab === 'concept'} 
                onClick={() => setActiveTab('concept')} 
                icon={<BookOpen size={20} />} 
                label="개념 본부" 
              />
              <NavButton 
                active={activeTab === 'game'} 
                onClick={() => setActiveTab('game')} 
                icon={<Gamepad2 size={20} />} 
                label="실전 수사" 
              />
              <NavButton 
                active={activeTab === 'learn'} 
                onClick={() => setActiveTab('learn')} 
                icon={<Lightbulb size={20} />} 
                label="심화 사건" 
              />
              <NavButton 
                active={activeTab === 'quiz'} 
                onClick={() => setActiveTab('quiz')} 
                icon={<CheckSquare size={20} />} 
                label="자격 시험" 
              />
              <NavButton 
                active={activeTab === 'reflection'} 
                onClick={() => setActiveTab('reflection')} 
                icon={<MessageSquare size={20} />} 
                label="수사 일지" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full p-4">
        {renderTab()}
      </main>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors w-full ${
      active ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span className="text-[10px] sm:text-xs font-medium">{label}</span>
  </button>
);
