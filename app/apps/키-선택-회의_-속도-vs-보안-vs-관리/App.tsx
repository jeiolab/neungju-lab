import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, Globe, CheckSquare, MessageCircle, Trophy } from 'lucide-react';
import { UserStats, SimulationResult } from './types';
import { calculateLevel, getBadge } from './utils';

// Components
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import RealWorldTab from './components/RealWorldTab';
import QuizTab from './components/QuizTab';
import ThinkTab from './components/ThinkTab';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

enum Tab {
  CONCEPT = '개념',
  SIMULATION = '회의실(실습)',
  REALWORLD = '사례',
  QUIZ = '퀴즈',
  THINK = '토론',
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONCEPT);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('crypto_app_stats');
    return saved ? JSON.parse(saved) : { xp: 0, level: 1, badges: [], history: [] };
  });

  useEffect(() => {
    localStorage.setItem('crypto_app_stats', JSON.stringify(stats));
  }, [stats]);

  const handleSimulationComplete = (result: SimulationResult) => {
    setStats(prev => {
      const newXp = prev.xp + result.score;
      const newHistory = [...prev.history, result];
      const newBadge = getBadge(newHistory);
      const badges = newBadge && !prev.badges.includes(newBadge) 
        ? [...prev.badges, newBadge] 
        : prev.badges;
      
      return {
        xp: newXp,
        level: calculateLevel(newXp),
        badges,
        history: newHistory
      };
    });
  };

  const getChartData = () => {
    if (stats.history.length === 0) return [
      { subject: '속도', A: 0, fullMark: 10 },
      { subject: '보안', A: 0, fullMark: 10 },
      { subject: '관리편의', A: 0, fullMark: 10 },
    ];

    const sum = stats.history.reduce((acc, cur) => ({
      speed: acc.speed + cur.userAttributes.speed,
      security: acc.security + cur.userAttributes.security,
      management: acc.management + cur.userAttributes.management,
    }), { speed: 0, security: 0, management: 0 });

    const count = stats.history.length;

    return [
      { subject: '속도중시', A: (sum.speed / count).toFixed(1), fullMark: 10 },
      { subject: '보안중시', A: (sum.security / count).toFixed(1), fullMark: 10 },
      { subject: '관리중시', A: (sum.management / count).toFixed(1), fullMark: 10 },
    ];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case Tab.CONCEPT: return <ConceptTab />;
      case Tab.SIMULATION: return <SimulationTab onComplete={handleSimulationComplete} />;
      case Tab.REALWORLD: return <RealWorldTab />;
      case Tab.QUIZ: return <QuizTab />;
      case Tab.THINK: return <ThinkTab />;
      default: return <ConceptTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row max-w-7xl mx-auto shadow-2xl">
      
      {/* Sidebar / Mobile Header */}
      <aside className="bg-slate-900 text-white w-full md:w-64 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold leading-tight">키 선택 회의 <br/><span className="text-indigo-400 text-sm">속도 vs 보안 vs 관리</span></h1>
        </div>
        
        {/* User Stats Card */}
        <div className="p-4 bg-slate-800 m-4 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">My Profile</span>
            <span className="text-xs font-bold bg-indigo-600 px-2 py-1 rounded">Lv. {stats.level}</span>
          </div>
          <div className="text-sm text-slate-300 mb-2">총 점수(XP): {stats.xp}</div>
          <div className="flex flex-wrap gap-1 mb-3">
             {stats.badges.length > 0 ? stats.badges.map(b => (
               <span key={b} className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-1 rounded border border-amber-500/50 flex items-center gap-1">
                 <Trophy size={10} /> {b}
               </span>
             )) : <span className="text-[10px] text-slate-500">배지가 없습니다.</span>}
          </div>
          
          <div className="h-32 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getChartData()}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="My Tendency" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <ul className="space-y-1">
            {[
              { id: Tab.CONCEPT, icon: BookOpen, label: '개념 익히기' },
              { id: Tab.SIMULATION, icon: PlayCircle, label: '키 선택 회의' },
              { id: Tab.REALWORLD, icon: Globe, label: '현실 사례' },
              { id: Tab.QUIZ, icon: CheckSquare, label: '퀴즈 확인' },
              { id: Tab.THINK, icon: MessageCircle, label: '생각해볼 문제' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between md:hidden">
           <h2 className="font-bold text-slate-800">{activeTab}</h2>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
             {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;