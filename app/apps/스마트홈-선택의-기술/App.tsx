import React, { useState, useEffect } from 'react';
import { TabType, UserState } from './types';
import TabConcepts from './components/TabConcepts';
import TabSimulation from './components/TabSimulation';
import TabCases from './components/TabCases';
import TabQuiz from './components/TabQuiz';
import TabThinking from './components/TabThinking';
import { BookOpen, Gamepad2, Layers, BrainCircuit, PenTool, Award, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('concepts');
  const [userState, setUserState] = useState<UserState>({
    privacySensitivity: 50,
    selectedFeatures: [],
    completedCases: [],
    quizScore: 0,
    quizAnswers: {},
    badges: [],
    streak: 1, // Mock streak
    thinkingAnswers: {},
    thinkingFeedback: {}
  });

  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    // Simple mock for "Marking Concept as Read" implicitly
    setHasShownWelcome(true);
  }, []);

  const addBadge = (badge: string) => {
    if (!userState.badges.includes(badge)) {
      setUserState(prev => ({ ...prev, badges: [...prev.badges, badge] }));
      alert(`🎉 새로운 배지 획득: ${badge}`);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'concepts', label: '개념 & 기준', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'simulation', label: 'IoT 설계소', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'cases', label: '사례 탐구', icon: <Layers className="w-4 h-4" /> },
    { id: 'quiz', label: '퀴즈', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'thinking', label: '생각 더하기', icon: <PenTool className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
            <h1 className="font-bold text-slate-800 text-lg md:text-xl hidden md:block">스마트홈 선택의 기술</h1>
            <h1 className="font-bold text-slate-800 text-lg md:hidden">선택의 기술</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{userState.streak}일째</span>
             </div>
             <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1 rounded-full">
                <Award className="w-4 h-4" />
                <span>{userState.badges.length}개</span>
             </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto custom-scrollbar">
          <nav className="flex space-x-1 md:space-x-4 h-12 items-center">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {activeTab === 'concepts' && (
          <TabConcepts
            privacySensitivity={userState.privacySensitivity}
            setPrivacySensitivity={(val) => setUserState(prev => ({ ...prev, privacySensitivity: val }))}
            markCompleted={() => {}} 
          />
        )}
        {activeTab === 'simulation' && (
          <TabSimulation
            selectedFeatures={userState.selectedFeatures}
            setSelectedFeatures={(ids) => setUserState(prev => ({ ...prev, selectedFeatures: ids }))}
            privacySensitivity={userState.privacySensitivity}
            addBadge={addBadge}
          />
        )}
        {activeTab === 'cases' && (
          <TabCases
            completedCases={userState.completedCases}
            markCaseCompleted={(id) => setUserState(prev => ({ ...prev, completedCases: [...prev.completedCases, id] }))}
            addBadge={addBadge}
          />
        )}
        {activeTab === 'quiz' && (
          <TabQuiz
            quizAnswers={userState.quizAnswers}
            setQuizAnswer={(qId, aIdx) => setUserState(prev => ({ ...prev, quizAnswers: { ...prev.quizAnswers, [qId]: aIdx } }))}
            addBadge={addBadge}
          />
        )}
        {activeTab === 'thinking' && (
          <TabThinking
            thinkingAnswers={userState.thinkingAnswers}
            thinkingFeedback={userState.thinkingFeedback}
            setThinkingAnswer={(id, ans) => setUserState(prev => ({ ...prev, thinkingAnswers: { ...prev.thinkingAnswers, [id]: ans } }))}
            setThinkingFeedback={(id, feed) => setUserState(prev => ({ ...prev, thinkingFeedback: { ...prev.thinkingFeedback, [id]: feed } }))}
            addBadge={addBadge}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 스마트홈 선택의 기술. 교육 목적의 IoT 트레이드오프 시뮬레이션입니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;