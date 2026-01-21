import React, { useState, useEffect } from 'react';
import { UserProfile, Difficulty } from './types';
import SimulationTab from './components/SimulationTab';
import { ConceptTab, QuizTab, ReflectionTab } from './components/EducationTabs';
import { Database, Puzzle, Lightbulb, PenTool, Award, LayoutGrid, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concept' | 'simulation' | 'quiz' | 'reflection'>('concept');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '학생',
    xp: 0,
    level: 1,
    badges: [],
    streak: 1,
    lastPlayed: null,
    completedScenarios: []
  });

  // Load profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cleanpipe_profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  // Save profile on change
  useEffect(() => {
    localStorage.setItem('cleanpipe_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const addXp = (amount: number) => {
    setUserProfile(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      const badges = [...prev.badges];
      
      if (newLevel >= 2 && !badges.includes('Data Novice')) badges.push('Data Novice');
      if (newLevel >= 5 && !badges.includes('Pipeline Master')) badges.push('Pipeline Master');

      return { ...prev, xp: newXp, level: newLevel, badges };
    });
  };

  const navItems = [
    { id: 'concept', label: '개념 학습', icon: <Database size={18} /> },
    { id: 'simulation', label: '퍼즐 실습', icon: <Puzzle size={18} /> },
    { id: 'quiz', label: '퀴즈', icon: <Lightbulb size={18} /> },
    { id: 'reflection', label: '생각해보기', icon: <PenTool size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <LayoutGrid size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              CleanPipe Puzzle
            </h1>
          </div>

          <div className="flex items-center gap-6">
             {/* Stats */}
             <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-slate-600">
                   <Zap className="text-yellow-500 fill-yellow-500" size={16} />
                   <span className="font-bold">{userProfile.streak}일 스트릭</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                   <Award className="text-blue-500" size={16} />
                   <span className="font-bold">Lv.{userProfile.level}</span>
                   <span className="text-xs text-slate-400">({userProfile.xp} XP)</span>
                </div>
             </div>
             {/* Simple Avatar */}
             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                {userProfile.name[0]}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all whitespace-nowrap
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="animate-fade-in">
          {activeTab === 'concept' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">빅데이터 전처리란?</h2>
                <p className="text-slate-500 mt-2">원석을 보석으로 다듬는 과정, 데이터 파이프라인의 기초를 배워봅시다.</p>
              </div>
              <ConceptTab />
            </div>
          )}

          {activeTab === 'simulation' && (
            <div>
               <div className="mb-6 flex justify-between items-end">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">대기오염 데이터 클리닝</h2>
                    <p className="text-slate-500 mt-2">
                      측정소에서 받은 데이터가 엉망입니다! 순서에 맞게 정리해주세요.
                    </p>
                 </div>
                 <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded font-medium">
                    난이도: 보통
                 </div>
               </div>
               <SimulationTab 
                  difficulty={Difficulty.NORMAL} 
                  onComplete={(score) => addXp(score)}
               />
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">마스터리 퀴즈</h2>
                <p className="text-slate-500 mt-2">전처리 개념을 확실하게 이해했는지 확인해보세요.</p>
              </div>
              <QuizTab onCorrectAnswer={() => addXp(10)} />
            </div>
          )}

          {activeTab === 'reflection' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">데이터 과학자의 고민</h2>
                <p className="text-slate-500 mt-2">정답이 없는 문제에 대해 나만의 논리를 세워봅시다.</p>
              </div>
              <ReflectionTab />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 CleanPipe Puzzle. Big Data Education Project.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;