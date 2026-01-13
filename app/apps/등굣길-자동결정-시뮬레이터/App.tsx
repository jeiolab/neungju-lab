import React, { useState, useEffect } from 'react';
import { UserState, WrongNote, Concept } from './types';
import { LOCAL_STORAGE_KEY_PREFIX, LEVEL_THRESHOLDS, BADGES } from './constants';
import { loadState, saveState, loadWrongNotes, saveWrongNotes } from './utils/storage';
import { TheoryTab } from './components/TheoryTab';
import { SimulationTab } from './components/SimulationTab';
import { DeepDiveTab } from './components/DeepDiveTab';
import { QuizTab } from './components/QuizTab';
import { ReflectionTab } from './components/ReflectionTab';
import { LayoutDashboard, PlayCircle, Split, GraduationCap, PenTool, Trophy, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory'|'sim'|'deep'|'quiz'|'reflect'>('theory');
  const [userState, setUserState] = useState<UserState>(loadState());
  const [wrongNotes, setWrongNotes] = useState<WrongNote[]>(loadWrongNotes());
  const [showBadgeModal, setShowBadgeModal] = useState<string | null>(null);

  // Initialize (Streak check)
  useEffect(() => {
    const today = new Date().toDateString();
    if (userState.lastLoginDate !== today) {
      // New day logic
      const isConsecutive = new Date(userState.lastLoginDate).getTime() === new Date(Date.now() - 86400000).getTime();
      const newStreak = isConsecutive ? userState.streak + 1 : 1;
      
      const newState = {
        ...userState,
        streak: newStreak,
        lastLoginDate: today
      };
      setUserState(newState);
      saveState(newState);
    }
  }, []);

  const addPoints = (amount: number, concept?: Concept) => {
    setUserState(prev => {
      let newPoints = prev.points + amount;
      let newLevel = prev.level;
      
      // Level up logic
      if (newLevel < LEVEL_THRESHOLDS.length && newPoints >= LEVEL_THRESHOLDS[newLevel]) {
        newLevel++;
      }

      // Mastery update
      const newMastery = { ...prev.masteryByConcept };
      if (concept) {
        newMastery[concept] = Math.min(100, newMastery[concept] + 10);
      }

      // Check Badges
      const newBadges = [...prev.badges];
      BADGES.forEach(badge => {
        if (newBadges.includes(badge.id)) return;
        
        // Example badge logic
        if (badge.id === 'condition_master' && newMastery.selection >= 80) {
          newBadges.push(badge.id);
          setShowBadgeModal(badge.name);
        }
      });

      const nextState = {
        ...prev,
        points: newPoints,
        level: newLevel,
        masteryByConcept: newMastery,
        badges: newBadges
      };
      saveState(nextState);
      return nextState;
    });
  };

  const handleSimComplete = (success: boolean, points: number) => {
    if (success) {
      addPoints(points, 'selection'); // Simulation improves selection/iteration mastery
      addPoints(10, 'iteration');
    } else {
      addPoints(10); // Participation points
    }
  };

  const handleQuizCorrect = (q: any) => {
    addPoints(20, q.concept);
  };

  const handleQuizWrong = (note: WrongNote) => {
    const newNotes = [...wrongNotes, note];
    setWrongNotes(newNotes);
    saveWrongNotes(newNotes);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row max-w-7xl mx-auto shadow-2xl my-0 md:my-8 rounded-none md:rounded-2xl overflow-hidden border-x border-slate-200">
      
      {/* Sidebar / Mobile Tab Bar */}
      <nav className="bg-slate-900 text-slate-300 md:w-64 flex-shrink-0 flex md:flex-col justify-between overflow-x-auto md:overflow-visible no-scrollbar sticky top-0 z-10 md:static">
        <div className="p-4 md:p-6 flex items-center gap-2 md:block">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
          <span className="font-bold text-white tracking-tight hidden md:inline-block md:mt-4 md:text-xl">
            등굣길 시뮬레이터
          </span>
        </div>

        <div className="flex md:flex-col gap-1 p-2 md:p-4 w-full">
          <button onClick={() => setActiveTab('theory')} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'theory' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} />
            <span className="whitespace-nowrap">이론 개념</span>
          </button>
          <button onClick={() => setActiveTab('sim')} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'sim' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800'}`}>
            <PlayCircle size={20} />
            <span className="whitespace-nowrap">시뮬레이션</span>
          </button>
          <button onClick={() => setActiveTab('deep')} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'deep' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800'}`}>
            <Split size={20} />
            <span className="whitespace-nowrap">더 알아보기</span>
          </button>
          <button onClick={() => setActiveTab('quiz')} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'quiz' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800'}`}>
            <GraduationCap size={20} />
            <span className="whitespace-nowrap">확인 퀴즈</span>
          </button>
          <button onClick={() => setActiveTab('reflect')} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'reflect' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800'}`}>
            <PenTool size={20} />
            <span className="whitespace-nowrap">생각 기록</span>
          </button>
        </div>

        <div className="hidden md:block p-6 border-t border-slate-800">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="flex items-center gap-1"><Trophy size={14} className="text-yellow-400"/> Lv.{userState.level}</span>
            <span className="flex items-center gap-1"><Flame size={14} className="text-orange-500"/> {userState.streak}일</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(userState.points % 100)}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-1 text-right">{userState.points} pts</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-white h-[calc(100vh-60px)] md:h-auto">
        {/* Mobile Stat Bar */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
           <div className="flex items-center gap-3">
             <span className="text-sm font-bold flex items-center gap-1"><Trophy size={16} className="text-yellow-500"/> {userState.level}</span>
             <span className="text-sm font-bold flex items-center gap-1"><Flame size={16} className="text-orange-500"/> {userState.streak}</span>
           </div>
           <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">{userState.points} pts</span>
        </div>

        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            {activeTab === 'theory' && '제어 구조의 기초'}
            {activeTab === 'sim' && '등굣길 시뮬레이터'}
            {activeTab === 'deep' && '코드 깊게 보기'}
            {activeTab === 'quiz' && '실력 확인하기'}
            {activeTab === 'reflect' && '나만의 알고리즘'}
          </h1>
          <p className="text-slate-500">
            {activeTab === 'theory' && '순차, 선택, 반복 구조가 무엇인지 알아봅시다.'}
            {activeTab === 'sim' && '조건을 조작하여 지각하지 않고 가장 저렴하게 학교에 가보세요.'}
            {activeTab === 'deep' && '미묘한 코드 차이가 어떤 나비효과를 불러오는지 실험해봅니다.'}
            {activeTab === 'quiz' && '배운 내용을 퀴즈로 풀어보고 오답노트를 확인하세요.'}
            {activeTab === 'reflect' && '배운 내용을 글로 정리하며 사고력을 키웁니다.'}
          </p>
        </header>

        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'sim' && <SimulationTab onComplete={handleSimComplete} />}
        {activeTab === 'deep' && <DeepDiveTab />}
        {activeTab === 'quiz' && <QuizTab onCorrect={handleQuizCorrect} onWrong={handleQuizWrong} wrongNotes={wrongNotes} />}
        {activeTab === 'reflect' && <ReflectionTab />}
      </main>

      {/* Badge Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <div className="text-6xl mb-4 animate-bounce">🎖️</div>
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">새 배지 획득!</h2>
            <p className="text-lg font-medium text-slate-700 mb-6">{showBadgeModal}</p>
            <button 
              onClick={() => setShowBadgeModal(null)}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
            >
              멋져요!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
