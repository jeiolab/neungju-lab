import React, { useState } from 'react';
import { TabView, UserStats } from './types';
import { CONCEPTS } from './constants';
import GameView from './components/GameView';
import QuizView from './components/QuizView';
import AdvancedView from './components/AdvancedView';
import { BookOpen, Gamepad2, Info, GraduationCap, PenTool, Trophy, Flame, LayoutDashboard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('GAME');
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    streak: 1,
    lastPlayedDate: new Date().toISOString().split('T')[0],
    misconceptions: {},
    totalGamesPlayed: 0,
    totalCorrect: 0,
    badges: []
  });

  const handleGameComplete = (score: number, correctCount: number, misconceptions: string[]) => {
    setStats(prev => {
        const newMisconceptions = { ...prev.misconceptions };
        misconceptions.forEach(m => {
            newMisconceptions[m] = (newMisconceptions[m] || 0) + 1;
        });
        
        const newXP = prev.xp + score;
        const newLevel = Math.floor(newXP / 1000) + 1;
        const newBadges = [...prev.badges];
        if (score >= 800 && !newBadges.includes('Perfect Score')) newBadges.push('Perfect Score');

        return {
            ...prev,
            xp: newXP,
            level: newLevel,
            totalGamesPlayed: prev.totalGamesPlayed + 1,
            totalCorrect: prev.totalCorrect + correctCount,
            misconceptions: newMisconceptions,
            badges: newBadges
        };
    });
    alert(`게임 종료! 점수: ${score}점. ${misconceptions.length > 0 ? "오답 노트를 확인하세요!" : "훌륭합니다!"}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'CONCEPTS':
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="md:col-span-2 mb-4">
                    <h2 className="text-3xl font-bold text-slate-800">핵심 개념 학습</h2>
                    <p className="text-slate-500">개인정보 보호와 공유의 기준을 확실히 익혀보세요.</p>
                </div>
                {CONCEPTS.map((c, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                            <BookOpen className="text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-indigo-700 mb-3">{c.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-lg">{c.content}</p>
                    </div>
                ))}
            </div>
        );
      case 'GAME':
        return <div className="h-full max-w-6xl mx-auto"><GameView onComplete={handleGameComplete} /></div>;
      case 'QUIZ':
        return <div className="max-w-4xl mx-auto"><QuizView /></div>;
      case 'ADVANCED':
        return <div className="max-w-5xl mx-auto"><AdvancedView /></div>;
      case 'INFO':
        return (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3 mb-4">
                    <h2 className="text-3xl font-bold text-slate-800">나의 학습 리포트</h2>
                </div>
                
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                     <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                        <Trophy className="text-indigo-600 w-8 h-8" />
                     </div>
                     <p className="text-slate-500 font-medium">Level</p>
                     <p className="text-4xl font-bold text-slate-800">{stats.level}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                     <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                        <Flame className="text-orange-500 w-8 h-8 fill-orange-500" />
                     </div>
                     <p className="text-slate-500 font-medium">Streak</p>
                     <p className="text-4xl font-bold text-slate-800">{stats.streak}일</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                     <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <Gamepad2 className="text-blue-600 w-8 h-8" />
                     </div>
                     <p className="text-slate-500 font-medium">Total XP</p>
                     <p className="text-4xl font-bold text-slate-800">{stats.xp}</p>
                </div>

                {/* Chart */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
                    <h3 className="text-xl font-bold text-slate-700 mb-6">자주 틀리는 오개념 유형</h3>
                    {Object.keys(stats.misconceptions).length > 0 ? (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={Object.entries(stats.misconceptions).map(([k, v]) => ({ name: k, count: v }))}>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip 
                                        cursor={{fill: '#f1f5f9'}}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl">
                            데이터가 충분하지 않습니다. 게임을 진행해보세요!
                        </div>
                    )}
                </div>

                {/* Badges */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-700 mb-6">획득 배지</h3>
                    <div className="space-y-3">
                        {stats.badges.length > 0 ? stats.badges.map(b => (
                            <div key={b} className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3">
                                <Trophy size={18} className="text-yellow-600"/> {b}
                            </div>
                        )) : <div className="text-slate-400 text-center py-8">아직 획득한 배지가 없습니다.</div>}
                    </div>
                 </div>
            </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Web Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                        <LayoutDashboard size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">공유해도 돼?</h1>
                </div>
                
                <nav className="hidden md:flex items-center space-x-1">
                    <HeaderLink active={activeTab === 'GAME'} onClick={() => setActiveTab('GAME')} label="게임" icon={<Gamepad2 size={18}/>} />
                    <HeaderLink active={activeTab === 'CONCEPTS'} onClick={() => setActiveTab('CONCEPTS')} label="개념 학습" icon={<BookOpen size={18}/>} />
                    <HeaderLink active={activeTab === 'QUIZ'} onClick={() => setActiveTab('QUIZ')} label="퀴즈" icon={<GraduationCap size={18}/>} />
                    <HeaderLink active={activeTab === 'ADVANCED'} onClick={() => setActiveTab('ADVANCED')} label="시나리오 설계" icon={<PenTool size={18}/>} />
                    <HeaderLink active={activeTab === 'INFO'} onClick={() => setActiveTab('INFO')} label="리포트" icon={<Info size={18}/>} />
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full text-sm font-medium text-slate-600">
                    <Flame className="text-orange-500 w-4 h-4 fill-orange-500" /> 
                    <span>{stats.streak}일 연속</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                     <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                         {stats.level}
                     </div>
                     <span>Lv.{stats.level}</span>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </main>
      
      {/* Mobile Nav Fallback (Optional, hiding for pure web look but keeping for responsive safety if screen narrows) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
         <div className="flex justify-between items-end pb-2">
          <MobileNavButton active={activeTab === 'CONCEPTS'} onClick={() => setActiveTab('CONCEPTS')} icon={<BookOpen />} label="개념" />
          <MobileNavButton active={activeTab === 'GAME'} onClick={() => setActiveTab('GAME')} icon={<Gamepad2 />} label="게임" />
          <MobileNavButton active={activeTab === 'QUIZ'} onClick={() => setActiveTab('QUIZ')} icon={<GraduationCap />} label="퀴즈" />
          <MobileNavButton active={activeTab === 'ADVANCED'} onClick={() => setActiveTab('ADVANCED')} icon={<PenTool />} label="설계" />
          <MobileNavButton active={activeTab === 'INFO'} onClick={() => setActiveTab('INFO')} icon={<Info />} label="리포트" />
        </div>
      </nav>
    </div>
  );
};

const HeaderLink: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            active ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        )}
    >
        {icon}
        {label}
    </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-14 transition-all duration-200 ${active ? 'text-indigo-600 -translate-y-2' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`p-2 rounded-full transition-all ${active ? 'bg-indigo-100 shadow-sm' : ''}`}>
        {React.cloneElement(icon as React.ReactElement, { size: active ? 24 : 20, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default App;