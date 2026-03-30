import React, { useState, useEffect } from 'react';
import { Tab, ProgressState } from './types';
import Navigation from './components/Navigation';
import Introduction from './components/Introduction';
import Simulator from './components/Simulator';
import History from './components/History';
import Quiz from './components/Quiz';
import Discussion from './components/Discussion';
import { ShieldCheck, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.INTRO);
  const [progress, setProgress] = useState<ProgressState>({
    intro: false,
    simulator: false,
    history: false,
    quiz: false,
    discussion: false,
  });
  const [streak, setStreak] = useState(0);

  // Load streak from local storage
  useEffect(() => {
    const savedStreak = localStorage.getItem('secretNote_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
    else setStreak(1);
  }, []);

  const calculateProgress = () => {
    const total = Object.keys(progress).length;
    const completed = Object.values(progress).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const handleTabComplete = (tab: keyof ProgressState) => {
    setProgress(prev => ({ ...prev, [tab]: true }));
    // Move to next tab if reasonable
    const tabs = Object.values(Tab);
    const currIdx = tabs.indexOf(currentTab);
    if(currIdx < tabs.length - 1) {
        // Optional: Auto advance? No, let user explore, but unlock visual
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-indigo-900 text-white pt-6 pb-12 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-yellow-400" /> 비밀 쪽지 대작전
            </h1>
            <p className="text-indigo-200 mt-1 text-sm font-medium">학교 보안 동아리에 온 걸 환영해!</p>
          </div>
          
          <div className="flex items-center gap-3 bg-indigo-800/50 p-2 rounded-lg backdrop-blur-sm border border-indigo-700">
            <div className="flex flex-col items-center">
              <span className="text-xs text-indigo-300">연속 학습</span>
              <div className="flex items-center gap-1 font-bold text-yellow-400">
                <Flame size={16} className="fill-yellow-400" /> {streak}일
              </div>
            </div>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
      </header>

      {/* Main Content Area Container - shifted up */}
      <div className="flex-1 -mt-6">
        <div className="max-w-4xl mx-auto bg-white rounded-t-3xl shadow-2xl min-h-[80vh] flex flex-col overflow-hidden">
          
          <Navigation 
            currentTab={currentTab} 
            onSelectTab={setCurrentTab}
            completedTabs={progress}
          />

          {/* Progress Bar */}
          <div className="h-1 w-full bg-slate-100">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>

          <main className="p-4 md:p-8 flex-1">
             <div className="animate-slide-up">
                {currentTab === Tab.INTRO && (
                  <Introduction onComplete={() => handleTabComplete('intro')} />
                )}
                {currentTab === Tab.SIMULATOR && (
                  <Simulator onComplete={() => handleTabComplete('simulator')} />
                )}
                {currentTab === Tab.HISTORY && (
                  <History onComplete={() => handleTabComplete('history')} />
                )}
                {currentTab === Tab.QUIZ && (
                  <Quiz onComplete={(res) => {
                    if (res.score >= 80) handleTabComplete('quiz');
                  }} />
                )}
                {currentTab === Tab.DISCUSSION && (
                  <Discussion onComplete={() => handleTabComplete('discussion')} />
                )}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;