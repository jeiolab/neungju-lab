import React, { useState, useEffect } from 'react';
import { TabType, ModuleType, UserState, QuizQuestion, LEVELS } from './types';
import { getInstructorFeedback } from './services/geminiService';
import TrainingManual from './components/TrainingManual';
import MockExam from './components/MockExam';
import SecuritySimulation from './components/SecuritySimulation';
import ReviewNote from './components/ReviewNote';
import MyLicense from './components/MyLicense';
import { Book, Edit3, Shield, AlertOctagon, User, Flame } from 'lucide-react';

const INITIAL_STATE: UserState = {
  level: '훈련병',
  totalScore: 0,
  streak: 1,
  badges: [],
  moduleMastery: {
    [ModuleType.PERSONAL_INFO]: 0,
    [ModuleType.PROTECTION]: 0,
    [ModuleType.COPYRIGHT]: 0
  },
  incorrectAnswers: [],
  completedCardIds: []
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.MANUAL);
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [instructorMessage, setInstructorMessage] = useState("오늘의 훈련을 시작한다. 준비됐나?");
  
  useEffect(() => {
    // Initial greeting
    const fetchGreeting = async () => {
        const msg = await getInstructorFeedback('WELCOME');
        setInstructorMessage(msg);
    };
    fetchGreeting();
  }, []);

  const updateMastery = (moduleId: ModuleType, amount: number) => {
    setUserState(prev => {
        const currentMastery = prev.moduleMastery[moduleId];
        const newMastery = Math.min(currentMastery + amount, 100);
        
        let newBadges = [...prev.badges];
        if (newMastery >= 100 && !newBadges.includes(moduleId)) {
            newBadges.push(moduleId);
        }

        return {
            ...prev,
            moduleMastery: {
                ...prev.moduleMastery,
                [moduleId]: newMastery
            },
            badges: newBadges
        };
    });
  };

  const addScore = (amount: number) => {
    setUserState(prev => {
        const newScore = prev.totalScore + amount;
        // Check Level Up
        const currentLevelIdx = LEVELS.findIndex(l => l.name === prev.level);
        const newLevelInfo = LEVELS.slice().reverse().find(l => newScore >= l.minScore);
        
        if (newLevelInfo && newLevelInfo.name !== prev.level) {
             getInstructorFeedback('LEVEL_UP').then(msg => setInstructorMessage(msg));
             return { ...prev, totalScore: newScore, level: newLevelInfo.name };
        }

        return { ...prev, totalScore: newScore };
    });
  };

  const handleCardRead = (cardId: string, moduleId: ModuleType) => {
    if (!userState.completedCardIds.includes(cardId)) {
      setUserState(prev => ({
        ...prev,
        completedCardIds: [...prev.completedCardIds, cardId]
      }));
      updateMastery(moduleId, 10);
      addScore(10);
    }
  };

  const handleCorrectAnswer = (moduleId: ModuleType) => {
    updateMastery(moduleId, 30);
    addScore(30);
  };

  const handleWrongAnswer = (question: QuizQuestion) => {
      setUserState(prev => {
          // Avoid duplicates
          if (prev.incorrectAnswers.some(q => q.id === question.id)) return prev;
          return {
              ...prev,
              incorrectAnswers: [...prev.incorrectAnswers, question]
          };
      });
  };

  const clearWrongAnswers = () => {
      setUserState(prev => ({ ...prev, incorrectAnswers: [] }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case TabType.MANUAL:
        return <TrainingManual onCardRead={handleCardRead} completedCardIds={userState.completedCardIds} />;
      case TabType.EXAM:
        return (
            <MockExam 
                onCorrectAnswer={handleCorrectAnswer} 
                onWrongAnswer={handleWrongAnswer}
                instructorMessage={instructorMessage}
                setInstructorMessage={setInstructorMessage}
            />
        );
      case TabType.SIMULATION:
        return <SecuritySimulation onCorrect={handleCorrectAnswer} onWrong={handleWrongAnswer} />;
      case TabType.NOTE:
        return <ReviewNote incorrectQuestions={userState.incorrectAnswers} onClear={clearWrongAnswers} />;
      case TabType.LICENSE:
        return <MyLicense userState={userState} />;
      default:
        return null;
    }
  };

  const NavButton: React.FC<{ tab: TabType; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
        activeTab === tab 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span className="text-[10px] md:text-xs font-medium mt-1">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-lg mx-auto md:max-w-4xl shadow-2xl border-x border-slate-200">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-slate-200 sticky top-0 z-50">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">정보 보안 <span className="text-blue-600">가디언</span> 아카데미</h1>
                <p className="text-xs text-slate-500 font-medium">Information Security Guardian Academy</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{userState.streak}일 연속</span>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400">현재 계급</p>
                    <p className="font-bold text-slate-800">{userState.level}</p>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center sticky bottom-0 z-50 safe-area-bottom">
        <NavButton tab={TabType.MANUAL} icon={<Book className="w-6 h-6" />} label="훈련 매뉴얼" />
        <NavButton tab={TabType.EXAM} icon={<Edit3 className="w-6 h-6" />} label="실전 모의고사" />
        <NavButton tab={TabType.SIMULATION} icon={<Shield className="w-6 h-6" />} label="시뮬레이션" />
        <NavButton tab={TabType.NOTE} icon={<AlertOctagon className="w-6 h-6" />} label="오답 노트" />
        <NavButton tab={TabType.LICENSE} icon={<User className="w-6 h-6" />} label="나의 라이센스" />
      </nav>
    </div>
  );
};

export default App;