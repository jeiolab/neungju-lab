'use client'

import React, { useState, useEffect } from 'react';
import { formatDate, LEVEL_XP_GAIN, QUIZ_XP_GAIN, LEVELS } from './constants';
import { generateDailyGraph } from './services/graphService';
import { getUserStats, saveUserStats, completeMission, getMissionHistory } from './services/storageService';
import { generateThinkAboutIt } from './services/geminiService';
import { GraphData, AlgoType, UserStats } from './types';
import GraphVisualizer from './components/GraphVisualizer';
import ConceptCard from './components/ConceptCard';
import QuizSection from './components/QuizSection';
import { Trophy, Calendar, Zap, Map, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [todayData, setTodayData] = useState<GraphData | null>(null);
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [algo, setAlgo] = useState<AlgoType | null>(null);
  const [missionPhase, setMissionPhase] = useState<'IDLE' | 'PLAYING' | 'QUIZ' | 'COMPLETED'>('IDLE');
  const [thinkQuestion, setThinkQuestion] = useState<string>("");
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    // Initialize Daily Data
    const today = formatDate(new Date());
    const graph = generateDailyGraph(today);
    setTodayData(graph);

    // Check history
    const history = getMissionHistory();
    if (history[today]?.completed) {
      setTodayCompleted(true);
      setMissionPhase('COMPLETED');
    }

    // Load think question
    generateThinkAboutIt("DFS").then(setThinkQuestion);
  }, []);

  const handleStartMission = (selectedAlgo: AlgoType) => {
    setAlgo(selectedAlgo);
    setMissionPhase('PLAYING');
  };

  const handleGraphComplete = (success: boolean) => {
    if (success) {
      setMissionPhase('QUIZ');
    }
  };

  const handleQuizComplete = (quizScore: number) => {
    if (!todayCompleted) {
        completeMission(formatDate(new Date()), LEVEL_XP_GAIN + (quizScore * QUIZ_XP_GAIN));
        setStats(getUserStats()); // Refresh UI
        setTodayCompleted(true);
    }
    setMissionPhase('COMPLETED');
  };

  const currentLevel = LEVELS.find(l => stats.totalXP >= l.xp) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.xp > stats.totalXP);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="text-blue-500 w-6 h-6" />
            <h1 className="font-bold text-lg text-white tracking-tight">오늘의 탐색 미션</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-mono">
             <div className="flex items-center gap-1 text-yellow-500">
                <Zap className="w-4 h-4" fill="currentColor" />
                <span>{stats.streak}일 연속</span>
             </div>
             <div className="flex items-center gap-1 text-purple-400">
                <Trophy className="w-4 h-4" />
                <span>레벨 {stats.level}</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        
        {/* Dashboard / Welcome */}
        {missionPhase === 'IDLE' && !todayCompleted && (
          <section className="text-center space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <div className="inline-block p-2 bg-slate-900 rounded-full border border-slate-700 mb-4">
               <span className="text-xs font-mono text-slate-400 px-2">{formatDate(new Date())}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              오늘의 그래프가 기다립니다
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-lg">
              매일 생성되는 미로를 탐색할 알고리즘을 선택하세요. 깊이와 너비의 차이를 마스터하세요.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <button 
                onClick={() => handleStartMission(AlgoType.DFS)}
                className="group relative p-8 rounded-2xl bg-slate-900 border border-slate-700 hover:border-indigo-500 transition-all hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] text-left"
              >
                <div className="text-2xl mb-2">🔦 DFS</div>
                <div className="font-bold text-indigo-400 text-xl mb-2">깊이 우선 탐색</div>
                <p className="text-sm text-slate-500 group-hover:text-slate-300">미로 깊숙이 들어갑니다. 막다른 길에서만 되돌아옵니다.</p>
              </button>

              <button 
                onClick={() => handleStartMission(AlgoType.BFS)}
                className="group relative p-8 rounded-2xl bg-slate-900 border border-slate-700 hover:border-emerald-500 transition-all hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] text-left"
              >
                <div className="text-2xl mb-2">📡 BFS</div>
                <div className="font-bold text-emerald-400 text-xl mb-2">너비 우선 탐색</div>
                <p className="text-sm text-slate-500 group-hover:text-slate-300">영역을 넓혀가며 탐색합니다. 최단 경로를 찾습니다.</p>
              </button>
            </div>
          </section>
        )}

        {/* Game Phase */}
        {missionPhase === 'PLAYING' && todayData && algo && (
          <section className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold flex items-center gap-2">
                 미션: <span className={algo === AlgoType.DFS ? "text-indigo-400" : "text-emerald-400"}>{algo} 탐색</span>
               </h2>
               <button onClick={() => setMissionPhase('IDLE')} className="text-sm text-slate-500 hover:text-white">취소</button>
            </div>
            
            <GraphVisualizer 
                data={todayData} 
                algo={algo} 
                onMissionComplete={handleGraphComplete} 
            />

            <ConceptCard algo={algo} />
          </section>
        )}

        {/* Quiz Phase */}
        {missionPhase === 'QUIZ' && (
          <section className="animate-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">체크포인트 퀴즈</h2>
              <p className="text-slate-400">마스터했음을 증명하고 오늘의 XP를 획득하세요.</p>
            </div>
            <QuizSection onComplete={handleQuizComplete} />
          </section>
        )}

        {/* Completed Dashboard */}
        {(missionPhase === 'COMPLETED' || todayCompleted) && (
           <section className="space-y-8 animate-in fade-in duration-1000">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl border border-slate-700 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">미션 성공!</h2>
                <p className="text-slate-400 mb-6">{stats.streak}일 연속 학습 중입니다.</p>
                
                <div className="flex justify-center gap-8 mb-8">
                   <div className="text-center">
                      <div className="text-sm text-slate-500 font-mono">총 XP</div>
                      <div className="text-2xl font-bold text-white">{stats.totalXP}</div>
                   </div>
                   <div className="text-center">
                      <div className="text-sm text-slate-500 font-mono">현재 칭호</div>
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {currentLevel.title}
                      </div>
                   </div>
                </div>

                {nextLevel && (
                  <div className="max-w-xs mx-auto">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{nextLevel.title}까지 진행도</span>
                      <span>{Math.floor((stats.totalXP / nextLevel.xp) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                         style={{ width: `${(stats.totalXP / nextLevel.xp) * 100}%` }}
                       ></div>
                    </div>
                  </div>
                )}
             </div>

             <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
               <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                 <span className="text-xl">🤔</span> 생각해보기
               </h3>
               <p className="text-slate-300 italic border-l-4 border-blue-500 pl-4 py-1">
                 "{thinkQuestion}"
               </p>
             </div>
             
             <div className="text-center pt-8">
                <button 
                  onClick={() => {
                     setMissionPhase('IDLE');
                     setTodayCompleted(false); // Enable practice mode essentially, though keeping completion state in DB
                  }}
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> 미션 다시하기 (연습)
                </button>
             </div>
           </section>
        )}

      </main>
    </div>
  );
};

export default App;