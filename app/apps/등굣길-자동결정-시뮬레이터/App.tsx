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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">등굣길 자동결정 시뮬레이터</h1>
              <p className="text-xs text-gray-500">제어 구조 학습</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1 text-indigo-600">
              <Trophy size={16} className="text-yellow-500"/>
              <span>Lv.{userState.level}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame size={16} className="text-orange-500"/>
              <span>{userState.streak}일</span>
            </div>
            <div className="bg-gray-100 px-3 py-1.5 rounded-full text-gray-700 font-bold">
              {userState.points} pts
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-4 border-t border-gray-200 bg-white">
          <div className="flex overflow-x-auto no-scrollbar gap-1">
            <button onClick={() => setActiveTab('theory')} className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${activeTab === 'theory' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
              <LayoutDashboard size={18} />
              <span>이론 개념</span>
            </button>
            <button onClick={() => setActiveTab('sim')} className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${activeTab === 'sim' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
              <PlayCircle size={18} />
              <span>시뮬레이션</span>
            </button>
            <button onClick={() => setActiveTab('deep')} className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${activeTab === 'deep' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Split size={18} />
              <span>더 알아보기</span>
            </button>
            <button onClick={() => setActiveTab('quiz')} className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${activeTab === 'quiz' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
              <GraduationCap size={18} />
              <span>확인 퀴즈</span>
            </button>
            <button onClick={() => setActiveTab('reflect')} className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${activeTab === 'reflect' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
              <PenTool size={18} />
              <span>생각 기록</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'theory' && '제어 구조의 기초'}
              {activeTab === 'sim' && '등굣길 시뮬레이터'}
              {activeTab === 'deep' && '코드 깊게 보기'}
              {activeTab === 'quiz' && '실력 확인하기'}
              {activeTab === 'reflect' && '나만의 알고리즘'}
            </h1>
            <p className="text-gray-600 mt-2">
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
        </div>
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
