import React, { useState, useEffect, useCallback } from 'react';
import { Concept } from '../types';
import { Zap, CheckCircle2, RotateCcw } from 'lucide-react';

// Simple Fisher-Yates shuffle implementation
function simpleShuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface Props {
  concepts: Concept[];
  onComplete: () => void;
}

const MatchingGame: React.FC<Props> = ({ concepts, onComplete }) => {
  const [leftItems, setLeftItems] = useState<{ id: string; text: string }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: string; text: string }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [gameWon, setGameWon] = useState(false);

  const startNewGame = useCallback(() => {
    // Explicitly specify Generic type T as Concept to avoid inference errors
    const roundConcepts: Concept[] = simpleShuffle<Concept>(concepts).slice(0, 4);
    
    setLeftItems(simpleShuffle(roundConcepts.map((c: Concept) => ({ id: c.id, text: c.term }))));
    setRightItems(simpleShuffle(roundConcepts.map((c: Concept) => ({ id: c.id, text: c.example }))));
    setMatchedIds(new Set());
    setGameWon(false);
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [concepts]);

  // Initial game start
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Check win condition
  useEffect(() => {
    if (!gameWon && leftItems.length > 0 && matchedIds.size === leftItems.length) {
      setGameWon(true);
      onComplete();
    }
  }, [matchedIds, leftItems, onComplete, gameWon]);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        // Match found
        setMatchedIds(prev => new Set(prev).add(selectedLeft));
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // No match, reset after delay
        const timer = setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLeft, selectedRight]);

  const handleLeftClick = (id: string) => {
    if (matchedIds.has(id)) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.has(id)) return;
    setSelectedRight(id);
  };

  const getButtonClass = (id: string, isLeft: boolean) => {
    const isMatched = matchedIds.has(id);
    const isSelected = isLeft ? selectedLeft === id : selectedRight === id;
    const isError = selectedLeft && selectedRight && selectedLeft !== selectedRight && isSelected;

    let base = "p-4 rounded-xl border-2 text-sm md:text-base font-medium transition-all duration-200 cursor-pointer shadow-sm min-h-[80px] flex items-center justify-center text-center ";
    
    if (isMatched) return base + "bg-green-100 border-green-400 text-green-700 opacity-50 cursor-default scale-95";
    if (isError) return base + "bg-red-50 border-red-400 text-red-600 animate-shake";
    if (isSelected) return base + "bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-200";
    
    return base + "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50";
  };

  return (
    <div className="flex flex-col items-center h-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <Zap className="text-yellow-500 fill-yellow-500" />
        용어 연결 시뮬레이션
      </h2>
      <p className="text-slate-500 mb-8 text-center">왼쪽의 기술 용어와 오른쪽의 올바른 사례를 연결하세요.</p>

      {gameWon ? (
        <div className="flex flex-col items-center justify-center flex-1 animate-fade-in">
          <CheckCircle2 size={64} className="text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-slate-800">연결 성공!</h3>
          <p className="text-slate-600 mt-2">모든 개념을 올바르게 이해했네요.</p>
          <button 
            onClick={startNewGame} 
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 font-bold transition-transform hover:scale-105 active:scale-95"
          >
            <RotateCcw size={20} />
            새로운 게임 시작
          </button>
        </div>
      ) : (
        <div className="flex w-full gap-4 md:gap-16">
          <div className="flex-1 flex flex-col gap-4">
            {leftItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                className={getButtonClass(item.id, true)}
                disabled={matchedIds.has(item.id)}
              >
                {item.text}
              </button>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {rightItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                className={getButtonClass(item.id, false)}
                disabled={matchedIds.has(item.id)}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MatchingGame;