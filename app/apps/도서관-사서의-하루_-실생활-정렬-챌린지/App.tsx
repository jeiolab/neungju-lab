import React, { useState, useEffect } from 'react';
import { TheoryTab } from './components/TheoryTab';
import { SimulationTab } from './components/SimulationTab';
import { AdvancedTab } from './components/AdvancedTab';
import { QuizTab } from './components/QuizTab';
import { ReflectionTab } from './components/ReflectionTab';
import { UserStats, UserLevel, SortType } from './types';
import { Layout, Trophy, Book, PenTool, Lightbulb, GraduationCap, Star, Target } from 'lucide-react';

const LEVEL_THRESHOLDS = {
  [UserLevel.APPRENTICE]: 0,
  [UserLevel.EXPERT]: 100,
  [UserLevel.CHIEF]: 300,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'advanced' | 'quiz' | 'reflect'>('theory');
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: UserLevel.APPRENTICE,
    insertionSuccess: 0,
    selectionSuccess: 0,
    dailyMission: "삽입 정렬 3회 성공하기",
    missionProgress: 0,
    missionTarget: 3,
    missionCompleted: false
  });

  const checkLevelUp = (currentXp: number): UserLevel => {
    if (currentXp >= LEVEL_THRESHOLDS[UserLevel.CHIEF]) return UserLevel.CHIEF;
    if (currentXp >= LEVEL_THRESHOLDS[UserLevel.EXPERT]) return UserLevel.EXPERT;
    return UserLevel.APPRENTICE;
  };

  const handleGameSuccess = (type: SortType) => {
    setStats(prev => {
      const newXp = prev.xp + 10;
      const newLevel = checkLevelUp(newXp);
      const isMissionTarget = prev.dailyMission.includes(type === SortType.INSERTION ? "삽입" : "선택");
      const newProgress = isMissionTarget ? Math.min(prev.missionProgress + 1, prev.missionTarget) : prev.missionProgress;
      const isCompleted = newProgress >= prev.missionTarget;

      return {
        ...prev,
        xp: newXp + (isCompleted && !prev.missionCompleted ? 50 : 0), // Bonus XP for mission
        level: newLevel,
        insertionSuccess: type === SortType.INSERTION ? prev.insertionSuccess + 1 : prev.insertionSuccess,
        selectionSuccess: type === SortType.SELECTION ? prev.selectionSuccess + 1 : prev.selectionSuccess,
        missionProgress: newProgress,
        missionCompleted: prev.missionCompleted || isCompleted
      };
    });
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Layout className="w-5 h-5" />
              </div>
              <h1 className="font-bold text-lg md:text-xl hidden md:block">도서관 사서의 하루</h1>
              <h1 className="font-bold text-lg md:text-xl md:hidden">사서 챌린지</h1>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Mission Badge */}
               <div className="hidden md:flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 text-xs font-medium text-amber-800">
                  <Target className="w-3 h-3" />
                  <span>{stats.dailyMission}</span>
                  <span className="font-bold">({stats.missionProgress}/{stats.missionTarget})</span>
                  {stats.missionCompleted && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
               </div>

              {/* Level Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-gray-500">XP {stats.xp}</div>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (stats.xp % 300) / 3)}%` }}
                    />
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center gap-1.5 border
                    ${stats.level === UserLevel.APPRENTICE ? 'bg-gray-100 border-gray-200 text-gray-600' : 
                      stats.level === UserLevel.EXPERT ? 'bg-blue-50 border-blue-200 text-blue-700' : 
                      'bg-purple-50 border-purple-200 text-purple-700'}`}>
                  {stats.level === UserLevel.CHIEF && <Trophy className="w-3 h-3" />}
                  {stats.level}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex justify-around border-t border-gray-200">
            <NavButton 
              active={activeTab === 'theory'} 
              onClick={() => setActiveTab('theory')} 
              icon={<Book className="w-5 h-5" />} 
              label="이론" 
            />
            <NavButton 
              active={activeTab === 'sim'} 
              onClick={() => setActiveTab('sim')} 
              icon={<PenTool className="w-5 h-5" />} 
              label="실습" 
            />
            <NavButton 
              active={activeTab === 'advanced'} 
              onClick={() => setActiveTab('advanced')} 
              icon={<GraduationCap className="w-5 h-5" />} 
              label="심화" 
            />
            <NavButton 
              active={activeTab === 'quiz'} 
              onClick={() => setActiveTab('quiz')} 
              icon={<Trophy className="w-5 h-5" />} 
              label="퀴즈" 
            />
            <NavButton 
              active={activeTab === 'reflect'} 
              onClick={() => setActiveTab('reflect')} 
              icon={<Lightbulb className="w-5 h-5" />} 
              label="생각" 
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-6 pt-6">
        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'sim' && <SimulationTab onSuccess={handleGameSuccess} />}
        {activeTab === 'advanced' && <AdvancedTab />}
        {activeTab === 'quiz' && <QuizTab />}
        {activeTab === 'reflect' && <ReflectionTab />}
      </main>
    </div>
    </>
  );
}

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-lg w-full transition-colors ${
      active ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </button>
);
