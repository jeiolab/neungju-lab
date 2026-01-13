import React, { useState, useEffect } from 'react';
import { generateScenario } from '../services/geminiService';
import { STATIC_SCENARIOS } from '../constants';
import { Scenario, Difficulty, AnswerType, UserStats } from '../types';
import { Brain, ArrowRight, AlertTriangle, Check, X } from 'lucide-react';

interface GameProps {
  userStats: UserStats;
  updateStats: (newStats: UserStats) => void;
}

const Game: React.FC<GameProps> = ({ userStats, updateStats }) => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [category, setCategory] = useState<'SCHOOL' | 'LIFE' | 'CAREER'>('SCHOOL');

  const loadScenario = async () => {
    setLoading(true);
    setFeedback(null);
    
    // Try to get from Gemini, fallback to static
    // Using a simple randomization for static to simulate variety
    let scenario: Scenario | null = null;
    
    // 50% chance to use API if Key exists, else Static
    if (process.env.API_KEY && Math.random() > 0.3) {
        scenario = await generateScenario(category, difficulty);
    }
    
    if (!scenario) {
       // Filter static scenarios roughly matching logic
       const candidates = STATIC_SCENARIOS; 
       scenario = candidates[Math.floor(Math.random() * candidates.length)];
    }

    setCurrentScenario(scenario);
    setLoading(false);
  };

  useEffect(() => {
    loadScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, difficulty]);

  const handleAnswer = (answer: AnswerType) => {
    if (!currentScenario) return;

    const isCorrect = answer === currentScenario.correctAnswer;
    const newStats = { ...userStats };
    newStats.totalPlayed += 1;

    if (isCorrect) {
      newStats.score += (difficulty === Difficulty.HARD ? 50 : difficulty === Difficulty.NORMAL ? 30 : 10) + (newStats.streak * 5);
      newStats.streak += 1;
      if (newStats.streak > newStats.maxStreak) newStats.maxStreak = newStats.streak;
    } else {
      newStats.streak = 0;
      newStats.wrongNotes.push(currentScenario);
      
      // Analyze misconception
      if (currentScenario.correctAnswer === 'IMPOSSIBLE' && answer === 'POSSIBLE') {
         if (currentScenario.dataState === 'UNSORTED') newStats.misconceptions.ignoreSorting += 1;
         if (currentScenario.dataState === 'DYNAMIC') newStats.misconceptions.dynamicCost += 1;
      }
      if (currentScenario.correctAnswer === 'CONDITIONAL' && answer === 'IMPOSSIBLE') {
          // Missed opportunity to sort
      }
    }

    updateStats(newStats);
    setFeedback({
      isCorrect,
      message: isCorrect ? '정확합니다! ' + currentScenario.explanation : '틀렸습니다. ' + currentScenario.explanation
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-pulse">
        <Brain className="w-12 h-12 text-indigo-400 mb-4" />
        <p className="text-indigo-600">새로운 시나리오를 분석 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Controls */}
      <div className="flex justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value as any)}
          className="bg-slate-100 border-none rounded-lg px-3 py-2 text-sm font-medium"
        >
          <option value="SCHOOL">학교 생활</option>
          <option value="LIFE">일상 생활</option>
          <option value="CAREER">진로/IT</option>
        </select>
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value as any)}
          className="bg-slate-100 border-none rounded-lg px-3 py-2 text-sm font-medium"
        >
          <option value="EASY">쉬움 (개념)</option>
          <option value="NORMAL">보통 (판별)</option>
          <option value="HARD">어려움 (응용)</option>
        </select>
      </div>

      {currentScenario && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-indigo-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <span className="bg-indigo-500 text-xs px-2 py-1 rounded font-mono mb-2 inline-block">
                DATA STATE: {currentScenario.dataState}
              </span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">
                목표: {currentScenario.target}
              </span>
            </div>
            <h2 className="text-xl font-bold leading-relaxed">
              {currentScenario.description}
            </h2>
          </div>

          <div className="p-8">
            <h3 className="text-center text-lg font-medium text-slate-700 mb-6">
              이 상황에서 <span className="text-indigo-600 font-bold">이진 탐색</span>이 가능할까요?
            </h3>

            {!feedback ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleAnswer('POSSIBLE')}
                  className="p-4 rounded-xl border-2 border-slate-100 hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center group"
                >
                  <span className="text-2xl mb-2">🙆‍♂️</span>
                  <span className="font-bold text-slate-700 group-hover:text-green-700">가능함</span>
                  <span className="text-xs text-slate-400 mt-1">즉시 수행 가능</span>
                </button>
                <button
                  onClick={() => handleAnswer('CONDITIONAL')}
                  className="p-4 rounded-xl border-2 border-slate-100 hover:border-yellow-500 hover:bg-yellow-50 transition-all flex flex-col items-center group"
                >
                  <span className="text-2xl mb-2">🤔</span>
                  <span className="font-bold text-slate-700 group-hover:text-yellow-700">조건부 가능</span>
                  <span className="text-xs text-slate-400 mt-1">정렬 먼저 하면 가능</span>
                </button>
                <button
                  onClick={() => handleAnswer('IMPOSSIBLE')}
                  className="p-4 rounded-xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition-all flex flex-col items-center group"
                >
                  <span className="text-2xl mb-2">🙅‍♀️</span>
                  <span className="font-bold text-slate-700 group-hover:text-red-700">불가능/비효율</span>
                  <span className="text-xs text-slate-400 mt-1">다른 방법 써야 함</span>
                </button>
              </div>
            ) : (
              <div className={`rounded-xl p-6 ${feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className="flex items-center gap-3 mb-2">
                  {feedback.isCorrect ? <Check className="text-green-600 w-6 h-6" /> : <X className="text-red-600 w-6 h-6" />}
                  <span className={`font-bold text-lg ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {feedback.isCorrect ? '정답입니다!' : '아쉽네요!'}
                  </span>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  {feedback.message}
                </p>
                <button
                  onClick={loadScenario}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  다음 문제 도전 <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;