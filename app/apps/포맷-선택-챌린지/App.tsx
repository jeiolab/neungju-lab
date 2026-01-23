import React, { useState, useEffect } from 'react';
import { View, UserProgress, GameResult } from './types';
import { BADGES, MISSIONS } from './constants';
import { getInitialProgress, saveProgress, calculateLevel, updateStreak, getDailyMission } from './utils';
import Game from './components/Game';
import Theory from './components/Theory';
import Quiz from './components/Quiz';
import LearnMore from './components/LearnMore';
import Reflection from './components/Reflection';
import { LayoutGrid, BookOpen, PlayCircle, GraduationCap, PenTool, Lightbulb, Trophy, Star, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress());
  const [dailyMission, setDailyMission] = useState(getDailyMission(MISSIONS));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Update streak on mount
    const updated = updateStreak(progress);
    if (updated.streak !== progress.streak || updated.lastLoginDate !== progress.lastLoginDate) {
      setProgress(updated);
      saveProgress(updated);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGameComplete = (results: GameResult[]) => {
    const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
    const newWrongNotes = [...progress.wrongNotes];
    
    // Update wrong notes logic
    results.forEach(r => {
      if (!r.isCorrect && !newWrongNotes.includes(r.missionId)) {
        newWrongNotes.push(r.missionId);
      } else if (r.isCorrect) {
        // Remove from wrong notes if answered correctly this time (optional mechanic, keep simple for now)
      }
    });

    const newXp = progress.xp + totalPoints;
    const newLevel = calculateLevel(newXp);
    
    // Check Badges
    const newBadges = [...progress.badges];
    if (newLevel >= 5 && !newBadges.includes('b_judge')) newBadges.push('b_judge');
    
    // Check category specific badges (simplified check based on current run)
    const pngCorrect = results.filter(r => r.missionId === 'm2' && r.isCorrect).length > 0; // Simplified for demo
    if (pngCorrect && !newBadges.includes('b_transparency')) newBadges.push('b_transparency');

    const updatedProgress: UserProgress = {
      ...progress,
      xp: newXp,
      level: newLevel,
      badges: newBadges,
      wrongNotes: newWrongNotes,
      missionHistory: {
        ...progress.missionHistory,
        ...results.reduce((acc, r) => ({ ...acc, [r.missionId]: r.isCorrect }), {})
      }
    };

    setProgress(updatedProgress);
    saveProgress(updatedProgress);
    setView(View.HOME);
  };

  const handleQuizComplete = (score: number, wrongIds: string[]) => {
    // Update progress with quiz results
    const newWrongNotes = [...progress.wrongNotes, ...wrongIds]; // Add new mistakes
    // Ideally remove corrected ones, but simpler to just append unique
    const uniqueWrong = Array.from(new Set(newWrongNotes));

    const updatedProgress: UserProgress = {
      ...progress,
      wrongNotes: uniqueWrong,
      quizMastery: score > progress.quizMastery ? score : progress.quizMastery
    };
    setProgress(updatedProgress);
    saveProgress(updatedProgress);
    setView(View.HOME);
  };

  const NavButton = ({ target, icon: Icon, label }: { target: View; icon: any; label: string }) => (
    <button
      onClick={() => { setView(target); setIsMenuOpen(false); }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${
        view === target 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'hover:bg-indigo-50 text-slate-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <h1 className="font-bold text-lg text-indigo-700">포맷 선택 챌린지</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 p-6 flex flex-col z-40 transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="mb-8 hidden md:block">
          <h1 className="font-black text-2xl text-indigo-700">포맷 챌린지</h1>
          <p className="text-xs text-slate-500 mt-1">디지털 리터러시 마스터하기</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white mb-6 shadow-lg">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold opacity-80">Lv.{progress.level}</span>
            <span className="font-bold text-2xl">{progress.xp} XP</span>
          </div>
          <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
             {/* Simplified progress bar for demo */}
            <div className="bg-white h-full" style={{ width: `${(progress.xp % 100)}%` }}></div>
          </div>
          <div className="flex gap-2 mt-4 text-xs font-bold">
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
              <Trophy className="w-3 h-3" /> {progress.badges.length}
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
              <Star className="w-3 h-3" /> {progress.streak}일 연속
            </div>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavButton target={View.HOME} icon={LayoutGrid} label="홈" />
          <NavButton target={View.THEORY} icon={BookOpen} label="이론 학습" />
          <NavButton target={View.GAME} icon={PlayCircle} label="실전 게임" />
          <NavButton target={View.QUIZ} icon={GraduationCap} label="퀴즈 & 오답" />
          <NavButton target={View.LEARN} icon={Lightbulb} label="더 알아보기" />
          <NavButton target={View.REFLECTION} icon={PenTool} label="생각해볼 문제" />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        {view === View.HOME && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">안녕하세요, 학생님! 👋</h2>
              <p className="text-slate-600">오늘도 올바른 포맷을 찾아 떠나볼까요?</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Daily Mission Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView(View.GAME)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">Daily</span>
                </div>
                <h3 className="text-xl font-bold mb-2">오늘의 랜덤 미션</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{dailyMission.scenario}</p>
                <div className="text-indigo-600 font-bold text-sm">지금 도전하기 →</div>
              </div>

              {/* Status Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4">내 뱃지 컬렉션</h3>
                <div className="flex gap-3 flex-wrap">
                  {progress.badges.length === 0 && <span className="text-sm text-slate-400">아직 획득한 뱃지가 없어요.</span>}
                  {BADGES.filter(b => progress.badges.includes(b.id)).map(badge => (
                     <div key={badge.id} className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl shadow-sm border border-yellow-200" title={badge.name}>
                        {badge.icon}
                     </div>
                  ))}
                  {/* Lock icons for unearned */}
                  {BADGES.filter(b => !progress.badges.includes(b.id)).slice(0, 3).map(badge => (
                     <div key={badge.id} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl opacity-30 grayscale" title="잠김">
                        {badge.icon}
                     </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">왜 배워야 할까요?</h3>
                <p className="opacity-90 max-w-lg mb-6 leading-relaxed">
                  콘텐츠 크리에이터, 게임 개발자, 혹은 그냥 스마트폰 유저라도! 
                  데이터를 효율적으로 다루는 능력은 디지털 시대의 필수 생존 기술입니다.
                </p>
                <button 
                  onClick={() => setView(View.THEORY)}
                  className="bg-white text-indigo-900 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors"
                >
                  기초 개념부터 시작
                </button>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                <LayoutGrid className="w-64 h-64" />
              </div>
            </div>
          </div>
        )}

        {view === View.GAME && <Game onComplete={handleGameComplete} />}
        {view === View.THEORY && <Theory />}
        {view === View.QUIZ && <Quiz progress={progress} onComplete={handleQuizComplete} />}
        {view === View.LEARN && <LearnMore />}
        {view === View.REFLECTION && <Reflection />}
      </main>
    </div>
  );
};

export default App;
