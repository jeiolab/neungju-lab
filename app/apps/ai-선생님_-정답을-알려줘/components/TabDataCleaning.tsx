import React, { useState, useEffect } from 'react';
import { CLEANING_DATA_POOL } from '../constants';
import { CleaningItem } from '../types';
import { Trash2, CheckCircle, Timer } from 'lucide-react';

const TabDataCleaning: React.FC = () => {
  const [items, setItems] = useState<CleaningItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let timer: number;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('ended');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    // Shuffle and pick
    const shuffled = [...CLEANING_DATA_POOL]
        .sort(() => Math.random() - 0.5)
        .concat([...CLEANING_DATA_POOL].sort(() => Math.random() - 0.5)); // Double list
    setItems(shuffled);
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    setFeedback(null);
  };

  const handleDecision = (decision: 'keep' | 'discard') => {
    if (items.length === 0) return;

    const currentItem = items[0];
    const isActuallyCorrect = currentItem.isCorrect;
    
    // User logic: 
    // KEEP means "This data is good" (isCorrect is true)
    // DISCARD means "This data is bad" (isCorrect is false)
    
    let userCorrect = false;
    if (decision === 'keep' && isActuallyCorrect) userCorrect = true;
    if (decision === 'discard' && !isActuallyCorrect) userCorrect = true;

    if (userCorrect) {
      setScore(prev => prev + 10);
      setFeedback("✅ 잘했어요!");
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setFeedback("❌ 틀렸어요!");
    }

    // Remove first item
    setItems(prev => prev.slice(1));
    
    // Quick reset feedback
    setTimeout(() => setFeedback(null), 500);

    if (items.length <= 1) {
        setGameState('ended');
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-2xl shadow-lg mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🧹 데이터 클리닝 게임</h2>
        <p className="text-gray-600 mb-8 text-lg">
          AI에게 잘못된 데이터를 주면 안 됩니다!<br/>
          레이블(이름표)이 잘못 붙은 데이터를 찾아내어 <strong>버려주세요(쓰레기통)</strong>.<br/>
          올바른 데이터는 <strong>보관(체크표시)</strong>하세요.
        </p>
        <button 
          onClick={startGame}
          className="bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          게임 시작 (30초)
        </button>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-2xl shadow-lg mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🏁 게임 종료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">{score}점</div>
        <p className="text-gray-600 mb-8">
            {score > 100 ? "당신은 전설적인 데이터 관리자입니다!" : "조금 더 꼼꼼히 데이터를 확인해볼까요?"}
        </p>
        <button 
          onClick={startGame}
          className="bg-gray-800 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  const currentItem = items[0];

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6 bg-gray-100 p-4 rounded-xl">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-700">
            <Timer /> {timeLeft}초
        </div>
        <div className="font-bold text-2xl text-gray-800">점수: {score}</div>
      </div>

      <div className="relative bg-white border-2 border-indigo-100 rounded-3xl p-10 shadow-xl flex flex-col items-center min-h-[400px]">
        {feedback && (
            <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white font-bold animate-pulse ${feedback.includes('✅') ? 'bg-green-500' : 'bg-red-500'}`}>
                {feedback}
            </div>
        )}
        
        <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="text-[8rem] mb-4 drop-shadow-md transition-all duration-300 transform hover:scale-105">
                {currentItem?.imageEmoji}
            </div>
            
            <div className="bg-gray-50 border border-gray-200 px-6 py-2 rounded-full mb-2">
                <span className="text-gray-500 text-sm">이 데이터의 라벨:</span>
            </div>
            <div className="text-4xl font-black text-gray-800 tracking-wide">
                "{currentItem?.assignedLabel}"
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => handleDecision('discard')}
          className="flex items-center justify-center gap-2 p-4 bg-red-100 text-red-700 rounded-2xl font-bold text-lg hover:bg-red-200 transition-colors border-2 border-red-200 active:scale-95"
        >
          <Trash2 /> 잘못됨 (버리기)
        </button>
        <button
          onClick={() => handleDecision('keep')}
          className="flex items-center justify-center gap-2 p-4 bg-green-100 text-green-700 rounded-2xl font-bold text-lg hover:bg-green-200 transition-colors border-2 border-green-200 active:scale-95"
        >
          <CheckCircle /> 정확함 (보관)
        </button>
      </div>
    </div>
  );
};

export default TabDataCleaning;