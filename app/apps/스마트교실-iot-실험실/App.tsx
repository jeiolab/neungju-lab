import React, { useState, useEffect } from 'react';
import { Tab, UserState } from './types';
import { BookOpen, Activity, Globe, CheckSquare, PenTool, Award, Zap, Star } from 'lucide-react';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import ExploreTab from './components/ExploreTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [userState, setUserState] = useState<UserState>({
    level: 1,
    exp: 0,
    badges: [],
    stamps: {},
    streak: 1, // Simulated streak
    completedScenarios: []
  });

  // Calculate Level based on EXP
  useEffect(() => {
    const nextLevelExp = userState.level * 100;
    if (userState.exp >= nextLevelExp) {
      setUserState(prev => ({
        ...prev,
        level: prev.level + 1,
        exp: prev.exp - nextLevelExp
      }));
      // Simple notification simulation
      alert(`레벨 업! 현재 레벨: ${userState.level + 1}`);
    }
  }, [userState.exp, userState.level]);

  // Check for badges
  useEffect(() => {
    if (userState.completedScenarios.length >= 3 && !userState.badges.includes('실험 마스터')) {
      setUserState(prev => ({ ...prev, badges: [...prev.badges, '실험 마스터'] }));
      alert('뱃지 획득: 실험 마스터 (모든 시나리오 완료)');
    }
  }, [userState.completedScenarios, userState.badges]);

  const handleExpGain = (amount: number) => {
    setUserState(prev => ({ ...prev, exp: prev.exp + amount }));
  };

  const handleScenarioComplete = (id: string, score: number) => {
    setUserState(prev => {
      const newStamps = { ...prev.stamps, [id]: Math.max(prev.stamps[id] || 0, score) };
      const newCompleted = prev.completedScenarios.includes(id) ? prev.completedScenarios : [...prev.completedScenarios, id];
      return { ...prev, stamps: newStamps, completedScenarios: newCompleted };
    });
    handleExpGain(20);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <TheoryTab onComplete={() => handleExpGain(10)} />;
      case Tab.SIMULATION:
        return <SimulationTab onComplete={handleScenarioComplete} stamps={userState.stamps} />;
      case Tab.EXPLORE:
        return <ExploreTab onQuizComplete={() => handleExpGain(15)} />;
      case Tab.QUIZ:
        return <QuizTab onCorrect={() => handleExpGain(10)} />;
      case Tab.REFLECTION:
        return <ReflectionTab onSave={() => handleExpGain(30)} />;
      default:
        return <TheoryTab onComplete={() => handleExpGain(10)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Header / Gamification Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none text-indigo-900">스마트교실</h1>
            <span className="text-xs text-slate-500">IoT 실험실</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <span className="text-indigo-600">Lv.{userState.level}</span>
              <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${(userState.exp / (userState.level * 100)) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2 text-xs text-slate-500 mt-1">
               <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-500" /> {userState.streak}일째</span>
               <span className="flex items-center gap-1"><Award size={12} className="text-purple-500" /> {userState.badges.length}개</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {renderContent()}
      </main>

      {/* Mobile/Desktop Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:static md:mt-8 bg-white border-t border-slate-200 md:border-none md:bg-transparent px-4 py-2 md:py-0">
        <div className="max-w-4xl mx-auto flex justify-between md:justify-center md:gap-4">
          {[
            { id: Tab.THEORY, label: '개념', icon: BookOpen },
            { id: Tab.SIMULATION, label: '실험', icon: Activity },
            { id: Tab.EXPLORE, label: '확장', icon: Globe },
            { id: Tab.QUIZ, label: '퀴즈', icon: CheckSquare },
            { id: Tab.REFLECTION, label: '정리', icon: PenTool },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-colors ${
                activeTab === item.id
                  ? 'text-indigo-600 bg-indigo-50 md:bg-white md:shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
