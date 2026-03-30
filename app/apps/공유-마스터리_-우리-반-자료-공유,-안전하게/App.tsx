import React, { useState, useEffect } from 'react';
import { UserState, STORAGE_KEY, WrongNoteItem, Difficulty } from './types';
import { CONCEPT_CARDS, BADGES } from './constants';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';
import DashboardTab from './components/DashboardTab';
import { BookOpen, Activity, Search, HelpCircle, PenTool, Medal, Award, Flame } from 'lucide-react';

// 초기 상태
const INITIAL_STATE: UserState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: '',
  masteryMap: {},
  wrongNote: [],
  badges: [],
  quizHistory: []
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [showBadgeModal, setShowBadgeModal] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Streak calculation logic
      const today = new Date().toDateString();
      let newStreak = parsed.streak;
      
      if (parsed.lastLoginDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (parsed.lastLoginDate === yesterday.toDateString()) {
          newStreak += 1;
        } else if (parsed.lastLoginDate !== today) {
           // If missed a day (and not first login), reset? 
           // For friendly ed-tech, maybe just keep it or reset. Let's reset if gap > 1 day.
           const lastDate = new Date(parsed.lastLoginDate);
           const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
           if (diffDays > 1) newStreak = 1;
           else newStreak += 1;
        }
      }
      
      setUserState({ ...parsed, streak: newStreak, lastLoginDate: today });
    } else {
      // First time
      const today = new Date().toDateString();
      setUserState({ ...INITIAL_STATE, lastLoginDate: today, streak: 1 });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    checkBadges();
  }, [userState.xp, userState.masteryMap, userState.quizHistory]);

  const checkBadges = () => {
    let newBadges: string[] = [];
    BADGES.forEach(badge => {
      if (!userState.badges.includes(badge.id) && badge.condition(userState)) {
        newBadges.push(badge.id);
        setShowBadgeModal(badge.name); // Show alert
        setTimeout(() => setShowBadgeModal(null), 3000);
      }
    });

    if (newBadges.length > 0) {
      setUserState(prev => ({ ...prev, badges: [...prev.badges, ...newBadges], xp: prev.xp + 50 }));
    }
  };

  // 마스터리 업데이트 핸들러
  const handleUpdateMastery = (cardId: string, change: number) => {
    setUserState(prev => {
      const currentScore = prev.masteryMap[cardId] || 0;
      const newScore = Math.min(100, Math.max(0, currentScore + change));
      
      // XP Logic: Learning gives small XP
      const xpGain = change > 0 ? 5 : 0;
      
      return {
        ...prev,
        masteryMap: { ...prev.masteryMap, [cardId]: newScore },
        xp: prev.xp + xpGain,
        level: Math.floor((prev.xp + xpGain) / 100) + 1
      };
    });
  };

  // 퀴즈 완료 핸들러
  const handleQuizComplete = (score: number, difficulty: Difficulty, wrongItems: WrongNoteItem[]) => {
    setUserState(prev => {
        // Update mastery based on wrong items (decrease) and correct items implicitly (concept not in wrong list gets boost?)
        // Simple logic: 
        // Correct answers -> Related Concept +10
        // Wrong answers -> Related Concept -5
        
        const newMastery = { ...prev.masteryMap };
        
        // Decrease for wrong
        wrongItems.forEach(item => {
            const current = newMastery[item.conceptId] || 0;
            newMastery[item.conceptId] = Math.max(0, current - 5);
        });

        // Increase for correct (Need to know which questions were in the quiz, assume logic is handled here for simplicity or derived)
        // For this demo, we just rely on the score to give generic XP. 
        // *Ideally*, we would iterate all questions in the quiz session.
        
        return {
            ...prev,
            xp: prev.xp + score,
            level: Math.floor((prev.xp + score) / 100) + 1,
            quizHistory: [...prev.quizHistory, { timestamp: Date.now(), score, difficulty }],
            wrongNote: [...prev.wrongNote, ...wrongItems],
            masteryMap: newMastery
        };
    });
  };

  const tabs = [
    { id: 'theory', label: '이론 개념', icon: BookOpen },
    { id: 'sim', label: '시뮬레이션', icon: Activity },
    { id: 'deep', label: '더 알아보기', icon: Search },
    { id: 'quiz', label: '퀴즈', icon: HelpCircle },
    { id: 'think', label: '생각해보기', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg font-bold text-lg">NM</div>
            <h1 className="font-bold text-lg md:text-xl text-slate-800 hidden md:block">공유 마스터리</h1>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1 text-slate-600">
              <Award size={18} className="text-yellow-500" />
              <span>Lv.{userState.level}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <div className="bg-blue-100 px-2 py-0.5 rounded text-blue-700">{userState.xp} XP</div>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Flame size={18} className="text-orange-500" />
              <span>{userState.streak}일</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        
        {/* Badge Alert Modal */}
        {showBadgeModal && (
          <div className="fixed top-20 right-4 bg-yellow-500 text-white p-4 rounded-xl shadow-xl animate-bounce flex items-center gap-3 z-50">
            <Medal size={32} className="text-yellow-100" />
            <div>
              <p className="font-bold text-sm">배지 획득!</p>
              <p className="font-black text-lg">{showBadgeModal}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation (Scrollable on mobile) */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200 scale-105' 
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up">
          {activeTab === 'theory' && (
            <div className="space-y-8">
              <TheoryTab masteryMap={userState.masteryMap} onUpdateMastery={handleUpdateMastery} />
              <DashboardTab userState={userState} />
            </div>
          )}
          {activeTab === 'sim' && <SimulationTab />}
          {activeTab === 'deep' && <DeepDiveTab />}
          {activeTab === 'quiz' && <QuizTab onCompleteQuiz={handleQuizComplete} wrongNote={userState.wrongNote} />}
          {activeTab === 'think' && <ThinkingTab />}
        </div>
      </main>
    </div>
  );
};

export default App;