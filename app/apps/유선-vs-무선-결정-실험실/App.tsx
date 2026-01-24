import React, { useState, useEffect } from 'react';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import DiscussionTab from './components/DiscussionTab';
import { UserStats, ExperimentResult, Badge } from './types';
import { BADGES } from './constants';
import { BookOpen, FlaskConical, ZoomIn, CheckSquare, MessageCircle, Trophy, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [stats, setStats] = useState<UserStats>({
    experimentsCount: 0,
    quizScore: 0,
    streak: 1,
    lastLoginDate: new Date().toDateString(),
    earnedBadges: ['starter'],
    wrongNoteIds: []
  });
  const [history, setHistory] = useState<ExperimentResult[]>([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('net_app2_mastery');
    const savedExp = localStorage.getItem('net_app2_experiments');
    
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      // Simple streak logic
      if (parsed.lastLoginDate !== new Date().toDateString()) {
        parsed.streak += 1;
        parsed.lastLoginDate = new Date().toDateString();
      }
      setStats(parsed);
    }
    if (savedExp) setHistory(JSON.parse(savedExp));
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem('net_app2_mastery', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('net_app2_experiments', JSON.stringify(history));
  }, [history]);

  const handleExperimentComplete = (result: ExperimentResult) => {
    const newHistory = [...history, result];
    setHistory(newHistory);
    
    setStats(prev => {
      const newStats = { ...prev, experimentsCount: prev.experimentsCount + 1 };
      
      // Check Badge Logic
      if (!prev.earnedBadges.includes('detective') && result.quality <= 30) {
        newStats.earnedBadges = [...prev.earnedBadges, 'detective'];
        alert("🎖 '간섭 탐정' 배지 획득! (최악의 품질 발견)");
      }
      if (!prev.earnedBadges.includes('expert') && newStats.experimentsCount >= 20) {
        newStats.earnedBadges = [...prev.earnedBadges, 'expert'];
        alert("🎖 '실험가' 배지 획득!");
      }
      return newStats;
    });
  };

  const handleQuizUpdate = (score: number, wrongIds: number[]) => {
    setStats(prev => {
      const newStats = { 
        ...prev, 
        quizScore: Math.max(prev.quizScore, score),
        wrongNoteIds: Array.from(new Set([...prev.wrongNoteIds, ...wrongIds]))
      };
      if (!prev.earnedBadges.includes('master') && score >= 100) {
        newStats.earnedBadges = [...prev.earnedBadges, 'master'];
        alert("🎖 '네트워크 마스터' 배지 획득!");
      }
      return newStats;
    });
  };

  const TabButton = ({ idx, icon, label }: { idx: number, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(idx)}
      className={`flex flex-col items-center justify-center py-3 px-1 md:px-4 rounded-xl transition-all duration-200 ${
        activeTab === idx 
          ? 'bg-blue-600 text-white shadow-lg scale-105' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] md:text-xs font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-0">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
          🛜 유선 vs 무선 <span className="text-blue-600">결정 실험실</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-slate-600 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> 
            <span>{stats.streak}일째 학습 중</span>
          </div>
          <button onClick={() => setShowBadgeModal(!showBadgeModal)} className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {stats.earnedBadges.length}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6 overflow-y-auto">
        {activeTab === 0 && <TheoryTab />}
        {activeTab === 1 && <SimulationTab onExperimentComplete={handleExperimentComplete} history={history} />}
        {activeTab === 2 && <DeepDiveTab />}
        {activeTab === 3 && <QuizTab onScoreUpdate={handleQuizUpdate} wrongNoteIds={stats.wrongNoteIds} />}
        {activeTab === 4 && <DiscussionTab />}
      </main>

      {/* Mobile/Desktop Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-2 md:relative md:border-t-0 md:bg-transparent md:p-0 z-20">
        <div className="container mx-auto">
           {/* Desktop view could be a sidebar, but for simplicity we keep bottom nav for mobile and top/bottom distinct for desktop or just stick to this bottom bar layout as it works well for "App-like" feel */}
           <div className="grid grid-cols-5 gap-1 md:flex md:justify-center md:gap-4 md:mb-8 md:bg-white md:p-3 md:rounded-2xl md:shadow-sm md:w-fit md:mx-auto">
            <TabButton idx={0} icon={<BookOpen className="w-5 h-5" />} label="이론 카드" />
            <TabButton idx={1} icon={<FlaskConical className="w-5 h-5" />} label="실험실" />
            <TabButton idx={2} icon={<ZoomIn className="w-5 h-5" />} label="더 알아보기" />
            <TabButton idx={3} icon={<CheckSquare className="w-5 h-5" />} label="퀴즈" />
            <TabButton idx={4} icon={<MessageCircle className="w-5 h-5" />} label="토론 & 규칙" />
           </div>
        </div>
      </nav>

      {/* Badge Modal Overlay */}
      {showBadgeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBadgeModal(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" /> 내 배지 보관함
              </h2>
              <button onClick={() => setShowBadgeModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">닫기</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map(badge => {
                const isEarned = stats.earnedBadges.includes(badge.id);
                return (
                  <div key={badge.id} className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 ${
                    isEarned ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100 grayscale opacity-50'
                  }`}>
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">{badge.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
                    </div>
                    {!isEarned && <span className="text-[10px] bg-slate-200 px-2 py-1 rounded text-slate-500">잠김</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
