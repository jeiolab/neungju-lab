import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlayCircle, BookOpen, GraduationCap, Trophy, User } from 'lucide-react';
import Simulation from './components/Simulation';
import Quiz from './components/Quiz';
import { Page, UserStats } from './types';
import { THEORY_CARDS } from './constants';

function App() {
  const [page, setPage] = useState<Page>(Page.Home);
  const [stats, setStats] = useState<UserStats>({
    totalScore: 0,
    quizzesSolved: 0,
    badges: [],
    history: []
  });

  // Load stats from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mlChallengeStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    localStorage.setItem('mlChallengeStats', JSON.stringify(stats));
  }, [stats]);

  const handleSimComplete = (score: number, scenarioId: string) => {
    const newHistory = [...stats.history, { scenarioId, score, timestamp: Date.now() }];
    const newTotalScore = stats.totalScore + score;
    let newBadges = [...stats.badges];

    if (score >= 90 && !newBadges.includes('Master of Balance')) {
        newBadges.push('Master of Balance');
    }
    if (newHistory.length >= 5 && !newBadges.includes('Beginner Data Scientist')) {
        newBadges.push('Beginner Data Scientist');
    }

    setStats({
      ...stats,
      totalScore: newTotalScore,
      history: newHistory,
      badges: newBadges
    });
  };

  const handleQuizComplete = (score: number) => {
    setStats({
        ...stats,
        quizzesSolved: stats.quizzesSolved + 1,
        totalScore: stats.totalScore + (score * 10)
    });
  };

  const renderContent = () => {
    switch (page) {
      case Page.Home:
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-indigo-600 rounded-3xl p-10 text-white mb-10 shadow-xl">
              <h1 className="text-4xl font-black mb-4">모델 선택 트레이드오프 챌린지</h1>
              <p className="text-lg opacity-90 mb-8">
                당신은 의사결정 코치입니다. 현실적인 제약 속에서 최고의 머신러닝 모델을 선택하고, 
                그 선택에 대한 대가(Trade-off)를 경험해보세요.
              </p>
              <button 
                onClick={() => setPage(Page.Simulation)}
                className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition"
              >
                챌린지 시작하기
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer" onClick={() => setPage(Page.Theory)}>
                  <BookOpen className="text-blue-500 mb-4" size={32} />
                  <h3 className="font-bold text-xl mb-2">이론 학습</h3>
                  <p className="text-slate-500 text-sm">기계학습의 기초와 모델별 특징을 빠르게 익혀보세요.</p>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer" onClick={() => setPage(Page.Simulation)}>
                  <PlayCircle className="text-purple-500 mb-4" size={32} />
                  <h3 className="font-bold text-xl mb-2">시뮬레이션</h3>
                  <p className="text-slate-500 text-sm">다양한 시나리오에서 최적의 모델을 선택하고 점수를 받으세요.</p>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer" onClick={() => setPage(Page.Quiz)}>
                  <GraduationCap className="text-green-500 mb-4" size={32} />
                  <h3 className="font-bold text-xl mb-2">퀴즈</h3>
                  <p className="text-slate-500 text-sm">배운 내용을 10개의 퀴즈로 확인해보세요.</p>
               </div>
            </div>
          </div>
        );
      case Page.Simulation:
        return <Simulation onComplete={handleSimComplete} />;
      case Page.Quiz:
        return <Quiz onComplete={handleQuizComplete} />;
      case Page.Theory:
        return (
            <div className="p-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <h2 className="text-2xl font-bold col-span-full mb-4">기초 이론</h2>
                {THEORY_CARDS.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg text-indigo-700 mb-3">{card.title}</h3>
                        <p className="text-slate-700 leading-relaxed">{card.content}</p>
                    </div>
                ))}
            </div>
        );
      case Page.Profile:
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">내 프로필</h2>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <User size={32} className="text-slate-400" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Total Score</div>
                            <div className="text-3xl font-black text-indigo-600">{stats.totalScore}</div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2"><Trophy size={18} className="text-yellow-500"/> 획득 배지</h4>
                        <div className="flex flex-wrap gap-2">
                            {stats.badges.length > 0 ? stats.badges.map(b => (
                                <span key={b} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">{b}</span>
                            )) : <span className="text-slate-400 text-sm">아직 배지가 없습니다.</span>}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h4 className="font-bold text-slate-700 mb-4">최근 활동</h4>
                    <ul className="space-y-3">
                        {stats.history.slice().reverse().slice(0, 5).map((h, i) => (
                            <li key={i} className="flex justify-between text-sm border-b pb-2 last:border-0">
                                <span className="text-slate-600">Scenario #{h.scenarioId}</span>
                                <span className="font-bold text-indigo-600">{h.score}점</span>
                            </li>
                        ))}
                        {stats.history.length === 0 && <li className="text-slate-400 text-sm">기록이 없습니다.</li>}
                    </ul>
                </div>
            </div>
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between py-6">
        <div className="flex flex-col items-center md:items-start px-0 md:px-6">
          <div className="font-black text-2xl text-indigo-600 mb-10 hidden md:block">ML Challenge</div>
          <div className="font-black text-xl text-indigo-600 mb-10 md:hidden">ML</div>
          
          <nav className="space-y-2 w-full">
            {[
                { id: Page.Home, label: '홈', icon: LayoutDashboard },
                { id: Page.Simulation, label: '시뮬레이션', icon: PlayCircle },
                { id: Page.Theory, label: '이론', icon: BookOpen },
                { id: Page.Quiz, label: '퀴즈', icon: GraduationCap },
                { id: Page.Profile, label: '프로필', icon: User },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setPage(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                        page === item.id 
                        ? 'bg-indigo-50 text-indigo-600 font-bold' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <item.icon size={20} />
                    <span className="hidden md:block">{item.label}</span>
                </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;