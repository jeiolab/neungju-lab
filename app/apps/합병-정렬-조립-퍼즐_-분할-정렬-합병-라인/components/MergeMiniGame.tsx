import React, { useState, useEffect, useCallback } from 'react';
import { OrderItem, UserStats } from '../types';
import { FOOD_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  userStats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
}

const generateSortedArray = (size: number, startId: number): OrderItem[] => {
  const arr: OrderItem[] = [];
  let currentId = startId;
  for (let i = 0; i < size; i++) {
    currentId += Math.floor(Math.random() * 5) + 1;
    arr.push({
      id: currentId,
      name: `${FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)]}`,
      value: currentId
    });
  }
  return arr; // Already sorted because we incremented ID
};

const MergeMiniGame: React.FC<Props> = ({ userStats, updateStats }) => {
  const [leftArray, setLeftArray] = useState<OrderItem[]>([]);
  const [rightArray, setRightArray] = useState<OrderItem[]>([]);
  const [mergedArray, setMergedArray] = useState<OrderItem[]>([]);
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING' | 'WON' | 'LOST'>('IDLE');
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState(0);

  const startNewGame = useCallback(() => {
    const left = generateSortedArray(4, 100);
    const right = generateSortedArray(4, 102); // Interleaved values likely
    setLeftArray(left);
    setRightArray(right);
    setMergedArray([]);
    setGameStatus('PLAYING');
    setMessage('두 주문 목록 중, 주문 번호가 더 작은(빠른) 것을 선택하세요!');
  }, []);

  useEffect(() => {
    if (gameStatus === 'IDLE') startNewGame();
  }, [gameStatus, startNewGame]);

  const handleSelect = (side: 'LEFT' | 'RIGHT') => {
    if (gameStatus !== 'PLAYING') return;

    const leftVal = leftArray.length > 0 ? leftArray[0].value : Infinity;
    const rightVal = rightArray.length > 0 ? rightArray[0].value : Infinity;

    let isCorrect = false;
    let selectedItem: OrderItem | null = null;

    if (side === 'LEFT') {
      if (leftArray.length === 0) {
        setMessage('왼쪽 목록이 비었습니다!');
        return;
      }
      if (leftVal <= rightVal) {
        isCorrect = true;
        selectedItem = leftArray[0];
        setLeftArray(prev => prev.slice(1));
      } else {
        setMessage('앗! 오른쪽 주문 번호가 더 작아요. 순서대로 합쳐야 합니다.');
      }
    } else {
      if (rightArray.length === 0) {
        setMessage('오른쪽 목록이 비었습니다!');
        return;
      }
      if (rightVal <= leftVal) {
        isCorrect = true;
        selectedItem = rightArray[0];
        setRightArray(prev => prev.slice(1));
      } else {
         setMessage('앗! 왼쪽 주문 번호가 더 작아요. 순서대로 합쳐야 합니다.');
      }
    }

    if (isCorrect && selectedItem) {
      setMergedArray(prev => [...prev, selectedItem!]);
      setMessage('잘했습니다! 다음은 무엇일까요?');
      setStreak(prev => prev + 1);
      
      // Update Stats
      const newConsecutive = userStats.consecutiveMerges + 1;
      updateStats({
        consecutiveMerges: newConsecutive,
        xp: userStats.xp + 5
      });
    } else {
      setStreak(0);
      updateStats({ consecutiveMerges: 0 });
      // Shake effect or penalty could go here
    }
  };

  useEffect(() => {
    if (gameStatus === 'PLAYING' && leftArray.length === 0 && rightArray.length === 0) {
      setGameStatus('WON');
      setMessage('완벽합니다! 두 목록을 성공적으로 합병했습니다.');
      updateStats({ 
        mergeGameWins: userStats.mergeGameWins + 1,
        xp: userStats.xp + 50,
        completedPuzzles: userStats.completedPuzzles + 1
      });
    }
  }, [leftArray, rightArray, gameStatus, userStats, updateStats]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">합병(Merge) 미니게임</h2>
      <p className="mb-6 text-gray-600 text-center bg-white p-3 rounded-lg shadow-sm border border-blue-100">
        {message}
      </p>
      
      <div className="flex justify-between w-full gap-8 mb-8">
        {/* Left List */}
        <div className="flex-1 bg-blue-50 p-4 rounded-xl shadow-inner border-2 border-blue-200 min-h-[200px] flex flex-col items-center">
            <h3 className="font-bold text-blue-700 mb-2">A 라인 대기열</h3>
            <AnimatePresence>
            {leftArray.map((item, index) => (
                <motion.div
                    key={`left-${item.id}`}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => index === 0 && handleSelect('LEFT')}
                    className={`w-full p-3 mb-2 rounded-lg border-2 flex justify-between items-center cursor-pointer transition-colors
                        ${index === 0 ? 'bg-white border-blue-500 hover:bg-blue-100 shadow-md scale-105' : 'bg-gray-100 border-transparent opacity-60'}
                    `}
                >
                    <span className="font-bold text-gray-800">#{item.id}</span>
                    <span className="text-sm text-gray-600">{item.name}</span>
                </motion.div>
            ))}
            </AnimatePresence>
            {leftArray.length === 0 && <div className="text-gray-400 mt-10">비어있음</div>}
        </div>

        {/* Right List */}
        <div className="flex-1 bg-orange-50 p-4 rounded-xl shadow-inner border-2 border-orange-200 min-h-[200px] flex flex-col items-center">
            <h3 className="font-bold text-orange-700 mb-2">B 라인 대기열</h3>
            <AnimatePresence>
            {rightArray.map((item, index) => (
                <motion.div
                    key={`right-${item.id}`}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => index === 0 && handleSelect('RIGHT')}
                    className={`w-full p-3 mb-2 rounded-lg border-2 flex justify-between items-center cursor-pointer transition-colors
                        ${index === 0 ? 'bg-white border-orange-500 hover:bg-orange-100 shadow-md scale-105' : 'bg-gray-100 border-transparent opacity-60'}
                    `}
                >
                    <span className="font-bold text-gray-800">#{item.id}</span>
                    <span className="text-sm text-gray-600">{item.name}</span>
                </motion.div>
            ))}
            </AnimatePresence>
            {rightArray.length === 0 && <div className="text-gray-400 mt-10">비어있음</div>}
        </div>
      </div>

      {/* Merged Result */}
      <div className="w-full bg-green-50 p-6 rounded-xl border-2 border-green-200 min-h-[120px]">
        <h3 className="font-bold text-green-700 mb-2 text-center">합병 완료 라인 (오름차순)</h3>
        <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence>
            {mergedArray.map((item) => (
                <motion.div
                    key={`merged-${item.id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white px-3 py-1 rounded-full border border-green-300 shadow-sm text-sm font-medium text-green-800"
                >
                    #{item.id} {item.name}
                </motion.div>
            ))}
            </AnimatePresence>
        </div>
      </div>

      {gameStatus === 'WON' && (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={startNewGame}
            className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
            다음 주문 묶음 처리하기 (재시작)
        </motion.button>
      )}
    </div>
  );
};

export default MergeMiniGame;
