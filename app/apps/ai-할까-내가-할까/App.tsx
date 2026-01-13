import React, { useState, useEffect } from 'react';
import { UserState } from './types';
import CriteriaTab from './components/CriteriaTab';
import GameTab from './components/GameTab';
import LearnMoreTab from './components/LearnMoreTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { LayoutDashboard, Gamepad2, BookOpen, GraduationCap, PenTool } from 'lucide-react';

const INITIAL_STATE: UserState = {
  score: 0,
  level: 1,
  streak: 0,
  badges: [],
  history: [],
  incorrectTags: {
    DATA: 0, EMOTION: 0, RESPONSIBILITY: 0, CREATIVITY: 0, VERIFICATION: 0, ETHICS: 0
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'criteria' | 'game' | 'learn' | 'quiz' | 'reflect'>('game');
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('judgegame_state_v1');
    if (saved) {
      try {
        setUserState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  const updateState = (newState: Partial<UserState>) => {
    const nextState = { ...userState, ...newState };
    // Level logic: every 100 points level up
    nextState.level = Math.floor(nextState.score / 100) + 1;
    setUserState(nextState);
    localStorage.setItem('judgegame_state_v1', JSON.stringify(nextState));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-20 bg-[#F5F7FA]">
      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="font-black text-gray-800 tracking-tight text-lg">AI 할까? 내가 할까?</h1>
            <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 font-bold">LV.{userState.level}</span>
                    <span className="text-xs text-indigo-600 font-bold">{userState.score} P</span>
                </div>
                {userState.badges.length > 0 && (
                     <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                        뱃지 {userState.badges.length}개
                     </div>
                )}
            </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto">
        {activeTab === 'criteria' && <CriteriaTab />}
        {activeTab === 'game' && <GameTab userState={userState} updateState={updateState} />}
        {activeTab === 'learn' && <LearnMoreTab />}
        {activeTab === 'quiz' && <QuizTab />}
        {activeTab === 'reflect' && <ReflectionTab />}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
          <NavButton 
            active={activeTab === 'criteria'} 
            onClick={() => setActiveTab('criteria')} 
            icon={LayoutDashboard} 
            label="기준" 
          />
          <NavButton 
            active={activeTab === 'game'} 
            onClick={() => setActiveTab('game')} 
            icon={Gamepad2} 
            label="게임" 
          />
          <NavButton 
            active={activeTab === 'learn'} 
            onClick={() => setActiveTab('learn')} 
            icon={BookOpen} 
            label="사례" 
          />
          <NavButton 
            active={activeTab === 'quiz'} 
            onClick={() => setActiveTab('quiz')} 
            icon={GraduationCap} 
            label="퀴즈" 
          />
          <NavButton 
            active={activeTab === 'reflect'} 
            onClick={() => setActiveTab('reflect')} 
            icon={PenTool} 
            label="생각" 
          />
        </div>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: any; label: string }> = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default App;
