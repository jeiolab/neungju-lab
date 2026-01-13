import React, { useState, useEffect, useRef } from 'react';
import { BitSwitch } from '../components/BitSwitch';
import { BIT_VALUES, calculateDecimal, generateRandomTarget } from '../types';
import { Timer, Trophy, AlertCircle, Play } from 'lucide-react';

export const Challenge: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [target, setTarget] = useState(0);
  const [bits, setBits] = useState<boolean[]>(new Array(8).fill(false));
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('ipHackerHighScore') || '0');
  });

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  // Check win condition
  const currentSum = calculateDecimal(bits);
  useEffect(() => {
    if (isPlaying && currentSum === target) {
      // Correct answer!
      setScore(s => s + 1);
      nextRound();
    }
  }, [currentSum, target, isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    nextRound();
  };

  const nextRound = () => {
    setTarget(generateRandomTarget());
    setBits(new Array(8).fill(false));
  };

  const endGame = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('ipHackerHighScore', score.toString());
    }
  };

  const toggleBit = (index: number) => {
    if (!isPlaying) return;
    const newBits = [...bits];
    newBits[index] = !newBits[index];
    setBits(newBits);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Game HUD */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="text-xs text-slate-500 uppercase font-bold">Time Left</div>
          <div className={`text-3xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>
            {timeLeft}s
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="text-xs text-slate-500 uppercase font-bold">Score</div>
          <div className="text-3xl font-mono font-bold text-green-600">{score}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="text-xs text-slate-500 uppercase font-bold">Best</div>
          <div className="text-3xl font-mono font-bold text-slate-400">{highScore}</div>
        </div>
      </div>

      {!isPlaying ? (
        <div className="text-center bg-white p-12 rounded-xl border-2 border-dashed border-slate-300">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {timeLeft === 0 ? "Time's Up!" : "해커 챌린지"}
          </h2>
          <p className="text-slate-500 mb-6">
            {timeLeft === 0 
              ? `최종 점수: ${score}점` 
              : "60초 동안 최대한 많은 IP 주소를 해독하세요."}
          </p>
          <button
            onClick={startGame}
            className="bg-slate-900 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-slate-800 transition-transform active:scale-95 flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            {timeLeft === 0 ? "다시 도전하기" : "게임 시작"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
           {/* Active Game Area */}
           <div className="bg-slate-900 text-green-400 p-6 rounded-xl text-center shadow-inner font-mono relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20">
               <div className="h-full bg-green-500 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft/60)*100}%` }}></div>
             </div>
             <div className="text-sm text-green-500/80 mb-1">DECRYPT TARGET</div>
             <div className="text-5xl font-bold tracking-widest">{target}</div>
           </div>

           <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              {BIT_VALUES.map((val, idx) => (
                <BitSwitch 
                  key={val}
                  bitValue={val}
                  isOn={bits[idx]}
                  onToggle={() => toggleBit(idx)}
                />
              ))}
            </div>
          </div>
          
          <div className="text-center font-mono text-xl text-slate-400">
             Current: <span className={`${currentSum === target ? 'text-green-600' : 'text-slate-900'} font-bold`}>{currentSum}</span>
          </div>
        </div>
      )}
    </div>
  );
};