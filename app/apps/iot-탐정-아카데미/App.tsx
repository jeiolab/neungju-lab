import React, { useState, useEffect } from 'react';
import { BadgeType, TabType, UserState } from './types';
import { CONCEPT_CARDS } from './constants';
import TabConcepts from './components/TabConcepts';
import TabSimulation from './components/TabSimulation';
import TabQuiz from './components/TabQuiz';
import TabDeepDive from './components/TabDeepDive';
import TabReflection from './components/TabReflection';
import { 
  Search, 
  Activity, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  Award, 
  User, 
  Menu
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('concepts');
  const [user, setUser] = useState<UserState>({
    name: '',
    isRegistered: false,
    streak: 1,
    lastLoginDate: null,
    completedConcepts: [],
    badges: [],
    quizScore: 0,
    wrongAnswers: []
  });

  // Load from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('iot-detective-user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Simple streak logic
      const today = new Date().toDateString();
      let newStreak = parsed.streak;
      if (parsed.lastLoginDate !== today) {
        // If last login was yesterday (simplified), increment. 
        // Real logic would check consecutive days. For now just increment if different day.
        newStreak += 1;
      }
      
      setUser({
        ...parsed,
        streak: newStreak,
        lastLoginDate: today
      });
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (user.isRegistered) {
      localStorage.setItem('iot-detective-user', JSON.stringify(user));
    }
  }, [user]);

  const handleRegister = (name: string) => {
    if (!name.trim()) return;
    setUser(prev => ({
      ...prev,
      name,
      isRegistered: true,
      lastLoginDate: new Date().toDateString(),
      badges: [BadgeType.NEWBIE]
    }));
  };

  const handleConceptComplete = (id: string) => {
    setUser(prev => {
      const newCompleted = [...prev.completedConcepts, id];
      const newBadges = [...prev.badges];
      
      // Check for 'Clue Finder' badge
      if (newCompleted.length === CONCEPT_CARDS.length && !newBadges.includes(BadgeType.CLUE_FINDER)) {
        newBadges.push(BadgeType.CLUE_FINDER);
        alert(`🎉 축하합니다! 모든 단서를 찾았습니다. [${BadgeType.CLUE_FINDER}] 배지 획득!`);
      }

      return {
        ...prev,
        completedConcepts: newCompleted,
        badges: newBadges
      };
    });
  };

  const handleQuizComplete = (score: number, wrongIds: number[]) => {
    setUser(prev => {
      const newBadges = [...prev.badges];
      // Check for 'Master Detective' badge
      // Using 7 as total questions based on constants
      if (score === 7 && !newBadges.includes(BadgeType.MASTER_DETECTIVE)) {
        newBadges.push(BadgeType.MASTER_DETECTIVE);
        alert(`🎉 대단합니다! 퀴즈 만점입니다. [${BadgeType.MASTER_DETECTIVE}] 배지 획득!`);
      }

      return {
        ...prev,
        quizScore: score,
        wrongAnswers: wrongIds,
        badges: newBadges
      };
    });
  };

  if (!user.isRegistered) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">IoT 탐정 아카데미</h1>
          <p className="text-slate-600 mb-8">
            연결된 세상의 비밀을 파헤칠 준비가 되셨나요?
            <br />
            탐정님의 이름을 알려주세요.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem('username') as HTMLInputElement).value;
              handleRegister(input);
            }}
          >
            <input 
              name="username"
              type="text" 
              placeholder="이름 입력 (예: 김탐정)" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold text-lg hover:bg-slate-700 transition transform hover:scale-[1.02]"
            >
              입학하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
               <Search className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden md:block">IoT 탐정 아카데미</span>
          </div>

          <div className="flex items-center gap-4">
             {/* Badge Display (Mobile condensed, Desktop expanded) */}
             <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
               <Award className="w-4 h-4 text-orange-500" />
               <span className="text-sm font-bold text-slate-700">{user.badges.length}</span>
               <div className="hidden md:flex gap-1 ml-2">
                 {user.badges.map((b, i) => (
                   <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 rounded text-slate-500">{b}</span>
                 ))}
               </div>
             </div>

             <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                 <User className="w-5 h-5" />
               </div>
               <div className="hidden sm:block text-sm text-right leading-tight">
                 <div className="font-bold text-slate-800">{user.name} 탐정</div>
                 <div className="text-xs text-slate-500">Day {user.streak}</div>
               </div>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2">
            {[
              { id: 'concepts', label: '단서 수집', icon: Search },
              { id: 'simulation', label: '현장 실습', icon: Activity },
              { id: 'deepdive', label: '사건 기록', icon: BookOpen },
              { id: 'quiz', label: '자격 시험', icon: HelpCircle },
              { id: 'reflection', label: '탐정 노트', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in-up">
          {activeTab === 'concepts' && (
            <TabConcepts 
              completedConcepts={user.completedConcepts}
              onConceptComplete={handleConceptComplete}
            />
          )}
          {activeTab === 'simulation' && <TabSimulation />}
          {activeTab === 'deepdive' && <TabDeepDive />}
          {activeTab === 'quiz' && (
            <TabQuiz 
              onQuizComplete={handleQuizComplete}
              previousScore={user.quizScore}
            />
          )}
          {activeTab === 'reflection' && <TabReflection />}
        </div>
      </main>
    </div>
  );
};

export default App;