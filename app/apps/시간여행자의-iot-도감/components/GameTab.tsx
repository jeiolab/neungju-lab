import React, { useState, useEffect } from 'react';
import { IOT_ITEMS } from '../constants';
import { IoTItem } from '../types';
import { Timer, Zap, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface GameTabProps {
  onUnlockItem: (itemId: string) => void;
}

const GameTab: React.FC<GameTabProps> = ({ onUnlockItem }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [currentItem, setCurrentItem] = useState<IoTItem | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('ended');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setGameState('playing');
    pickRandomItem();
  };

  const pickRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * IOT_ITEMS.length);
    setCurrentItem(IOT_ITEMS[randomIndex]);
    setFeedback('none');
    setFeedbackMsg('');
  };

  const handleGuess = (guessIoT: boolean) => {
    if (!currentItem || feedback !== 'none') return;

    const isCorrect = currentItem.isIoT === guessIoT;

    if (isCorrect) {
      const comboMultiplier = 1 + Math.floor(combo / 5) * 0.5;
      const points = Math.round(100 * comboMultiplier);
      setScore((prev) => prev + points);
      setCombo((prev) => prev + 1);
      setFeedback('correct');
      setFeedbackMsg(currentItem.reason);
      
      if (currentItem.isIoT) {
        onUnlockItem(currentItem.id);
      }
    } else {
      setCombo(0);
      setFeedback('wrong');
      // Decrement time penalty
      setTimeLeft((prev) => Math.max(0, prev - 5));
      setFeedbackMsg(`틀렸습니다! ${currentItem.name}은(는) ${currentItem.isIoT ? 'IoT 기기입니다.' : 'IoT 기기가 아닙니다.'}\n이유: ${currentItem.reason}`);
    }

    // Auto advance
    setTimeout(() => {
      if (timeLeft > 0) pickRandomItem();
    }, 2000);
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-10">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-md w-full">
          <Zap size={64} className="mx-auto text-yellow-500 mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold mb-4 text-slate-900">시간여행자의 미션</h2>
          <p className="text-slate-600 mb-8">
            과거에서 온 물건과 미래의 IoT 물건이 뒤섞여 있습니다.<br/>
            60초 동안 정확하게 분류하여 도감을 완성하세요!
          </p>
          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-xl font-bold text-white hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
          >
            미션 시작하기
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-10">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-md w-full">
          <h2 className="text-4xl font-bold mb-2 text-slate-900">미션 종료!</h2>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-6">
            {score.toLocaleString()} 점
          </div>
          <p className="text-slate-600 mb-8">
            도감 탭에서 획득한 IoT 아이템을 확인해보세요.
          </p>
          <button
            onClick={startGame}
            className="w-full py-3 bg-slate-100 border border-slate-200 rounded-xl text-lg font-bold text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} /> 다시 도전하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex justify-between items-center bg-white/90 p-4 rounded-xl backdrop-blur-sm mb-4 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Timer className="text-red-500" />
          <span className={`text-xl font-bold font-mono ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Score</span>
            <span className="text-2xl font-bold text-cyan-600">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500">Combo</span>
          <span className="text-xl font-bold text-yellow-500">x{combo}</span>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {currentItem && (
          <div className={`relative w-full aspect-[4/3] md:aspect-video bg-white rounded-3xl overflow-hidden shadow-xl border-4 transition-all duration-300 transform ${
            feedback === 'correct' ? 'border-green-400 scale-105' : 
            feedback === 'wrong' ? 'border-red-400 shake' : 'border-slate-200'
          }`}>
             {/* Image Placeholder */}
            <img 
              src={`https://picsum.photos/seed/${currentItem.imageKeyword}/600/400`} 
              alt={currentItem.name}
              className="w-full h-full object-cover opacity-90"
            />
            
            {/* Content Overlay - keeping dark background for text readability on image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/40">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{currentItem.name}</h3>
              <p className="text-slate-100 text-lg bg-black/40 p-2 rounded-lg backdrop-blur-sm">
                {currentItem.description}
              </p>
              
              {/* Feedback Overlay - light theme for feedback */}
              {feedback !== 'none' && (
                 <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 animate-fade-in z-20">
                    {feedback === 'correct' ? (
                        <CheckCircle size={64} className="text-green-500 mb-4" />
                    ) : (
                        <XCircle size={64} className="text-red-500 mb-4" />
                    )}
                    <p className="text-xl font-bold text-slate-900 mb-2">
                        {feedback === 'correct' ? '정답입니다!' : '오답입니다!'}
                    </p>
                    <p className="text-slate-600 text-center mb-4 font-medium">{feedbackMsg}</p>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {currentItem.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 border border-slate-200 font-bold">
                                #{tag}
                            </span>
                        ))}
                    </div>
                 </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mt-6 h-24">
        <button
          onClick={() => handleGuess(false)}
          disabled={feedback !== 'none'}
          className={`rounded-2xl flex items-center justify-center text-xl font-bold transition-all border-b-4 active:border-b-0 active:translate-y-1 shadow-md ${
            feedback !== 'none' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-rose-500 border-rose-100 hover:bg-rose-50 hover:border-rose-200 ring-2 ring-rose-500/20'
          }`}
        >
          <XCircle className="mr-2" /> IoT 아님 (X)
        </button>
        <button
          onClick={() => handleGuess(true)}
          disabled={feedback !== 'none'}
          className={`rounded-2xl flex items-center justify-center text-xl font-bold transition-all border-b-4 active:border-b-0 active:translate-y-1 shadow-md ${
            feedback !== 'none' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 ring-2 ring-emerald-500/20'
          }`}
        >
          <CheckCircle className="mr-2" /> IoT 맞음 (O)
        </button>
      </div>
    </div>
  );
};

export default GameTab;