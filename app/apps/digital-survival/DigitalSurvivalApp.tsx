'use client'

import React, { useState, useEffect } from 'react';
import { GameState, Scenario, Choice, EvaluationResult, PlayerLevel } from './types';
import { INITIAL_STATS, INITIAL_SCENARIO } from './constants';
import { evaluateAction, generateNextScenario } from './services/geminiService';
import StatDisplay from './components/StatDisplay';
import ScenarioCard from './components/ScenarioCard';
import FeedbackModal from './components/FeedbackModal';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Terminal, RefreshCcw, Wifi, WifiOff } from 'lucide-react';

const DigitalSurvivalApp: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    stats: { ...INITIAL_STATS },
    level: '초보 사용자',
    currentScenario: INITIAL_SCENARIO,
    turn: 1,
    gameOver: false,
    history: []
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const [loadingNext, setLoadingNext] = useState(false);

  // Level Up Logic
  useEffect(() => {
    const { exp } = gameState.stats;
    let newLevel: PlayerLevel = gameState.level;

    if (exp >= 400) newLevel = '네트워크 마스터';
    else if (exp >= 200) newLevel = '똑똑한 디지털 시민';
    else if (exp >= 100) newLevel = '디지털 탐험가';

    if (newLevel !== gameState.level) {
      setGameState(prev => ({ ...prev, level: newLevel }));
    }
  }, [gameState.stats.exp, gameState.level]);

  // Game Over Logic
  useEffect(() => {
    if (gameState.stats.data <= 0 || gameState.stats.battery <= 0 || gameState.stats.security <= 0) {
      setGameState(prev => ({ ...prev, gameOver: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.stats.data, gameState.stats.battery, gameState.stats.security]);

  const handleChoice = async (choice: Choice) => {
    if (!gameState.currentScenario || loading) return;

    setLoading(true);

    try {
      const result = await evaluateAction(gameState.currentScenario, choice, gameState.stats);
      setFeedback(result);
      
      // Apply stats locally for instant feel
      setGameState(prev => {
        const newStats = {
          data: Math.min(100, Math.max(0, prev.stats.data + result.statChanges.data)),
          battery: Math.min(100, Math.max(0, prev.stats.battery + result.statChanges.battery)),
          security: Math.min(100, Math.max(0, prev.stats.security + result.statChanges.security)),
          exp: prev.stats.exp + result.statChanges.exp
        };
        return {
          ...prev,
          stats: newStats,
          history: [...prev.history, choice.id]
        };
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNextScenario = async () => {
    if (!gameState.currentScenario) return;
    
    setLoadingNext(true);
    try {
      const nextScenario = await generateNextScenario(gameState.currentScenario, gameState.turn + 1);
      
      setGameState(prev => ({
        ...prev,
        currentScenario: nextScenario,
        turn: prev.turn + 1
      }));
      setFeedback(null);
    } catch (error) {
      console.error("Failed to load next level", error);
    } finally {
      setLoadingNext(false);
    }
  };

  const restartGame = () => {
    setGameState({
      stats: { ...INITIAL_STATS },
      level: '초보 사용자',
      currentScenario: INITIAL_SCENARIO,
      turn: 1,
      gameOver: false,
      history: []
    });
    setFeedback(null);
  };

  if (gameState.gameOver) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        <Header />
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <WifiOff size={48} className="text-red-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">연결 끊김</h1>
            <h2 className="text-xl text-gray-500 mb-6">디지털 생존 실패</h2>
            
            <div className="space-y-2 text-gray-600 mb-8 bg-gray-50 p-4 rounded-lg">
              {gameState.stats.data <= 0 && <p className="text-red-500 font-bold flex items-center justify-center gap-2">⚠️ 데이터 완전 소진</p>}
              {gameState.stats.battery <= 0 && <p className="text-yellow-600 font-bold flex items-center justify-center gap-2">⚠️ 배터리 완전 방전</p>}
              {gameState.stats.security <= 0 && <p className="text-blue-500 font-bold flex items-center justify-center gap-2">⚠️ 보안 해킹 당함</p>}
              <p className="mt-2 text-sm">더 이상 디지털 세상에서 활동할 수 없습니다.</p>
            </div>

            <div className="bg-gray-100 p-4 rounded mb-6 font-mono text-sm text-left border border-gray-200 text-gray-700">
              <p className="flex justify-between"><span>최종 등급:</span> <span className="text-cyan-600 font-bold">{gameState.level}</span></p>
              <p className="flex justify-between"><span>생존 턴 수:</span> <span className="text-cyan-600 font-bold">{gameState.turn}턴</span></p>
              <p className="flex justify-between"><span>최종 점수:</span> <span className="text-cyan-600 font-bold">{gameState.stats.exp} XP</span></p>
            </div>
            
            <button 
              onClick={restartGame}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              <RefreshCcw size={20} /> 시스템 재부팅 (Restart)
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <StatDisplay stats={gameState.stats} level={gameState.level} />

      <main className="flex-grow container mx-auto px-4 z-10 max-w-3xl">
        <div className="flex items-center justify-center mt-6 mb-2 text-gray-400 gap-2 font-mono-tech text-xs">
           <Terminal size={14} /> SYSTEM_ONLINE // TURN_{gameState.turn.toString().padStart(3, '0')}
        </div>

        {gameState.currentScenario && (
          <ScenarioCard 
            scenario={gameState.currentScenario} 
            onChoice={handleChoice}
            disabled={loading}
          />
        )}

        {loading && !feedback && (
          <div className="flex justify-center mt-12">
            <div className="flex flex-col items-center gap-4">
               <Wifi size={48} className="text-cyan-500 animate-pulse" />
               <div className="text-cyan-600 font-mono text-sm tracking-widest animate-pulse font-bold">
                 네트워크 분석 중...
               </div>
            </div>
          </div>
        )}
      </main>

      {feedback && (
        <FeedbackModal 
          result={feedback} 
          onNext={handleNextScenario}
          loadingNext={loadingNext}
        />
      )}
      <Footer />
    </div>
  );
};

export default DigitalSurvivalApp;
