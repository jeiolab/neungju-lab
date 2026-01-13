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

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-20 lg:w-64 bg-slate-900 text-white flex md:flex-col justify-between p-4 no-print shrink-0">
        <div className="flex items-center gap-3 md:flex-col md:items-start lg:items-center lg:flex-row mb-0 md:mb-8">
           <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/50">
             C
           </div>
           <span className="font-bold text-lg hidden lg:block">ClassCharter</span>
        </div>

        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible w-full">
          {[
            { id: ViewState.DASHBOARD, label: '대시보드', icon: LayoutDashboard },
            { id: ViewState.THEORY, label: '개념 학습', icon: BookOpen },
            { id: ViewState.QUIZ, label: '퀴즈', icon: Award },
            { id: ViewState.WIZARD, label: '헌장 위저드', icon: PenTool },
            { id: ViewState.REFLECTION, label: '생각해보기', icon: HelpCircle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left whitespace-nowrap ${
                view === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:block font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="hidden md:block text-xs text-slate-500 mt-auto pt-8">
           <p>v1.0.0</p>
           <p>© 2024 SchoolWizard</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow h-screen overflow-auto p-4 md:p-8 print:p-0 print:h-auto print:overflow-visible">
        <header className="mb-8 flex justify-between items-center no-print">
           <div>
             <h1 className="text-2xl font-bold text-slate-900">
               {view === ViewState.DASHBOARD && '나의 학습 현황'}
               {view === ViewState.THEORY && '공유의 핵심 이론'}
               {view === ViewState.QUIZ && '실력 확인 퀴즈'}
               {view === ViewState.WIZARD && '헌장 만들기'}
               {view === ViewState.REFLECTION && '깊게 생각하기'}
             </h1>
             <p className="text-slate-500 text-sm">
               {view === ViewState.DASHBOARD && '오늘도 안전한 공유 습관을 길러봐요!'}
               {view === ViewState.WIZARD && '단계별로 선택하여 1분 만에 문서를 완성하세요.'}
             </p>
           </div>
           
           {/* Simple User Profile/Status */}
           <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-800">학생</p>
               <p className="text-xs text-slate-500">{progress.badges.length} Badges</p>
             </div>
             <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
               <img src="https://picsum.photos/200/200" alt="Avatar" className="w-full h-full object-cover" />
             </div>
           </div>
        </header>

        <div className="max-w-6xl mx-auto h-full">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;