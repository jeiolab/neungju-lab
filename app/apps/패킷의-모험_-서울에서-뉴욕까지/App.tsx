import React, { useState, useEffect } from 'react';
import { TabType, UserLevel, UserStats } from './types';
import { BookOpen, Gamepad2, Info, HelpCircle, Brain, Signal, Award } from 'lucide-react';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import LearnMoreTab from './components/LearnMoreTab';
import QuizTab from './components/QuizTab';
import ThinkTab from './components/ThinkTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('simulation');
  const [userStats, setUserStats] = useState<UserStats>({
    score: 0,
    level: 'Local',
    correctQuizCount: 0,
    simulationCompleted: false,
  });

  // Calculate Level based on stats
  useEffect(() => {
    let newLevel: UserLevel = 'Local';
    const totalPoints = userStats.correctQuizCount * 10 + (userStats.simulationCompleted ? 50 : 0);
    
    if (totalPoints >= 80) newLevel = 'Global';
    else if (totalPoints >= 30) newLevel = 'National';

    if (newLevel !== userStats.level) {
      setUserStats(prev => ({ ...prev, level: newLevel }));
    }
  }, [userStats.correctQuizCount, userStats.simulationCompleted]);

  const handleQuizScore = (quizScore: number) => {
    setUserStats(prev => ({ ...prev, correctQuizCount: quizScore }));
  };

  const handleSimulationComplete = () => {
    setUserStats(prev => ({ ...prev, simulationCompleted: true }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'simulation': return <SimulationTab onComplete={handleSimulationComplete} />;
      case 'learn-more': return <LearnMoreTab />;
      case 'quiz': return <QuizTab onScoreUpdate={handleQuizScore} />;
      case 'think': return <ThinkTab />;
      default: return <SimulationTab onComplete={handleSimulationComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Signal className="text-white" size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:block">패킷의 모험</span>
            </div>

            {/* Level Badge */}
            <div className="flex items-center gap-3 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
               <Award size={16} className={`${
                 userStats.level === 'Global' ? 'text-yellow-500' : 
                 userStats.level === 'National' ? 'text-blue-500' : 'text-slate-400'
               }`} />
               <span className="text-xs font-medium text-slate-600">
                 Level: <span className={`font-bold ${
                    userStats.level === 'Global' ? 'text-yellow-600' : 
                    userStats.level === 'National' ? 'text-blue-600' : 'text-slate-800'
                 }`}>{userStats.level === 'Local' ? '동네 네트워크' : userStats.level === 'National' ? '국가망' : '글로벌망'}</span>
               </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-2">
          {[
            { id: 'theory', label: '이론 개념', icon: BookOpen },
            { id: 'simulation', label: '시뮬레이션', icon: Gamepad2 },
            { id: 'learn-more', label: '더 알아보기', icon: Info },
            { id: 'quiz', label: '퀴즈', icon: HelpCircle },
            { id: 'think', label: '생각해보기', icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Container */}
        <div className="animate-fadeIn">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default App;