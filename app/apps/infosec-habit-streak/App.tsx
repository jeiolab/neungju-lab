import React, { useState, useEffect } from 'react';
import { UserState, Mission, DailyRecord } from './types';
import { getMissionForDate, getTodayDateString, calculateDaysDifference } from './utils';
import { BADGES, LEVEL_THRESHOLDS } from './constants';
import { DailyMission } from './components/DailyMission';
import { QuizSection } from './components/QuizSection';
import { StatsDashboard } from './components/StatsDashboard';
import { LayoutDashboard, CheckSquare, GraduationCap } from 'lucide-react';

// Initial State
const INITIAL_STATE: UserState = {
  xp: 0,
  level: 1,
  currentStreak: 0,
  maxStreak: 0,
  badges: [],
  lastLoginDate: '',
  history: {},
  quizHistory: {
    totalAttempted: 0,
    totalCorrect: 0,
    weaknessTags: {}
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mission' | 'quiz' | 'stats'>('mission');
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [todayMission, setTodayMission] = useState<Mission | null>(null);
  
  const todayStr = getTodayDateString();

  // Load Data and Calculate Streak on Mount
  useEffect(() => {
    const saved = localStorage.getItem('infosec_habit_user');
    let currentUser = saved ? JSON.parse(saved) : INITIAL_STATE;
    
    // Determine Mission for Today
    setTodayMission(getMissionForDate(todayStr));

    // Calculate Streak
    if (currentUser.lastLoginDate !== todayStr) {
      if (currentUser.lastLoginDate) {
        const diff = calculateDaysDifference(currentUser.lastLoginDate, todayStr);
        if (diff === 1) {
          // Continued streak (logic handles increment on completion)
        } else if (diff > 1) {
          // Streak broken
          currentUser.currentStreak = 0;
        }
      }
      currentUser.lastLoginDate = todayStr;
      saveUser(currentUser);
    }
    
    setUserState(currentUser);
  }, []);

  const saveUser = (newState: UserState) => {
    setUserState(newState);
    localStorage.setItem('infosec_habit_user', JSON.stringify(newState));
  };

  const handleMissionComplete = (reflection: string) => {
    if (!todayMission) return;

    const newHistory = { ...userState.history };
    // Only give rewards if first time completing today
    if (!newHistory[todayStr]?.completed) {
      let newStreak = userState.currentStreak + 1;
      let newXp = userState.xp + 50;
      let newBadges = [...userState.badges];

      // Badge Logic
      if (newStreak >= 7 && !newBadges.includes(BADGES.STREAK_7.id)) newBadges.push(BADGES.STREAK_7.id);
      if (newStreak >= 14 && !newBadges.includes(BADGES.STREAK_14.id)) newBadges.push(BADGES.STREAK_14.id);
      if (newStreak >= 30 && !newBadges.includes(BADGES.STREAK_30.id)) newBadges.push(BADGES.STREAK_30.id);

      // Level Logic
      let newLevel = userState.level;
      while (newXp >= LEVEL_THRESHOLDS[newLevel]) {
        newLevel++;
      }

      const updatedUser: UserState = {
        ...userState,
        xp: newXp,
        level: newLevel,
        currentStreak: newStreak,
        maxStreak: Math.max(userState.maxStreak, newStreak),
        badges: newBadges,
        history: {
          ...newHistory,
          [todayStr]: {
            date: todayStr,
            completed: true,
            reflection,
          }
        }
      };
      saveUser(updatedUser);
    } else {
      // Just update reflection if already completed
      const updatedUser = {
         ...userState,
         history: {
           ...newHistory,
           [todayStr]: { ...newHistory[todayStr], reflection }
         }
      };
      saveUser(updatedUser);
    }
  };

  const handleQuizComplete = (score: number, incorrectTags: string[]) => {
    let newXp = userState.xp + score;
    let newLevel = userState.level;
    while (newXp >= LEVEL_THRESHOLDS[newLevel]) {
      newLevel++;
    }

    const newWeaknessTags = { ...userState.quizHistory.weaknessTags };
    incorrectTags.forEach(tag => {
      newWeaknessTags[tag] = (newWeaknessTags[tag] || 0) + 1;
    });
    
    let newBadges = [...userState.badges];
    if (score === 100 && !newBadges.includes(BADGES.QUIZ_ACE.id)) {
      newBadges.push(BADGES.QUIZ_ACE.id);
    }

    const updatedUser: UserState = {
      ...userState,
      xp: newXp,
      level: newLevel,
      badges: newBadges,
      quizHistory: {
        totalAttempted: userState.quizHistory.totalAttempted + 5,
        totalCorrect: userState.quizHistory.totalCorrect + (score / 20),
        weaknessTags: newWeaknessTags
      }
    };
    saveUser(updatedUser);
  };

  const isTodayCompleted = !!userState.history[todayStr]?.completed;

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">보안 습관 스트릭</h1>
              <p className="text-xs text-gray-500">{todayStr}</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex flex-col items-end">
                 <span className="text-xs text-gray-500 font-bold">LV.{userState.level}</span>
                 <span className="text-indigo-600 font-bold">{userState.xp} XP</span>
               </div>
               <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold text-sm">
                 🔥 {userState.currentStreak}
               </div>
            </div>
          </div>
          {/* Desktop Nav (Top) */}
          <nav className="hidden md:flex justify-center gap-2">
            <button 
              onClick={() => setActiveTab('mission')}
              className={`px-4 py-2 rounded-lg shadow-sm border transition ${activeTab === 'mission' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare size={18} />
                <span className="text-sm font-medium">미션</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg shadow-sm border transition ${activeTab === 'quiz' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap size={18} />
                <span className="text-sm font-medium">퀴즈</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg shadow-sm border transition ${activeTab === 'stats' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">리포트</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl p-4 flex-1">
        {activeTab === 'mission' && todayMission && (
          <DailyMission 
            mission={todayMission}
            isCompleted={isTodayCompleted}
            onComplete={handleMissionComplete}
            savedReflection={userState.history[todayStr]?.reflection}
          />
        )}
        {activeTab === 'quiz' && (
          <QuizSection onQuizComplete={handleQuizComplete} />
        )}
        {activeTab === 'stats' && (
          <StatsDashboard userState={userState} />
        )}
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:hidden z-20">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => setActiveTab('mission')}
            className={`flex flex-col items-center p-2 ${activeTab === 'mission' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <CheckSquare size={24} />
            <span className="text-xs mt-1">미션</span>
          </button>
          <button 
             onClick={() => setActiveTab('quiz')}
             className={`flex flex-col items-center p-2 ${activeTab === 'quiz' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <GraduationCap size={24} />
            <span className="text-xs mt-1">퀴즈</span>
          </button>
          <button 
             onClick={() => setActiveTab('stats')}
             className={`flex flex-col items-center p-2 ${activeTab === 'stats' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <LayoutDashboard size={24} />
            <span className="text-xs mt-1">리포트</span>
          </button>
        </div>
      </nav>

    </div>
  );
};

export default App;
