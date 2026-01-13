import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabMoreInfo from './components/TabMoreInfo';
import TabQuiz from './components/TabQuiz';
import TabDiscussion from './components/TabDiscussion';
import WrongAnswerNote from './components/WrongAnswerNote';
import { UserState, Tab } from './types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Gamepad2, 
  HelpCircle, 
  MessageCircle, 
  Menu,
  Coins,
  Award,
  AlertCircle
} from 'lucide-react';

const STORAGE_KEY = 'cafeteria-detective-data';

const INITIAL_STATE: UserState = {
  name: '',
  coins: 0,
  badges: [],
  level: 1,
  wrongAnswers: []
};

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWrongNote, setShowWrongNote] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserState(parsed);
        if (parsed.name) setIsLoggedIn(true);
      } catch (e) {
        console.error("Failed to load save data");
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    }
  }, [userState, isLoggedIn]);

  const handleStart = (name: string) => {
    setUserState(prev => ({ ...prev, name }));
    setIsLoggedIn(true);
  };

  const updateUserState = (newState: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...newState }));
  };

  const NAV_ITEMS = [
    { id: Tab.THEORY, label: '이론 학습', icon: <BookOpen className="w-5 h-5" /> },
    { id: Tab.SIMULATION, label: '탐정 미션', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: Tab.MORE_INFO, label: '더 알아보기', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: Tab.QUIZ, label: '최종 퀴즈', icon: <HelpCircle className="w-5 h-5" /> },
    { id: Tab.DISCUSSION, label: '토론하기', icon: <MessageCircle className="w-5 h-5" /> },
  ];

  if (!isLoggedIn) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-2 rounded-lg font-bold">🔍 탐정</span>
            <h1 className="font-bold text-lg hidden md:block">급식실 데이터 대작전</h1>
          </div>

          <div className="flex items-center gap-4">
             {/* Stats */}
             <div className="flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                  <Coins className="w-4 h-4" /> 
                  <span>{userState.coins}</span>
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                  <Award className="w-4 h-4" />
                  <span>Lv.{userState.level}</span>
                </div>
             </div>
             
             <button 
               onClick={() => setShowWrongNote(true)}
               className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative"
               title="오답 노트"
             >
               <AlertCircle className="w-6 h-6" />
               {userState.wrongAnswers.length > 0 && (
                 <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
               )}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-6">
           <h2 className="text-2xl font-bold text-slate-800">
             {NAV_ITEMS.find(i => i.id === activeTab)?.label}
           </h2>
           <p className="text-slate-500">
             안녕하세요, {userState.name} 탐정님! 오늘도 데이터를 수집해볼까요?
           </p>
        </div>

        {activeTab === Tab.THEORY && <TabTheory />}
        {activeTab === Tab.SIMULATION && <TabSimulation userState={userState} updateUserState={updateUserState} />}
        {activeTab === Tab.MORE_INFO && <TabMoreInfo />}
        {activeTab === Tab.QUIZ && <TabQuiz userState={userState} updateUserState={updateUserState} />}
        {activeTab === Tab.DISCUSSION && <TabDiscussion />}
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 md:hidden">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation (Sidebar - simulated here as top tabs for simplicity in single layout, or just keep header + content) 
          Actually, let's add a simple tab bar for desktop below header if needed, but the bottom nav handles mobile.
          Let's add a desktop sidebar or top nav. I'll stick to a top nav below header for desktop.
      */}
      <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 p-4">
         <div className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition font-medium ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
         </div>

         <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" /> 내 배지
            </h4>
            <div className="flex flex-wrap gap-2">
              {userState.badges.length > 0 ? userState.badges.map((badge, idx) => (
                <span key={idx} className="text-xs bg-white px-2 py-1 rounded-md border border-amber-200 text-amber-600 font-bold shadow-sm">
                  {badge}
                </span>
              )) : (
                <span className="text-xs text-amber-600/60">아직 획득한 배지가 없어요.</span>
              )}
            </div>
         </div>
      </div>

      <div className="hidden md:block ml-64">
         {/* Spacing for desktop content to not hide behind fixed sidebar */}
      </div>

      {/* Modals */}
      {showWrongNote && (
        <WrongAnswerNote userState={userState} onClose={() => setShowWrongNote(false)} />
      )}
    </div>
  );
};

export default App;
