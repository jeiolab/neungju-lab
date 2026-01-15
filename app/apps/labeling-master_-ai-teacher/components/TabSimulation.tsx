import React, { useState, useEffect } from 'react';
import { SIMULATION_ITEMS } from '../constants';
import { SimItem } from '../types';
import { RefreshCw, Play, Trophy } from 'lucide-react';

interface TabSimulationProps {
  onScore: (points: number) => void;
}

const TabSimulation: React.FC<TabSimulationProps> = ({ onScore }) => {
  const [queue, setQueue] = useState<SimItem[]>([...SIMULATION_ITEMS]);
  const [currentItem, setCurrentItem] = useState<SimItem | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (queue.length > 0 && !currentItem) {
      setCurrentItem(queue[0]);
    } else if (queue.length === 0 && !currentItem) {
      setIsFinished(true);
    }
  }, [queue, currentItem]);

  const handleDragStart = (e: React.DragEvent, item: SimItem) => {
    e.dataTransfer.setData('text/plain', item.type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetLabel: 'apple' | 'banana') => {
    e.preventDefault();
    if (!currentItem) return;

    const draggedType = currentItem.type;
    
    if (draggedType === targetLabel) {
      // Correct
      setScore(s => s + 1);
      setFeedback({ msg: "정확해요! (+10점)", type: 'success' });
      onScore(10);
      nextItem();
    } else {
      // Incorrect
      setMistakes(m => m + 1);
      setFeedback({ msg: `틀렸습니다! 이것은 ${currentItem.type === 'apple' ? '사과' : '바나나'}입니다.`, type: 'error' });
      // Shake effect or delay could be added here
    }
  };

  const nextItem = () => {
    setQueue(prev => prev.slice(1));
    setCurrentItem(null);
    setTimeout(() => setFeedback(null), 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const resetSimulation = () => {
    setQueue([...SIMULATION_ITEMS]);
    setCurrentItem(null);
    setScore(0);
    setMistakes(0);
    setIsFinished(false);
    setFeedback(null);
  };

  if (isFinished) {
    const accuracy = Math.round((score / (score + mistakes)) * 100) || 0;
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 mt-10">
        <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
        <h2 className="text-3xl font-bold text-gray-800">모델 훈련 완료!</h2>
        <div className="text-lg text-gray-600">
          <p>정확도: <span className="text-indigo-600 font-bold text-2xl">{accuracy}%</span></p>
          <p className="mt-2">획득 포인트: {score * 10} 점</p>
        </div>
        <button
          onClick={resetSimulation}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-5 h-5" />
          <span>다시 훈련하기</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2 text-indigo-800">
          <Play className="w-6 h-6" />
          <h2 className="text-2xl font-bold">AI 훈련소</h2>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-mono">
          남은 데이터: {queue.length}
        </div>
      </div>

      <div className="text-center mb-4 h-8">
        {feedback && (
          <span className={`px-4 py-2 rounded-lg font-bold ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback.msg}
          </span>
        )}
      </div>

      <div className="flex justify-between w-full gap-8">
        {/* Apple Bin */}
        <div
          onDrop={(e) => handleDrop(e, 'apple')}
          onDragOver={handleDragOver}
          className="flex-1 h-64 border-4 border-dashed border-red-200 bg-red-50 rounded-3xl flex flex-col items-center justify-center transition-colors hover:bg-red-100 hover:border-red-300"
        >
          <span className="text-6xl mb-4">🍎</span>
          <h3 className="text-xl font-bold text-red-800">사과</h3>
          <p className="text-red-400 text-sm">여기로 드래그하세요</p>
        </div>

        {/* Central Data Point */}
        <div className="w-64 flex flex-col items-center justify-center space-y-4">
          {currentItem && (
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, currentItem)}
              className="w-40 h-40 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center cursor-move transform transition-transform hover:scale-105 border-2 border-indigo-100 active:cursor-grabbing"
            >
              <span className="text-6xl mb-2 select-none">{currentItem.icon}</span>
              <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">{currentItem.feature}</p>
              <p className="text-xs text-indigo-400 mt-2 font-bold animate-pulse">드래그하여 분류!</p>
            </div>
          )}
        </div>

        {/* Banana Bin */}
        <div
          onDrop={(e) => handleDrop(e, 'banana')}
          onDragOver={handleDragOver}
          className="flex-1 h-64 border-4 border-dashed border-yellow-200 bg-yellow-50 rounded-3xl flex flex-col items-center justify-center transition-colors hover:bg-yellow-100 hover:border-yellow-300"
        >
          <span className="text-6xl mb-4">🍌</span>
          <h3 className="text-xl font-bold text-yellow-800">바나나</h3>
          <p className="text-yellow-500 text-sm">여기로 드래그하세요</p>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        * PC에서는 마우스로 드래그, 모바일에서는 터치하여 드래그하세요.
      </div>
    </div>
  );
};

export default TabSimulation;