import React, { useState, useEffect } from 'react';
import { TabType, UserState, INITIAL_USER_STATE, ExperimentLog } from './types';
import { TabConcepts } from './components/TabConcepts';
import { TabSimulation } from './components/TabSimulation';
import { TabExplore } from './components/TabExplore';
import { TabQuiz } from './components/TabQuiz';
import { TabThink } from './components/TabThink';
import { Beaker, BookOpen, BrainCircuit, Lightbulb, CheckSquare, Award, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('concepts');
  const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);

  // Load state from local storage
  useEffect(() => {
    const saved = localStorage.getItem('iot-lab-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if streak needs update (simplified daily check)
        const lastDate = new Date(parsed.lastVisit).getDate();
        const today = new Date().getDate();
        if (lastDate !== today) {
            // New day login logic could go here
        }
        setUserState({ ...parsed, lastVisit: new Date().toISOString() });
      } catch (e) {
        console.error("Failed to load save state", e);
      }
    }
  }, []);

  // Save state to local storage
  useEffect(() => {
    localStorage.setItem('iot-lab-state', JSON.stringify(userState));
  }, [userState]);

  const handleUpdateWeakness = (concept: string) => {
    setUserState(prev => ({ ...prev, weakConcept: prev.weakConcept === concept ? null : concept }));
  };

  const handleCompleteExperiment = (log: ExperimentLog) => {
    const newHistory = [...userState.experimentLogs, log];
    let newXp = userState.xp + 10;
    const newBadges = [...userState.badges];

    if (newHistory.length === 5 && !newBadges.includes('lab_assistant')) {
        newBadges.push('lab_assistant');
        alert('🏅 배지 획득: 성실한 연구원 (실험 5회 완료)');
    }

    if (log.reliability >= 80) newXp += 5;

    setUserState(prev => ({
        ...prev,
        experimentLogs: newHistory,
        xp: newXp,
        completedExperiments: prev.completedExperiments + 1,
        badges: newBadges
    }));
  };

  const handleUpdateQuiz = (qId: number, isCorrect: boolean) => {
    const newHistory = { ...userState.quizHistory, [qId]: isCorrect };
    let newXp = userState.xp + (isCorrect ? 20 : 5);
    setUserState(prev => ({ ...prev, quizHistory: newHistory, xp: newXp }));
  };

  const handleSaveNotes = (notes: { condition: string; counter: string; design: string }) => {
    setUserState(prev => ({ ...prev, thinkNotes: notes, xp: prev.xp + 5 }));
  };

  const tabs = [
    { id: 'concepts', label: '개념 연구', icon: <BookOpen className="w-4 h-4"/> },
    { id: 'simulation', label: '실험실', icon: <Beaker className="w-4 h-4"/> },
    { id: 'explore', label: '탐험', icon: <Lightbulb className="w-4 h-4"/> },
    { id: 'quiz', label: '퀴즈', icon: <CheckSquare className="w-4 h-4"/> },
    { id: 'think', label: '사고 확장', icon: <BrainCircuit className="w-4 h-4"/> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Beaker size={20} />
            </div>
            <h1 className="font-bold text-slate-800 text-lg hidden sm:block">DNPC 해부 실험실</h1>
            <h1 className="font-bold text-slate-800 text-lg sm:hidden">DNPC Lab</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="flex items-center gap-1 text-orange-500">
                <Flame size={16} fill="currentColor" />
                <span>{userState.streak}일</span>
             </div>
             <div className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                <Award size={16} />
                <span>{userState.xp} XP</span>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto px-4 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-1">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as TabType)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                            activeTab === t.id 
                            ? 'border-indigo-600 text-indigo-600 font-bold' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 pb-20">
        {activeTab === 'concepts' && (
            <TabConcepts userState={userState} onUpdateWeakness={handleUpdateWeakness} />
        )}
        {activeTab === 'simulation' && (
            <TabSimulation userState={userState} onCompleteExperiment={handleCompleteExperiment} />
        )}
        {activeTab === 'explore' && (
            <TabExplore />
        )}
        {activeTab === 'quiz' && (
            <TabQuiz userState={userState} onUpdateQuizHistory={handleUpdateQuiz} />
        )}
        {activeTab === 'think' && (
            <TabThink userState={userState} onSaveNotes={handleSaveNotes} />
        )}
      </main>
    </div>
  );
};

export default App;