import React, { useState, useEffect } from 'react';
import { TabType, UserProgress } from './types';
import { getDailySeed, getRandomItem, shuffleArray } from './utils/seeding';
import { CONCEPTS, CAREERS, QUIZ_BANK } from './constants';
import ConceptTab from './components/ConceptTab';
import ExperimentTab from './components/ExperimentTab';
import CareerTab from './components/CareerTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';
import { BookOpen, Activity, Briefcase, HelpCircle, PenTool, Award, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('concept');
  const [seed, setSeed] = useState<string>('');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    streak: 0,
    lastVisitDate: '',
    badges: [],
    completedMissions: [],
    skillsCollected: []
  });

  // Initialization
  useEffect(() => {
    const today = getDailySeed();
    setSeed(today);

    const savedProgress = localStorage.getItem('iotMissionProgress');
    if (savedProgress) {
      const parsed: UserProgress = JSON.parse(savedProgress);
      
      // Streak Logic
      let newStreak = parsed.streak;
      if (parsed.lastVisitDate !== today) {
        const lastDate = new Date(parsed.lastVisitDate);
        const currDate = new Date(today);
        const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Visited yesterday, streak continues (if not already incremented today)
          // Actually, we increment streak on mission completion, usually. 
          // Here, simplified: logging in daily maintains streak availability
        } else if (diffDays > 1) {
          newStreak = 0; // Streak broken
        }
      }
      
      setUserProgress({ ...parsed, streak: newStreak });
    } else {
        // New user
        setUserProgress(prev => ({ ...prev, lastVisitDate: today }));
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (userProgress.lastVisitDate) {
      localStorage.setItem('iotMissionProgress', JSON.stringify(userProgress));
    }
  }, [userProgress]);

  const handleMissionComplete = () => {
    const today = getDailySeed();
    if (!userProgress.completedMissions.includes(today)) {
      setUserProgress(prev => {
        const newStreak = prev.streak + 1;
        const newBadges = [...prev.badges];
        if (newStreak === 7) newBadges.push('7일 연속');
        
        return {
          ...prev,
          streak: newStreak,
          completedMissions: [...prev.completedMissions, today],
          lastVisitDate: today,
          badges: newBadges
        };
      });
      alert(`🎉 오늘의 미션 완료! 스트릭 ${userProgress.streak + 1}일 달성!`);
    }
  };

  // Content Selection based on Seed
  const dailyConcept = seed ? getRandomItem(CONCEPTS, seed) : CONCEPTS[0];
  const dailyQuiz = seed ? shuffleArray(QUIZ_BANK, seed).slice(0, 3) : QUIZ_BANK.slice(0, 3);
  
  const renderContent = () => {
    switch (currentTab) {
      case 'concept': return <ConceptTab concept={dailyConcept} />;
      case 'experiment': return <ExperimentTab />;
      case 'career': return <CareerTab careers={CAREERS} />;
      case 'quiz': return <QuizTab questions={dailyQuiz} onComplete={handleMissionComplete} />;
      case 'thinking': return <ThinkingTab onComplete={handleMissionComplete} />;
      default: return <ConceptTab concept={dailyConcept} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg font-bold text-xl">IoT</div>
            <h1 className="font-bold text-lg hidden sm:block">오늘의 미션</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-sm font-bold text-orange-700">{userProgress.streak}일 연속</span>
            </div>
            {userProgress.badges.length > 0 && (
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-bold text-yellow-700">{userProgress.badges[0]}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          <p className="text-gray-500">오늘의 학습 주제: <span className="text-blue-600 font-bold">{dailyConcept.title}</span></p>
        </div>
        
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile) & Sidebar (Desktop) */}
      <nav className="fixed bottom-0 w-full bg-white border-t md:top-20 md:left-auto md:bottom-auto md:w-20 md:h-screen md:border-t-0 md:border-r md:flex md:flex-col md:items-center md:pt-8 md:bg-transparent md:border-none z-40">
        <div className="max-w-4xl mx-auto md:mx-0 flex md:flex-col justify-around md:justify-start md:gap-8 w-full h-16 md:h-auto">
          <NavButton 
            active={currentTab === 'concept'} 
            onClick={() => setCurrentTab('concept')} 
            icon={<BookOpen className="w-6 h-6" />} 
            label="개념" 
          />
          <NavButton 
            active={currentTab === 'experiment'} 
            onClick={() => setCurrentTab('experiment')} 
            icon={<Activity className="w-6 h-6" />} 
            label="실험" 
          />
           <NavButton 
            active={currentTab === 'career'} 
            onClick={() => setCurrentTab('career')} 
            icon={<Briefcase className="w-6 h-6" />} 
            label="진로" 
          />
          <NavButton 
            active={currentTab === 'quiz'} 
            onClick={() => setCurrentTab('quiz')} 
            icon={<HelpCircle className="w-6 h-6" />} 
            label="퀴즈" 
          />
          <NavButton 
            active={currentTab === 'thinking'} 
            onClick={() => setCurrentTab('thinking')} 
            icon={<PenTool className="w-6 h-6" />} 
            label="생각" 
          />
        </div>
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full md:w-16 md:h-16 md:rounded-2xl md:shadow-sm md:border md:mb-4 transition-all
      ${active 
        ? 'text-blue-600 md:bg-blue-600 md:text-white md:border-blue-600 md:shadow-blue-200 md:scale-105' 
        : 'text-gray-400 hover:text-gray-600 md:bg-white md:border-gray-200'
      }`}
  >
    {icon}
    <span className="text-[10px] mt-1 md:hidden">{label}</span>
  </button>
);

export default App;
