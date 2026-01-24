import React, { useState, useEffect } from 'react';
import { ViewState, CharterData, UserProgress } from './types';
import { INITIAL_CHARTER } from './constants';
import { loadCharter, loadProgress, saveCharter, saveProgress, updateStreak } from './services/storageService';
import { Wizard } from './components/Wizard';
import { Theory } from './components/Theory';
import { Quiz } from './components/Quiz';
import { Reflection } from './components/Reflection';
import { 
  BookOpen, 
  PenTool, 
  Award, 
  HelpCircle, 
  LayoutDashboard,
  Trophy,
  Flame,
  History
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [charterData, setCharterData] = useState<CharterData>(INITIAL_CHARTER);
  const [progress, setProgress] = useState<UserProgress>({
    badges: [],
    quizScore: 0,
    streak: 0,
    lastVisit: Date.now(),
    history: [],
    quizMistakes: []
  });

  useEffect(() => {
    updateStreak();
    const savedCharter = loadCharter();
    if (savedCharter) setCharterData(savedCharter);
    
    const savedProgress = loadProgress();
    setProgress(savedProgress);
  }, []);

  const handleUpdateCharter = (newData: CharterData) => {
    setCharterData(newData);
    // Add badge if charter is fully filled (simple check)
    if (
      newData.target.length > 0 &&
      newData.permissions.length > 0 &&
      newData.security.length > 0 &&
      !progress.badges.includes('규칙 설계자')
    ) {
      const newBadges = [...progress.badges, '규칙 설계자'];
      const newProgress = { ...progress, badges: newBadges };
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.THEORY:
        return <Theory />;
      case ViewState.QUIZ:
        return <Quiz progress={progress} onUpdateProgress={setProgress} onGoToWizard={() => setView(ViewState.WIZARD)} />;
      case ViewState.WIZARD:
        return <Wizard initialData={charterData} progress={progress} onUpdateCharter={handleUpdateCharter} />;
      case ViewState.REFLECTION:
        return <Reflection />;
      case ViewState.DASHBOARD:
      default:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-4 bg-orange-100 rounded-full text-orange-600">
                  <Flame className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold">연속 학습</p>
                  <p className="text-2xl font-black text-slate-800">{progress.streak}일 째</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-4 bg-indigo-100 rounded-full text-indigo-600">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold">퀴즈 점수</p>
                  <p className="text-2xl font-black text-slate-800">{progress.quizScore}점</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-4 bg-emerald-100 rounded-full text-emerald-600">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold">획득 배지</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {progress.badges.length > 0 ? progress.badges.map(b => (
                      <span key={b} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                        {b}
                      </span>
                    )) : <span className="text-xs text-slate-400">아직 없음</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <button 
                onClick={() => setView(ViewState.THEORY)}
                className="group p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-left"
              >
                <BookOpen className="w-10 h-10 mb-4 opacity-80 group-hover:scale-110 transition" />
                <h3 className="text-2xl font-bold mb-2">개념 학습하기</h3>
                <p className="opacity-90">공유, 권한, 보안의 기초를 배워보세요.</p>
              </button>

              <button 
                 onClick={() => setView(ViewState.WIZARD)}
                 className="group p-8 bg-white border-2 border-slate-200 rounded-3xl text-slate-800 shadow-sm hover:border-indigo-500 hover:shadow-xl transition-all hover:-translate-y-1 text-left"
              >
                <PenTool className="w-10 h-10 mb-4 text-indigo-600 group-hover:scale-110 transition" />
                <h3 className="text-2xl font-bold mb-2">헌장 만들기 위저드</h3>
                <p className="text-slate-500">단계별로 우리 반만의 규칙을 설계하세요.</p>
              </button>
            </div>

             {/* History */}
             <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-400" /> 최근 활동 기록
                </h3>
                {progress.history.length > 0 ? (
                  <ul className="space-y-3">
                    {progress.history.map((h, i) => (
                      <li key={i} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-700">헌장 수정됨</span>
                        <span className="text-slate-400">{new Date(h.timestamp).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-slate-400 text-sm">아직 활동 기록이 없습니다.</p>}
             </div>
          </div>
        );
    }
  };

  const navItems = [
    { id: ViewState.DASHBOARD, label: '대시보드', icon: LayoutDashboard },
    { id: ViewState.THEORY, label: '개념 학습', icon: BookOpen },
    { id: ViewState.QUIZ, label: '퀴즈', icon: Award },
    { id: ViewState.WIZARD, label: '헌장 위저드', icon: PenTool },
    { id: ViewState.REFLECTION, label: '생각해보기', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-tight">우리 반 공유 헌장 만들기</h1>
              <p className="text-xs text-slate-500">협업 규칙 위저드</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              {progress.badges.map((b, i) => (
                <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-200 shadow-sm">
                  {b}
                </span>
              ))}
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">STREAK</div>
              <div className="font-bold text-indigo-600">{progress.streak}일</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
                  view === item.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
