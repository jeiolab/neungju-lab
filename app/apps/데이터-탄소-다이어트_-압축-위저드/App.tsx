import React, { useState, useEffect } from 'react';
import { AppView, UserState, STORAGE_KEYS, ProjectDraft } from './types';
import { BADGE_LIST, THEORY_CARDS, DAILY_MISSIONS, CHECKLIST_ITEMS, QUIZ_DATA } from './constants';
import { getStoredData, setStoredData, updateChecklist, updateStreak } from './services/storageService';
import ProjectWizard from './components/ProjectWizard';
import ReportView from './components/ReportView';
import Simulation from './components/Simulation';
import { 
  Leaf, 
  Wind, 
  CheckSquare, 
  Brain, 
  Home, 
  Award, 
  Flame,
  ChevronRight,
  Menu,
  X,
  Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [userState, setUserState] = useState<UserState>({
    streak: 0,
    lastLogin: '',
    badges: [],
    checklist: [],
    quizMastery: {},
    wrongNotes: [],
  });
  const [currentProject, setCurrentProject] = useState<ProjectDraft | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dailyMission, setDailyMission] = useState("");

  // Initial Load
  useEffect(() => {
    const streak = updateStreak();
    const badges = getStoredData<string[]>(STORAGE_KEYS.BADGES, []);
    const checklist = getStoredData<boolean[]>(STORAGE_KEYS.CHECKLIST, new Array(CHECKLIST_ITEMS.length).fill(false));
    const mastery = getStoredData<Record<number, boolean>>(STORAGE_KEYS.MASTERY, {});
    
    setUserState({
      streak,
      lastLogin: new Date().toDateString(),
      badges,
      checklist,
      quizMastery: mastery,
      wrongNotes: getStoredData<number[]>(STORAGE_KEYS.WRONG_NOTES, []),
    });

    // Generate Daily Mission based on date hash
    const today = new Date().getDate();
    setDailyMission(DAILY_MISSIONS[today % DAILY_MISSIONS.length]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChecklistToggle = (index: number) => {
    const newList = updateChecklist(index, !userState.checklist[index]);
    setUserState(prev => ({ ...prev, checklist: newList }));
    
    // Check badges dynamically (simple check)
    const checkedCount = newList.filter(Boolean).length;
    if (checkedCount / CHECKLIST_ITEMS.length >= 0.8 && !userState.badges.includes('diet_master')) {
        // Force reload badges next render or optimize state update
        const updatedBadges = getStoredData<string[]>(STORAGE_KEYS.BADGES, []);
        setUserState(prev => ({...prev, badges: updatedBadges}));
    }
  };

  const handleQuizAnswer = (qId: number, isCorrect: boolean) => {
    const newMastery = { ...userState.quizMastery, [qId]: isCorrect };
    setStoredData(STORAGE_KEYS.MASTERY, newMastery);
    
    let newWrongNotes = [...userState.wrongNotes];
    if (!isCorrect && !newWrongNotes.includes(qId)) {
        newWrongNotes.push(qId);
        setStoredData(STORAGE_KEYS.WRONG_NOTES, newWrongNotes);
    } else if (isCorrect) {
        newWrongNotes = newWrongNotes.filter(id => id !== qId);
        setStoredData(STORAGE_KEYS.WRONG_NOTES, newWrongNotes);
    }

    setUserState(prev => ({
        ...prev,
        quizMastery: newMastery,
        wrongNotes: newWrongNotes
    }));
  };

  const renderHome = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">데이터를 줄이면,<br/>지구가 건강해집니다.</h1>
          <p className="text-emerald-50 mb-6 max-w-lg">
            우리가 사용하는 모든 데이터는 에너지를 소모합니다. <br/>
            압축 기술을 통해 디지털 탄소 발자국을 줄이는 프로젝트를 시작해보세요.
          </p>
          <button 
            onClick={() => setView(AppView.WIZARD)}
            className="bg-white text-emerald-700 font-bold py-3 px-6 rounded-full hover:bg-emerald-50 transition shadow-md flex items-center gap-2"
          >
            프로젝트 시작하기 <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <Leaf className="absolute right-0 bottom-0 text-emerald-400 opacity-20 w-64 h-64 -mr-10 -mb-10" />
      </section>

      {/* Daily Mission */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-800">오늘의 미션 (Streak: {userState.streak}일째)</h2>
        </div>
        <p className="text-gray-600 bg-orange-50 p-4 rounded-xl border border-orange-100">
          {dailyMission}
        </p>
      </section>

      {/* Theory Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        {THEORY_CARDS.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100" onClick={() => setView(AppView.THEORY)}>
             <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-blue-600">
                {idx === 0 ? <Leaf /> : idx === 1 ? <Zap /> : <Brain />}
             </div>
             <h3 className="font-bold text-gray-800 mb-2">{card.title}</h3>
             <p className="text-sm text-gray-500 line-clamp-3">{card.content}</p>
          </div>
        ))}
      </section>
    </div>
  );

  const renderQuiz = () => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    
    const question = QUIZ_DATA[currentQIndex];
    const isMastered = userState.quizMastery[question.id];

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">퀴즈 챌린지</h2>
          <span className="text-sm font-mono text-gray-500">{currentQIndex + 1} / {QUIZ_DATA.length}</span>
        </div>

        <div className="mb-8">
           <div className="flex gap-2 mb-3">
             <span className={`text-xs px-2 py-1 rounded font-bold ${question.difficulty === 'EASY' ? 'bg-green-100 text-green-700' : question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
               {question.difficulty}
             </span>
             {isMastered && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold">마스터함</span>}
           </div>
           <p className="text-lg font-medium text-gray-800">{question.question}</p>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                const correct = idx === question.correctIndex;
                handleQuizAnswer(question.id, correct);
                if (correct) {
                   alert("정답입니다! 🎉");
                   if(currentQIndex < QUIZ_DATA.length - 1) {
                       setCurrentQIndex(prev => prev + 1);
                       setShowExplanation(false);
                   }
                } else {
                   alert("틀렸습니다. 다시 생각해보세요! 🤔");
                   setShowExplanation(true);
                }
              }}
              className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition"
            >
              {opt}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 animate-fadeIn">
            <p className="text-sm text-blue-800 font-bold mb-1">💡 해설</p>
            <p className="text-sm text-blue-700">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-between mt-8 border-t pt-6">
           <button onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))} className="text-gray-500 hover:text-gray-800">이전 문제</button>
           <button onClick={() => setCurrentQIndex(Math.min(QUIZ_DATA.length - 1, currentQIndex + 1))} className="text-gray-500 hover:text-gray-800">다음 문제</button>
        </div>
      </div>
    );
  };

  const renderChecklist = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
       <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
         <CheckSquare className="text-emerald-500"/> 친환경 데이터 습관
       </h2>
       <div className="space-y-4">
         {CHECKLIST_ITEMS.map((item, idx) => (
           <label key={idx} className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
             <input
               type="checkbox"
               checked={userState.checklist[idx]}
               onChange={() => handleChecklistToggle(idx)}
               className="w-6 h-6 text-emerald-600 rounded focus:ring-emerald-500 mr-4"
             />
             <span className={`${userState.checklist[idx] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{item}</span>
           </label>
         ))}
       </div>
       <div className="mt-8 bg-gray-100 rounded-xl p-4">
          <p className="text-center text-sm text-gray-500">
             80% 이상 달성하면 '데이터 다이어터' 배지를 획득할 수 있어요!
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(userState.checklist.filter(Boolean).length / CHECKLIST_ITEMS.length) * 100}%` }}
            ></div>
          </div>
       </div>
    </div>
  );

  const renderContent = () => {
    if (currentProject && view === AppView.WIZARD) {
       // Should show Report View if wizard just finished, but logic handles this via state transition
       return <ReportView project={currentProject} onClose={() => { setCurrentProject(null); setView(AppView.HOME); }} />;
    }

    switch (view) {
      case AppView.HOME: return renderHome();
      case AppView.WIZARD: return <ProjectWizard onComplete={(p) => { setCurrentProject(p); }} />;
      case AppView.SIMULATION: return <Simulation />;
      case AppView.QUIZ: return renderQuiz();
      case AppView.CHECKLIST: return renderChecklist();
      case AppView.THEORY: 
        return (
          <div className="grid gap-6">
            {THEORY_CARDS.map((card, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-md">
                 <h3 className="text-2xl font-bold text-gray-800 mb-4">{card.title}</h3>
                 <p className="text-lg text-gray-600 leading-relaxed">{card.content}</p>
              </div>
            ))}
            <button onClick={() => setView(AppView.HOME)} className="mt-4 text-center text-blue-600 hover:underline">홈으로 돌아가기</button>
          </div>
        );
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.HOME)}>
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
               <Leaf size={20} />
            </div>
            <span className="font-bold text-lg text-slate-800 hidden sm:block">데이터 탄소 다이어트</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            <button onClick={() => setView(AppView.SIMULATION)} className={`text-sm font-medium ${view === AppView.SIMULATION ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}>시뮬레이션</button>
            <button onClick={() => setView(AppView.QUIZ)} className={`text-sm font-medium ${view === AppView.QUIZ ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}>퀴즈</button>
            <button onClick={() => setView(AppView.CHECKLIST)} className={`text-sm font-medium ${view === AppView.CHECKLIST ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}>체크리스트</button>
          </nav>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full text-sm font-bold" title="연속 접속일">
               <Flame size={16} /> {userState.streak}
             </div>
             <div className="flex -space-x-2">
                {userState.badges.map(bId => {
                   const badge = BADGE_LIST.find(b => b.id === bId);
                   if(!badge) return null;
                   return (
                     <div key={bId} className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-white flex items-center justify-center text-yellow-600" title={badge.name}>
                       <Award size={16} />
                     </div>
                   )
                })}
             </div>
             <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>
        
        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-lg animate-slideDown">
            <button onClick={() => { setView(AppView.SIMULATION); setMobileMenuOpen(false); }} className="block w-full text-left font-medium text-gray-600">시뮬레이션</button>
            <button onClick={() => { setView(AppView.QUIZ); setMobileMenuOpen(false); }} className="block w-full text-left font-medium text-gray-600">퀴즈</button>
            <button onClick={() => { setView(AppView.CHECKLIST); setMobileMenuOpen(false); }} className="block w-full text-left font-medium text-gray-600">체크리스트</button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-8 text-center text-sm text-gray-500">
        <p>© 2024 데이터 탄소 다이어트 프로젝트.</p>
        <p className="mt-1">데이터를 효율적으로 사용하여 지구를 지켜요.</p>
      </footer>
    </div>
  );
};

export default App;