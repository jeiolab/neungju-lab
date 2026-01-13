import React, { useState, useEffect } from 'react';
import { BADGES } from './constants';
import { TabId, UserState } from './types';
import TimelineTab from './components/TimelineTab';
import SimulationTab from './components/SimulationTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';

const App: React.FC = () => {
  // Load initial state from local storage or defaults
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('aiHistoryAppState');
    return saved ? JSON.parse(saved) : {
      name: '',
      score: 0,
      completedTabs: [],
      badges: [],
      quizHistory: [],
      simulationProgress: 0
    };
  });

  const [activeTab, setActiveTab] = useState<TabId>('intro');

  // Save state on change
  useEffect(() => {
    if (userState.name) {
      localStorage.setItem('aiHistoryAppState', JSON.stringify(userState));
    }
  }, [userState]);

  const awardBadge = (badgeKey: keyof typeof BADGES) => {
    const badgeName = BADGES[badgeKey];
    if (!userState.badges.includes(badgeName)) {
      setUserState(prev => ({
        ...prev,
        badges: [...prev.badges, badgeName]
      }));
      // Could show a toast notification here
      alert(`배지 획득! [${badgeName}]`);
    }
  };

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    if (name.trim()) {
      setUserState(prev => ({ ...prev, name }));
      setActiveTab('timeline');
      awardBadge('INTRO');
    }
  };

  const markTabComplete = (tab: string) => {
    if (!userState.completedTabs.includes(tab)) {
      setUserState(prev => ({
        ...prev,
        completedTabs: [...prev.completedTabs, tab]
      }));
    }
  };

  // --- Intro Screen ---
  if (!userState.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI 히스토리 메이커</h1>
          <p className="text-slate-500 mb-8">규칙에서 데이터로 이어지는 위대한 여정에 오신 것을 환영합니다.</p>
          
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <input 
                name="name"
                type="text" 
                placeholder="연구원 이름을 입력하세요" 
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
              입장하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Main App ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-indigo-800 tracking-tight mr-2">AI History</span>
              <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium hidden sm:inline-block">Museum</span>
            </div>
            
            <div className="flex items-center space-x-4">
               <div className="hidden md:flex flex-col items-end mr-4">
                 <span className="text-xs text-slate-500">연구원</span>
                 <span className="text-sm font-bold text-slate-800">{userState.name}</span>
               </div>
               <div className="bg-slate-100 px-3 py-1 rounded-full flex items-center space-x-2">
                  <span className="text-xs text-slate-500 font-medium">진척도</span>
                  <div className="w-20 bg-slate-300 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${(userState.completedTabs.length / 5) * 100}%` }}></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-8">
             {[
               { id: 'timeline', label: '1. 이론 개념' },
               { id: 'simulation', label: '2. 역사 퍼즐' },
               { id: 'deepdive', label: '3. 더 알아보기' },
               { id: 'quiz', label: '4. 퀴즈' },
               { id: 'reflection', label: '5. 생각해보기' }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => {
                   setActiveTab(tab.id as TabId);
                   if (tab.id === 'timeline') {
                      markTabComplete('timeline');
                      awardBadge('TIMELINE');
                   }
                 }}
                 className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                   activeTab === tab.id
                     ? 'border-indigo-600 text-indigo-700'
                     : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                 }`}
               >
                 {tab.label}
                 {userState.completedTabs.includes(tab.id) && <span className="ml-1 text-green-500 text-xs">✓</span>}
               </button>
             ))}
          </div>
        </nav>
      </header>

      {/* Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'timeline' && <TimelineTab />}
        
        {activeTab === 'simulation' && (
          <SimulationTab 
            onComplete={(score) => {
              setUserState(prev => ({ ...prev, score: prev.score + score }));
              markTabComplete('simulation');
              awardBadge('SIMULATION');
            }}
            updateProgress={(prog) => setUserState(prev => ({ ...prev, simulationProgress: prog }))}
          />
        )}

        {activeTab === 'deepdive' && (
          <DeepDiveTab onRead={() => markTabComplete('deepdive')} />
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-8">
            <QuizTab 
              previousWrongIds={userState.quizHistory}
              onComplete={(count, wrongIds) => {
                setUserState(prev => ({
                    ...prev,
                    quizHistory: Array.from(new Set([...prev.quizHistory, ...wrongIds]))
                }));
                markTabComplete('quiz');
                if (count >= 8) awardBadge('QUIZ_MASTER');
                alert(`퀴즈 완료! 점수: ${count}/10`);
              }}
            />
            
            {/* Wrong Answer Note Preview */}
            {userState.quizHistory.length > 0 && (
                <div className="max-w-2xl mx-auto mt-8 bg-red-50 border border-red-100 p-4 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-2">오답 노트 ({userState.quizHistory.length}개)</h4>
                    <p className="text-sm text-red-600">틀린 문제는 다시 풀어보며 개념을 확실히 잡아보세요.</p>
                </div>
            )}
          </div>
        )}

        {activeTab === 'reflection' && <ReflectionTab />}
      </main>

      {/* Footer / Badge Showcase */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">획득한 배지</h4>
            <div className="flex justify-center flex-wrap gap-3">
                {Object.values(BADGES).map(badge => (
                    <span 
                        key={badge}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            userState.badges.includes(badge)
                             ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                             : 'bg-slate-50 text-slate-300 border-slate-100 grayscale'
                        }`}
                    >
                        {badge}
                    </span>
                ))}
            </div>
            <p className="text-xs text-slate-400 mt-6">© AI History Museum Project</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
