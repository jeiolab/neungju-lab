import React, { useState, useEffect } from 'react';
import { Scenario, AnswerType, Difficulty, UserStats } from '../types';
import { SCENARIOS, getScenariosByDifficulty } from '../services/gameLogic';
import { Check, X, AlertCircle, Play, Trophy, Code } from 'lucide-react';
import { saveStats, updateStreak, addBadge } from '../services/storageService';

interface GameTabProps {
  stats: UserStats;
  onStatsUpdate: (newStats: UserStats) => void;
}

const GameTab: React.FC<GameTabProps> = ({ stats, onStatsUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentRound, setCurrentRound] = useState(0);
  const [gameScenarios, setGameScenarios] = useState<Scenario[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong', msg: string, logic: string } | null>(null);
  const [combo, setCombo] = useState(0);
  const [roundScore, setRoundScore] = useState(0);

  // Playground State
  const [playgroundOpen, setPlaygroundOpen] = useState(false);
  const [pgTotal, setPgTotal] = useState(40000);
  const [pgMember, setPgMember] = useState(false);

  const startGame = () => {
    const scenarios = getScenariosByDifficulty(difficulty);
    // Shuffle
    const shuffled = [...scenarios].sort(() => 0.5 - Math.random()).slice(0, 5); // 5 rounds per game
    setGameScenarios(shuffled);
    setCurrentRound(0);
    setCombo(0);
    setRoundScore(0);
    setFeedback(null);
    setIsPlaying(true);
  };

  const handleAnswer = (ans: AnswerType) => {
    const currentScenario = gameScenarios[currentRound];
    const isCorrect = ans === currentScenario.result;
    
    let newStats = { ...stats };
    let pointsToAdd = 0;

    if (isCorrect) {
      const basePoints = difficulty === 'easy' ? 10 : difficulty === 'normal' ? 20 : 30;
      const comboBonus = combo * 5;
      pointsToAdd = basePoints + comboBonus;
      newStats.points += pointsToAdd;
      
      setCombo(c => c + 1);
      setRoundScore(s => s + pointsToAdd);
      
      setFeedback({
        type: 'correct',
        msg: `정답입니다! (+${pointsToAdd}점)`,
        logic: currentScenario.logicExpression
      });

      // Mastery Update
      if (difficulty === 'easy') newStats.mastery.comparison += 1;
      if (difficulty === 'normal') newStats.mastery.logic += 1;
      
      // Badge Check: Conditional Expert
      if (currentScenario.result === 'Conditional') {
        const condCount = (parseInt(localStorage.getItem('temp_cond_count') || '0') + 1);
        localStorage.setItem('temp_cond_count', condCount.toString());
        if (condCount >= 10) {
           newStats = addBadge(newStats, 'conditional_expert');
        }
      }

    } else {
      setCombo(0);
      setFeedback({
        type: 'wrong',
        msg: `틀렸습니다. 정답은 '${currentScenario.result === 'Possible' ? '가능' : currentScenario.result === 'Impossible' ? '불가능' : '조건부'}' 입니다.`,
        logic: currentScenario.logicExpression
      });
    }

    onStatsUpdate(newStats);
    saveStats(newStats);
  };

  const nextRound = () => {
    if (currentRound < gameScenarios.length - 1) {
      setCurrentRound(r => r + 1);
      setFeedback(null);
    } else {
      // Game Over
      setIsPlaying(false);
      // Update Streak if game completed
      const finalStats = updateStreak(stats);
      onStatsUpdate(finalStats);
      alert(`게임 종료! 총 획득 점수: ${roundScore}점`);
    }
  };

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-8">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">도전! 편의점 알바왕</h2>
          <p className="text-gray-600 mt-2">난이도를 선택하고 할인 판별을 시작하세요.</p>
        </div>

        <div className="flex gap-4">
          {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-6 py-3 rounded-xl border-2 font-bold capitalize transition ${
                difficulty === d 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {d === 'easy' ? '쉬움' : d === 'normal' ? '보통' : '어려움'}
            </button>
          ))}
        </div>

        <button
          onClick={startGame}
          className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2"
        >
          <Play className="fill-current" /> 게임 시작
        </button>
      </div>
    );
  }

  const current = gameScenarios[currentRound];

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 text-sm font-medium text-gray-500">
        <span>Round {currentRound + 1} / {gameScenarios.length}</span>
        <span className={`${combo > 1 ? 'text-orange-500 font-bold' : ''}`}>
          Combo: {combo}
        </span>
        <span>Score: {roundScore}</span>
      </div>

      {/* Scenario Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6">
        <div className="bg-blue-500 p-4 text-white">
          <h3 className="font-bold text-lg">상황 카드 #{current.id}</h3>
        </div>
        <div className="p-6">
          <p className="text-lg text-gray-800 mb-6 font-medium leading-relaxed">
            {current.situation}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">적용 규칙</span>
            <p className="text-gray-700 mt-1">{current.ruleDescription}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
            {Object.entries(current.providedVariables).map(([key, val]) => (
              <div key={key} className="bg-gray-100 px-3 py-1 rounded flex justify-between">
                <span className="font-mono">{key}</span>
                <span className="font-bold">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!feedback ? (
        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => handleAnswer('Possible')} className="py-4 rounded-xl bg-green-100 text-green-700 font-bold hover:bg-green-200 border-2 border-green-200 transition">
            가능 (True)
          </button>
          <button onClick={() => handleAnswer('Impossible')} className="py-4 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 border-2 border-red-200 transition">
            불가능 (False)
          </button>
          <button onClick={() => handleAnswer('Conditional')} className="py-4 rounded-xl bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200 border-2 border-yellow-200 transition">
            조건부 (???)
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className={`p-6 rounded-xl border-2 mb-6 ${feedback.type === 'correct' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3 mb-2">
              {feedback.type === 'correct' ? <Check className="text-green-600 w-8 h-8" /> : <X className="text-red-600 w-8 h-8" />}
              <h3 className={`text-xl font-bold ${feedback.type === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                {feedback.msg}
              </h3>
            </div>
            <div className="mt-4 p-3 bg-white/80 rounded border border-black/10">
              <span className="text-xs text-gray-500 font-bold block mb-1">핵심 조건식 (Logic)</span>
              <code className="text-sm font-mono text-purple-700">{feedback.logic}</code>
            </div>
            <p className="mt-3 text-gray-700">{current.explanation}</p>
          </div>
          <button onClick={nextRound} className="w-full py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition flex items-center justify-center gap-2">
            다음 라운드 <Play className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Rule Editor Playground (Toggle) */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <button 
          onClick={() => setPlaygroundOpen(!playgroundOpen)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition"
        >
          <Code className="w-5 h-5" />
          규칙 편집 실험실 (클릭하여 열기)
        </button>
        
        {playgroundOpen && (
          <div className="mt-4 p-4 bg-slate-800 rounded-xl text-white">
             <h4 className="font-bold text-blue-300 mb-4">규칙: 총액 5만원 이상이거나 (4만원 이상 & 멤버십)</h4>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <span>총 구매액: {pgTotal.toLocaleString()}원</span>
                 <input 
                   type="range" min="30000" max="60000" step="1000" 
                   value={pgTotal} onChange={(e) => setPgTotal(Number(e.target.value))}
                   className="w-1/2"
                 />
               </div>
               <div className="flex items-center justify-between">
                 <span>멤버십 여부: {pgMember ? 'O' : 'X'}</span>
                 <button 
                   onClick={() => setPgMember(!pgMember)}
                   className={`px-3 py-1 rounded ${pgMember ? 'bg-green-500' : 'bg-red-500'} text-xs font-bold`}
                 >
                   Toggle
                 </button>
               </div>
               <div className="bg-black/30 p-3 rounded font-mono text-sm">
                 <div className="text-gray-400 mb-1">Result Logic:</div>
                 <div className="text-yellow-300">
                   ({pgTotal} &gt;= 50000) or ({pgTotal} &gt;= 40000 and {String(pgMember)})
                 </div>
                 <div className="mt-2 text-right text-xl font-bold">
                   ➜ { (pgTotal >= 50000 || (pgTotal >= 40000 && pgMember)) ? <span className="text-green-400">True (할인)</span> : <span className="text-red-400">False (정가)</span> }
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameTab;