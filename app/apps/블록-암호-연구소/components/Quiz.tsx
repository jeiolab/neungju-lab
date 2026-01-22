import React, { useState, useEffect, useCallback } from 'react';
import { Bit, Difficulty } from '../types';
import { BitBlock } from './BitVisualizer';
import { Trophy, Flame, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export const Quiz: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [streak, setStreak] = useState(0);
  const [inputA, setInputA] = useState<Bit[]>([]);
  const [inputB, setInputB] = useState<Bit[]>([]);
  const [userAnswer, setUserAnswer] = useState<Bit[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const getBitLength = (d: Difficulty) => {
    switch(d) {
      case Difficulty.EASY: return 4;
      case Difficulty.MEDIUM: return 6;
      case Difficulty.HARD: return 8;
    }
  };

  const difficultyLabels: Record<Difficulty, string> = {
    [Difficulty.EASY]: '초급 (4비트)',
    [Difficulty.MEDIUM]: '중급 (6비트)',
    [Difficulty.HARD]: '고급 (8비트)',
  };

  const generateQuestion = useCallback(() => {
    const len = getBitLength(difficulty);
    const a = Array.from({ length: len }, () => Math.random() > 0.5 ? 1 : 0) as Bit[];
    const b = Array.from({ length: len }, () => Math.random() > 0.5 ? 1 : 0) as Bit[];
    setInputA(a);
    setInputB(b);
    setUserAnswer(Array(len).fill(0));
    setFeedback(null);
  }, [difficulty]);

  // Initial load
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const toggleUserBit = (index: number) => {
    if (feedback) return; // Lock if answered
    const newAns = [...userAnswer];
    newAns[index] = newAns[index] === 0 ? 1 : 0;
    setUserAnswer(newAns);
  };

  const checkAnswer = () => {
    const correct = inputA.map((bit, i) => bit ^ inputB[i]);
    const isCorrect = correct.every((bit, i) => bit === userAnswer[i]);

    if (isCorrect) {
      setFeedback('correct');
      setStreak(s => s + 1);
    } else {
      setFeedback('wrong');
      setStreak(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-cyber-800 p-4 rounded-xl border border-cyber-700">
        <div className="flex gap-2">
          {Object.values(Difficulty).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                difficulty === d ? 'bg-cyber-accent text-cyber-900' : 'bg-cyber-900 text-slate-400'
              }`}
            >
              {difficultyLabels[d].split(' ')[0]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 font-bold ${streak > 2 ? 'text-orange-500 animate-pulse' : 'text-slate-400'}`}>
            <Flame size={20} />
            <span>연속 정답: {streak}</span>
          </div>
        </div>
      </div>

      {/* Quiz Area */}
      <div className="flex flex-col items-center gap-8 py-8 bg-cyber-900/50 rounded-2xl relative overflow-hidden">
        
        {/* Confetti or visual cue could go here */}

        <div className="flex flex-col gap-2 items-center">
          <div className="text-slate-400 text-sm font-mono">입력 A (Operand A)</div>
          <div className="flex gap-2">
            {inputA.map((b, i) => <BitBlock key={`a-${i}`} value={b} size="sm" />)}
          </div>
        </div>

        <div className="text-cyber-400 font-bold text-lg">XOR</div>

        <div className="flex flex-col gap-2 items-center">
          <div className="text-slate-400 text-sm font-mono">입력 B (Operand B)</div>
          <div className="flex gap-2">
            {inputB.map((b, i) => <BitBlock key={`b-${i}`} value={b} size="sm" />)}
          </div>
        </div>

        <div className="w-full h-px bg-slate-700 max-w-md"></div>

        <div className="flex flex-col gap-2 items-center">
          <div className="text-cyber-accent text-sm font-bold font-mono">정답 입력 (클릭해서 토글)</div>
          <div className="flex gap-2 p-2 bg-cyber-800 rounded-lg border border-cyber-700">
            {userAnswer.map((b, i) => (
              <BitBlock 
                key={`ans-${i}`} 
                value={b} 
                size="md" 
                interactive={!feedback}
                onClick={() => toggleUserBit(i)}
                isResult={feedback === 'correct'}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 h-16 flex items-center justify-center">
          {!feedback ? (
            <button
              onClick={checkAnswer}
              className="px-8 py-3 bg-cyber-500 hover:bg-cyber-400 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              정답 확인
            </button>
          ) : (
            <div className="flex items-center gap-4 animate-fade-in-up">
              {feedback === 'correct' ? (
                <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
                  <CheckCircle /> 정답이야!
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400 font-bold text-xl">
                  <XCircle /> 다시 한번 생각해봐!
                </div>
              )}
              <button
                onClick={generateQuestion}
                className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors"
              >
                다음 문제 <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};