import React, { useState, useEffect } from 'react';
import { UserState, View, WrongNote } from './types';
import { getTodayString } from './utils';
import DailyMission from './components/DailyMission';
import QuizSection from './components/QuizSection';
import Dashboard from './components/Dashboard';
import ThinkingSection from './components/ThinkingSection';
import { generateConcepts } from './services/geminiService';

const INITIAL_STATE: UserState = {
  lastCompletedDate: null,
  streak: 0,
  points: 0,
  badges: [],
  mastery: {},
  wrongNotes: [],
  missionHistory: [],
  apiKey: null
};

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [dailyConcepts, setDailyConcepts] = useState<any[]>([]);
  
  useEffect(() => {
    // Load state from localStorage
    const saved = localStorage.getItem('ml_mission_state');
    if (saved) {
      setUserState(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ml_mission_state', JSON.stringify(userState));
  }, [userState]);

  const today = getTodayString();
  const isMissionDone = userState.lastCompletedDate === today;

  const handleMissionComplete = async (success: boolean, tags: string[]) => {
    const newState = { ...userState };
    
    // Streak Logic
    if (newState.lastCompletedDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (newState.lastCompletedDate === yesterdayStr) {
        newState.streak += 1;
      } else {
        newState.streak = 1;
      }
      newState.lastCompletedDate = today;
    }

    if (success) {
      newState.points += 50;
      newState.missionHistory.push({ date: today, score: 50 });
      
      // Update Mastery
      tags.forEach(tag => {
        newState.mastery[tag] = Math.min((newState.mastery[tag] || 0) + 5, 100);
      });
    }

    // Badge Logic
    if (newState.streak === 3 && !newState.badges.includes('streak_3')) newState.badges.push('streak_3');
    if (newState.streak === 7 && !newState.badges.includes('streak_7')) newState.badges.push('streak_7');
    if (newState.missionHistory.length >= 50 && !newState.badges.includes('mission_50')) newState.badges.push('mission_50');

    setUserState(newState);

    // Fetch concepts for the dashboard
    try {
        const concepts = await generateConcepts(tags);
        setDailyConcepts(concepts);
    } catch(e) {
        console.error("Failed to load concepts");
    }
  };

  const handleQuizComplete = (score: number, wrongNotes: WrongNote[]) => {
    const newState = { ...userState };
    newState.points += score;
    newState.wrongNotes = [...wrongNotes, ...newState.wrongNotes].slice(0, 50); // Keep last 50
    
    // Simple mastery decay for wrong answers, boost for correct implicit in quiz logic?
    // For now, just update based on wrong notes tags negatively slightly or keep static
    wrongNotes.forEach(w => {
       newState.mastery[w.tag] = Math.max((newState.mastery[w.tag] || 50) - 2, 0);
    });

    setUserState(newState);
    setCurrentView('DASHBOARD');
  };

  const weakTags = Object.entries(userState.mastery)
    // Fix: Cast values to number to satisfy arithmetic operation type requirements
    .sort(([, a], [, b]) => (a as number) - (b as number))
    .slice(0, 3)
    .map(([tag]) => tag);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2" onClick={() => setCurrentView('HOME')}>
            <span className="text-2xl">🤖</span>
            <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer">
              오늘의 ML 미션
            </h1>
          </div>
          
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {(['HOME', 'QUIZ', 'DASHBOARD'] as View[]).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  currentView === view 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {view === 'HOME' ? '미션' : view === 'QUIZ' ? '퀴즈' : '내 정보'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-6">
        
        {currentView === 'HOME' && (
          <div className="space-y-8 animate-fade-in">
             <div className="text-center space-y-2 py-4">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  {isMissionDone ? "오늘의 성장 완료! 🎉" : "오늘의 5분 투자, 시작해볼까요?"}
                </h2>
                <p className="text-slate-500">
                  현재 <span className="font-bold text-indigo-600">{userState.streak}일</span> 연속 학습 중입니다.
                </p>
             </div>

             <DailyMission 
               onComplete={handleMissionComplete} 
               completedToday={isMissionDone}
             />

             {isMissionDone && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-lg mb-4 text-slate-800">🚀 더 성장하고 싶다면?</h3>
                   <button 
                     onClick={() => setCurrentView('QUIZ')}
                     className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition"
                   >
                     취약점 보완 퀴즈 풀기
                   </button>
                 </div>
                 <ThinkingSection />
               </div>
             )}
          </div>
        )}

        {currentView === 'QUIZ' && (
          <QuizSection weakTags={weakTags} onQuizComplete={handleQuizComplete} />
        )}

        {currentView === 'DASHBOARD' && (
          <Dashboard userState={userState} dailyConcepts={dailyConcepts} />
        )}

      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 Today's ML Random Mission. Powered by Gemini API.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;