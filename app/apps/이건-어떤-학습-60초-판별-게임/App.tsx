import React, { useState, useEffect } from 'react';
import { Trophy, BookOpen, Gamepad2, Brain, Activity, RotateCcw } from 'lucide-react';
import GameLoop from './components/GameLoop';
import Simulation from './components/Simulation';
import TheoryCards from './components/TheoryCards';
import { UserStats, LearningType, Badge } from './types';
import { BADGES } from './constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const INITIAL_STATS: UserStats = {
  score: 0,
  highScore: 0,
  streak: 1,
  totalGames: 0,
  mastery: {
    [LearningType.SUPERVISED]: { correct: 0, attempts: 0 },
    [LearningType.UNSUPERVISED]: { correct: 0, attempts: 0 },
    [LearningType.REINFORCEMENT]: { correct: 0, attempts: 0 },
    [LearningType.TRADITIONAL]: { correct: 0, attempts: 0 },
  },
  badges: []
};

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'game' | 'quiz' | 'sim'>('home');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [lastGameScore, setLastGameScore] = useState<number | null>(null);

  // Load stats from local storage
  useEffect(() => {
    const saved = localStorage.getItem('mlGameStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Save stats
  useEffect(() => {
    localStorage.setItem('mlGameStats', JSON.stringify(stats));
  }, [stats]);

  const updateStats = (category: LearningType, isCorrect: boolean) => {
    setStats(prev => {
        const newMastery = { ...prev.mastery };
        newMastery[category].attempts += 1;
        if (isCorrect) newMastery[category].correct += 1;

        // Check badges
        const earnedBadges = [...prev.badges];
        BADGES.forEach(badge => {
            if (!earnedBadges.includes(badge.id) && badge.condition({ ...prev, mastery: newMastery })) {
                earnedBadges.push(badge.id);
                // Badge toast could go here
                alert(`🎉 배지 획득: ${badge.name}`);
            }
        });

        return {
            ...prev,
            mastery: newMastery,
            badges: earnedBadges
        };
    });
  };

  const handleGameEnd = (finalScore: number) => {
    setLastGameScore(finalScore);
    setStats(prev => ({
        ...prev,
        score: prev.score + finalScore,
        highScore: Math.max(prev.highScore, finalScore),
        totalGames: prev.totalGames + 1
    }));
    setActiveTab('home');
  };

  // Helper for Pie Chart Data
  const getMasteryData = () => {
    return Object.entries(stats.mastery).map(([name, val]) => {
      const statsVal = val as { correct: number; attempts: number };
      return {
        name,
        value: statsVal.attempts === 0 ? 0 : Math.round((statsVal.correct / statsVal.attempts) * 100),
        count: statsVal.correct
      };
    });
  };

  const COLORS = ['#4f46e5', '#9333ea', '#ea580c', '#475569'];

  const renderContent = () => {
    switch (activeTab) {
      case 'game':
        return <GameLoop onGameEnd={handleGameEnd} updateStats={updateStats} />;
      case 'quiz':
          return <GameLoop onGameEnd={handleGameEnd} updateStats={updateStats} isQuizMode={true} />;
      case 'sim':
        return <Simulation />;
      case 'learn':
        return <TheoryCards />;
      case 'home':
      default:
        return (
          <div className="space-y-6 animate-fade-in">
             {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-center border border-indigo-200 shadow-xl">
              <h1 className="text-3xl font-extrabold text-white mb-2">이건 어떤 학습?</h1>
              <p className="text-indigo-100 mb-6">60초 동안 AI 학습 유형을 판별하고 최고 점수에 도전하세요!</p>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setActiveTab('game')}
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center"
                >
                  <Gamepad2 className="mr-2" /> 게임 시작
                </button>
                <button 
                  onClick={() => setActiveTab('quiz')}
                  className="bg-white hover:bg-slate-100 text-indigo-600 font-bold py-3 px-6 rounded-full shadow-lg transition flex items-center"
                >
                  <BookOpen className="mr-2" /> 퀴즈 풀기
                </button>
              </div>

              {lastGameScore !== null && (
                  <div className="mt-4 p-2 bg-white/20 rounded-lg inline-block">
                      마지막 점수: <span className="font-bold text-yellow-300">{lastGameScore}점</span>
                  </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm mb-1">최고 기록</div>
                    <div className="text-2xl font-bold text-slate-900 flex items-center">
                        <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                        {stats.highScore}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm mb-1">연속 출석 (Sim)</div>
                    <div className="text-2xl font-bold text-slate-900 flex items-center">
                        <Activity className="w-5 h-5 text-green-500 mr-2" />
                        {stats.streak}일
                    </div>
                </div>
            </div>

            {/* Mastery Chart */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-64 flex flex-col">
                 <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-500" /> 학습 마스터리 (정답률)
                 </h3>
                 <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={getMasteryData()}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {getMasteryData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                itemStyle={{ color: '#1e293b' }}
                                formatter={(value: number | undefined) => value !== undefined ? [`${value}%`, '정답률'] : ['', '정답률']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    {getMasteryData().map((d, i) => (
                        <div key={d.name} className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }}></div>
                            {d.name}: {d.value}%
                        </div>
                    ))}
                 </div>
            </div>

            {/* Badges */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-3">획득한 배지</h3>
                <div className="flex gap-2 flex-wrap">
                    {BADGES.map(badge => {
                        const isEarned = stats.badges.includes(badge.id);
                        return (
                            <div key={badge.id} className={`p-2 rounded-lg border flex flex-col items-center w-24 text-center ${isEarned ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-50'}`}>
                                <div className="mb-1">{badge.icon === 'Flag' ? '🚩' : badge.icon === 'Trophy' ? '🏆' : badge.icon === 'Zap' ? '⚡' : '📡'}</div>
                                <div className="text-xs font-bold">{badge.name}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header with Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤖</span>
              <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                이건 어떤 학습?
              </h1>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="border-t border-slate-200">
            <div className="flex justify-around p-2">
              <button onClick={() => setActiveTab('home')} className={`p-3 rounded-xl flex flex-col items-center transition-colors ${activeTab === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                <Activity className="w-6 h-6" />
                <span className="text-xs mt-1">홈</span>
              </button>
              <button onClick={() => setActiveTab('learn')} className={`p-3 rounded-xl flex flex-col items-center transition-colors ${activeTab === 'learn' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                <BookOpen className="w-6 h-6" />
                <span className="text-xs mt-1">이론</span>
              </button>
              <button onClick={() => setActiveTab('sim')} className={`p-3 rounded-xl flex flex-col items-center transition-colors ${activeTab === 'sim' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                <GameControllerIcon active={activeTab === 'sim'} />
                <span className="text-xs mt-1">실험</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow p-4 max-w-3xl mx-auto w-full">
        {renderContent()}
      </div>
    </div>
  );
}

// Custom icon wrapper for simple visual toggle
const GameControllerIcon = ({ active }: { active: boolean }) => (
    <div className="relative">
        <Gamepad2 className={`w-6 h-6 ${active ? 'fill-current' : ''}`} />
    </div>
);

export default App;