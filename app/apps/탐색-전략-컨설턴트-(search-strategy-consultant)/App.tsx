import React, { useState } from 'react';
import { SCENARIOS, BADGES } from './constants';
import Simulation from './components/Simulation';
import QuizSection from './components/QuizSection';
import { LayoutDashboard, GraduationCap, Trophy, Info } from 'lucide-react';
import { AlgorithmType, SimulationMetrics } from './types';

function App() {
  const [view, setView] = useState<'simulation' | 'quiz' | 'badges'>('simulation');
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [userBadges, setUserBadges] = useState(BADGES);
  
  // Basic XP system
  const [xp, setXp] = useState(0);

  const handleSimComplete = (metrics: SimulationMetrics, algo: AlgorithmType) => {
    // Award XP based on suitability
    const earnedXp = Math.round(metrics.totalSuitability / 2);
    setXp(prev => prev + earnedXp);

    // Badge Logic (Simple examples)
    const newBadges = [...userBadges];
    
    // Unlock Rookie
    if (!newBadges[0].unlocked) newBadges[0].unlocked = true;

    // Unlock Cost Saver if maintenance is low
    if (metrics.maintenanceCost < 30 && metrics.totalSuitability > 70) {
        if (!newBadges[2].unlocked) newBadges[2].unlocked = true;
    }

    // Unlock Speed Demon if speed is maxed and optimal
    if (metrics.speedScore > 90 && metrics.totalSuitability > 80) {
        if (!newBadges[3].unlocked) newBadges[3].unlocked = true;
    }

    setUserBadges(newBadges);
  };

  const handleQuizComplete = (score: number) => {
    setXp(prev => prev + score);
    if (score >= 80) {
        const newBadges = [...userBadges];
        if (!newBadges[1].unlocked) newBadges[1].unlocked = true;
        setUserBadges(newBadges);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                    <LayoutDashboard className="w-6 h-6" />
                </div>
                <span className="font-bold text-xl text-slate-800 hidden sm:block">탐색 전략 컨설턴트</span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <button 
                  onClick={() => setView('simulation')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${view === 'simulation' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  시뮬레이션
                </button>
                <button 
                  onClick={() => setView('quiz')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${view === 'quiz' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  퀴즈 & 테스트
                </button>
                <button 
                  onClick={() => setView('badges')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${view === 'badges' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  나의 배지
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    XP: <span className="text-indigo-600 font-bold">{xp}</span>
                </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {view === 'simulation' && (
          <div className="space-y-8">
            <div className="bg-indigo-900 rounded-2xl p-6 sm:p-10 text-white shadow-lg">
                <div className="max-w-3xl">
                    <h2 className="text-3xl font-bold mb-4">어떤 탐색 방법이 최적일까요?</h2>
                    <p className="text-indigo-100 text-lg mb-6">
                        모든 상황에 완벽한 알고리즘은 없습니다. 
                        데이터의 크기, 정렬 상태, 업데이트 빈도를 고려하여 
                        가장 효율적인 탐색 전략을 선택해보세요.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {SCENARIOS.map((scenario, idx) => (
                            <button
                                key={scenario.id}
                                onClick={() => setSelectedScenarioIdx(idx)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedScenarioIdx === idx ? 'bg-white text-indigo-900' : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'}`}
                            >
                                {scenario.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{SCENARIOS[selectedScenarioIdx].title}</h3>
                <p className="text-slate-600 mb-4">{SCENARIOS[selectedScenarioIdx].context}</p>
                <div className="h-px bg-slate-100 mb-6"></div>
                <Simulation 
                    scenario={SCENARIOS[selectedScenarioIdx]} 
                    onComplete={handleSimComplete}
                />
            </div>
          </div>
        )}

        {view === 'quiz' && (
            <div className="space-y-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <GraduationCap className="text-indigo-600" />
                        탐색 전략 자격 시험
                    </h2>
                    <p className="text-slate-600 mb-6">
                        시뮬레이션을 통해 배운 내용을 바탕으로 퀴즈를 풀어보세요. 
                        AI가 당신의 답변을 분석하여 피드백을 제공합니다.
                    </p>
                    <QuizSection onScoreUpdate={handleQuizComplete} />
                 </div>
            </div>
        )}

        {view === 'badges' && (
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Trophy className="text-amber-500" />
                    나의 업적
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {userBadges.map(badge => (
                        <div key={badge.id} className={`p-6 rounded-xl border ${badge.unlocked ? 'bg-white border-amber-200 shadow-amber-100 shadow-md' : 'bg-slate-50 border-slate-200 opacity-60 grayscale'}`}>
                            <div className="text-4xl mb-4">{badge.icon}</div>
                            <h3 className="font-bold text-lg text-slate-800">{badge.name}</h3>
                            <p className="text-sm text-slate-500 mt-2">{badge.description}</p>
                            <div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                {badge.unlocked ? <span className="text-amber-600">획득함</span> : "잠김"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>
    </div>
  );
}

export default App;
