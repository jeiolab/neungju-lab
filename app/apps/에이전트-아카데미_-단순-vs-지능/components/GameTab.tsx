import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGENT_DATA } from '../constants';
import { AgentData, AgentType } from '../types';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';
import * as Icons from 'lucide-react';

interface GameTabProps {
  updateStats: (score: number, combo: number) => void;
}

const GameTab: React.FC<GameTabProps> = ({ updateStats }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [shuffledAgents, setShuffledAgents] = useState<AgentData[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<AgentData[]>([]);

  const startGame = () => {
    const shuffled = [...AGENT_DATA].sort(() => Math.random() - 0.5);
    setShuffledAgents(shuffled);
    setCurrentCardIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(30);
    setWrongAnswers([]);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    updateStats(score, maxCombo);
  };

  const handleChoice = (selectedType: AgentType) => {
    if (currentCardIndex >= shuffledAgents.length) return;

    const currentAgent = shuffledAgents[currentCardIndex];
    const isCorrect = currentAgent.type === selectedType;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(Math.max(maxCombo, newCombo));
      setScore((prev) => prev + 100 + (newCombo * 10));
      setFeedback('correct');
    } else {
      setCombo(0);
      setWrongAnswers((prev) => [...prev, currentAgent]);
      setFeedback('wrong');
    }

    setTimeout(() => setFeedback(null), 500);

    if (currentCardIndex < shuffledAgents.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      endGame();
    }
  };

  const IconRenderer = ({ name, size = 24 }: { name: string, size?: number }) => {
    const LucideIcon = (Icons as any)[name];
    return LucideIcon ? <LucideIcon size={size} /> : <Icons.HelpCircle size={size} />;
  };

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center p-6 pb-24 h-full space-y-6 min-h-[500px]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">게임 종료!</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-indigo-50 p-6 rounded-2xl">
              <p className="text-sm text-gray-500 uppercase font-bold">최종 점수</p>
              <p className="text-4xl font-black text-indigo-600">{score}</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl">
              <p className="text-sm text-gray-500 uppercase font-bold">최대 콤보</p>
              <p className="text-4xl font-black text-orange-500">{maxCombo}</p>
            </div>
          </div>

          {wrongAnswers.length > 0 && (
            <div className="mb-8 text-left">
              <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-3">
                <AlertTriangle size={20} />
                오답 노트
              </h3>
              <div className="bg-red-50 rounded-xl p-4 max-h-48 overflow-y-auto space-y-3">
                {wrongAnswers.map((agent) => (
                  <div key={agent.id} className="border-b border-red-100 last:border-0 pb-2 last:pb-0">
                    <p className="font-bold text-gray-800">{agent.name}</p>
                    <p className="text-sm text-red-600">정답: {agent.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={startGame}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-indigo-200 text-lg"
          >
            <RotateCcw size={20} />
            다시 하기
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center min-h-[600px]">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full">
          <div className="bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600">
            <Icons.Gamepad2 size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">에이전트 분류 게임</h1>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            카드의 에이전트가 <strong>단순(Simple)</strong>인지 <strong>지능형(Intelligent)</strong>인지 빠르게 분류하세요.<br/>
            연속으로 맞추면 점수가 쑥쑥 올라갑니다!
          </p>
          <button
            onClick={startGame}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-8 rounded-xl transition-all shadow-lg shadow-indigo-200 text-xl"
          >
            <Play size={24} fill="currentColor" />
            게임 시작
          </button>
        </div>
      </div>
    );
  }

  const currentAgent = shuffledAgents[currentCardIndex];

  return (
    <div className={`relative flex flex-col items-center justify-center h-full min-h-[700px] overflow-hidden transition-colors duration-300 ${feedback === 'wrong' ? 'bg-red-50' : feedback === 'correct' ? 'bg-green-50' : 'bg-transparent'}`}>
      
      {/* HUD */}
      <div className="w-full max-w-2xl px-6 flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">남은 시간</p>
            <p className={`text-3xl font-black font-mono ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
                {timeLeft}
            </p>
        </div>
        <div className="flex flex-col items-center">
             <div className="text-xs text-gray-500 font-bold uppercase mb-1">콤보</div>
             <div className={`text-4xl font-black ${combo > 5 ? 'text-orange-500 scale-110 transition-transform' : 'text-gray-300'}`}>x{combo}</div>
        </div>
        <div className="text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">점수</p>
            <p className="text-3xl font-black text-indigo-600">{score}</p>
        </div>
      </div>

      {/* Card Area */}
      <div className="relative w-full max-w-md h-96 perspective-1000 mb-8">
        <AnimatePresence mode='wait'>
            <motion.div
                key={currentAgent.id}
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ 
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    x: feedback === 'wrong' ? [0, -10, 10, -10, 10, 0] : 0 
                }}
                exit={{ x: feedback === 'correct' ? 200 : -200, opacity: 0, rotate: feedback === 'correct' ? 20 : -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center"
            >
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 text-white shadow-lg ${feedback === 'wrong' ? 'bg-red-500' : feedback === 'correct' ? 'bg-green-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                    <IconRenderer name={currentAgent.iconName} size={64} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">{currentAgent.name}</h3>
                <p className="text-gray-500 leading-relaxed text-lg">{currentAgent.description}</p>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl px-6 grid grid-cols-2 gap-6">
        <button
            onClick={() => handleChoice(AgentType.SIMPLE)}
            className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 transition-all shadow-md active:scale-95 group"
        >
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Icons.Zap size={32} />
            </div>
            <span className="font-bold text-xl text-gray-700">단순 에이전트</span>
            <span className="text-sm text-gray-400">규칙 기반</span>
        </button>

        <button
            onClick={() => handleChoice(AgentType.INTELLIGENT)}
            className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-500 hover:bg-purple-50 transition-all shadow-md active:scale-95 group"
        >
            <div className="bg-purple-100 p-4 rounded-full text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Icons.Brain size={32} />
            </div>
            <span className="font-bold text-xl text-gray-700">지능 에이전트</span>
            <span className="text-sm text-gray-400">학습/적응형</span>
        </button>
      </div>

    </div>
  );
};

export default GameTab;