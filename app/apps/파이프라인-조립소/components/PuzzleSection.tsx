import React, { useState, useEffect } from 'react';
import { PuzzleDifficulty, PuzzleItem } from '../types';
import { PUZZLE_ITEMS_EASY, PUZZLE_ITEMS_MEDIUM_TOKENS, PUZZLE_SCENARIO_HARD } from '../data';
import { completePuzzle } from '../services/gamification';
import { Shuffle, Check, ArrowRight, RotateCcw, Award } from 'lucide-react';

const PuzzleSection: React.FC = () => {
  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>(PuzzleDifficulty.EASY);
  const [items, setItems] = useState<PuzzleItem[]>([]);
  const [slots, setSlots] = useState<(PuzzleItem | null)[]>([]);
  const [tokenSlots, setTokenSlots] = useState<{ [key: string]: PuzzleItem | null }>({}); // For Medium
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Selection for click-to-move
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null); // Index in 'items' (pool)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null); // Index in 'slots' (main pipeline)

  useEffect(() => {
    resetGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const resetGame = () => {
    setFeedback(null);
    setIsCorrect(false);
    setTokenSlots({
        slot_before_perception: null,
        slot_center: null,
        slot_after_action: null
    });

    let initialItems: PuzzleItem[] = [];
    
    if (difficulty === PuzzleDifficulty.EASY) {
      initialItems = [...PUZZLE_ITEMS_EASY];
      setSlots(Array(4).fill(null));
    } else if (difficulty === PuzzleDifficulty.MEDIUM) {
      initialItems = [...PUZZLE_ITEMS_EASY, ...PUZZLE_ITEMS_MEDIUM_TOKENS];
      setSlots(Array(4).fill(null)); // Main pipeline slots
    } else {
      initialItems = [...PUZZLE_SCENARIO_HARD];
      setSlots(Array(4).fill(null));
    }

    // Shuffle
    setItems(initialItems.sort(() => Math.random() - 0.5));
  };

  const handleItemClick = (index: number) => {
    if (isCorrect) return;
    if (selectedItemIndex === index) {
      setSelectedItemIndex(null); // Deselect
    } else {
      setSelectedItemIndex(index);
      setSelectedSlotIndex(null); // Clear slot selection if any
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    if (isCorrect) return;

    // If an item is selected from the pool, place it here
    if (selectedItemIndex !== null) {
      const newItem = items[selectedItemIndex];
      const newItems = [...items];
      newItems.splice(selectedItemIndex, 1); // Remove from pool
      
      const newSlots = [...slots];
      const existingItem = newSlots[slotIndex];
      
      newSlots[slotIndex] = newItem;
      
      if (existingItem) {
        newItems.push(existingItem); // Return existing to pool
      }

      setItems(newItems);
      setSlots(newSlots);
      setSelectedItemIndex(null);
    } 
    // If clicking a filled slot without selection, return to pool
    else if (slots[slotIndex]) {
        const item = slots[slotIndex]!;
        setSlots(slots.map((s, i) => i === slotIndex ? null : s));
        setItems([...items, item]);
    }
  };

  const handleTokenSlotClick = (slotId: string) => {
    if (difficulty !== PuzzleDifficulty.MEDIUM || isCorrect) return;

    if (selectedItemIndex !== null) {
        const item = items[selectedItemIndex];
        // Only allow tokens
        if (item.type !== 'TOKEN') {
            setFeedback("이곳에는 '단계' 카드를 놓을 수 없습니다.");
            setTimeout(() => setFeedback(null), 2000);
            return;
        }

        const newItems = [...items];
        newItems.splice(selectedItemIndex, 1);
        
        const existingToken = tokenSlots[slotId];
        
        setTokenSlots(prev => ({ ...prev, [slotId]: item }));
        
        if (existingToken) {
            newItems.push(existingToken);
        }
        
        setItems(newItems);
        setSelectedItemIndex(null);
    } else if (tokenSlots[slotId]) {
        const token = tokenSlots[slotId]!;
        setTokenSlots(prev => ({ ...prev, [slotId]: null }));
        setItems([...items, token]);
    }
  };

  const checkAnswer = () => {
    let allCorrect = true;
    let errorMsg = "";

    // Check Pipeline Order (Easy/Medium/Hard main slots)
    // Correct Order IDs: p_1, p_2, p_3, p_4 OR h_1, h_2, h_3, h_4
    const correctOrderPrefix = difficulty === PuzzleDifficulty.HARD ? 'h_' : 'p_';
    
    slots.forEach((item, index) => {
      if (!item) {
        allCorrect = false;
        errorMsg = "빈 칸을 모두 채워주세요.";
        return;
      }
      const expectedId = `${correctOrderPrefix}${index + 1}`;
      if (item.id !== expectedId) {
        allCorrect = false;
        errorMsg = "순서가 맞지 않는 부분이 있습니다. 다시 생각해보세요!";
      }
    });

    if (difficulty === PuzzleDifficulty.MEDIUM) {
        // Check tokens
        if (!tokenSlots.slot_before_perception || tokenSlots.slot_before_perception.id !== 't_sensor') allCorrect = false;
        if (!tokenSlots.slot_center || tokenSlots.slot_center.id !== 't_agent_fn') allCorrect = false;
        if (!tokenSlots.slot_after_action || tokenSlots.slot_after_action.id !== 't_actuator') allCorrect = false;
        
        if (!allCorrect && !errorMsg) errorMsg = "토큰의 위치가 정확하지 않습니다. 센서와 액추에이터는 어디에 연결될까요?";
    }

    if (allCorrect) {
      setIsCorrect(true);
      setFeedback("정답입니다! 파이프라인이 완벽하게 작동합니다.");
      completePuzzle(difficulty);
    } else {
      setFeedback(errorMsg || "오답입니다. 힌트: 인식 → 학습 → 추론 → 행동");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 md:pb-4 h-full flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-black text-slate-900">파이프라인 조립소</h1>
           <p className="text-sm text-slate-500">조각을 터치하여 올바른 위치로 옮기세요.</p>
        </div>
        
        <div className="flex bg-slate-100 rounded-lg p-1">
            {(Object.keys(PuzzleDifficulty) as Array<keyof typeof PuzzleDifficulty>).map((diff) => (
                <button
                    key={diff}
                    onClick={() => setDifficulty(PuzzleDifficulty[diff])}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        difficulty === PuzzleDifficulty[diff] ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                    }`}
                >
                    {diff === 'EASY' ? '초급' : diff === 'MEDIUM' ? '중급' : '고급'}
                </button>
            ))}
        </div>
      </header>

      {/* Game Area */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* The Pipeline (Drop Zones) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-8 flex flex-col items-center justify-center min-h-[300px] relative">
            
            {difficulty === PuzzleDifficulty.MEDIUM && (
                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                    <div className="w-full h-2 bg-slate-900"></div>
                 </div>
            )}

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full justify-center relative z-10">
                
                {/* Medium Mode: Sensor Slot */}
                {difficulty === PuzzleDifficulty.MEDIUM && (
                    <div 
                        onClick={() => handleTokenSlotClick('slot_before_perception')}
                        className={`w-20 h-20 md:w-24 md:h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer transition-colors
                        ${tokenSlots['slot_before_perception'] ? 'bg-orange-100 border-orange-300' : 'bg-white border-slate-300 hover:bg-slate-100'}
                        `}
                    >
                         {tokenSlots['slot_before_perception'] ? (
                            <span className="text-xs text-center font-bold text-orange-700">{tokenSlots['slot_before_perception']?.label}</span>
                         ) : (
                            <span className="text-[10px] text-slate-400 text-center">입력<br/>(센서)</span>
                         )}
                    </div>
                )}

                {/* Main 4 Slots */}
                {slots.map((slot, index) => (
                    <React.Fragment key={index}>
                         {index > 0 && <ArrowRight className="text-slate-300 w-6 h-6 hidden md:block" />}
                         {index > 0 && <div className="h-4 w-0 border-l border-slate-300 md:hidden my-1"></div>}
                         
                         <div 
                            onClick={() => handleSlotClick(index)}
                            className={`w-full md:w-40 h-16 md:h-32 border-2 rounded-xl flex items-center justify-center p-2 cursor-pointer transition-all relative
                                ${slot 
                                    ? (isCorrect ? 'bg-green-50 border-green-500' : 'bg-white border-blue-200 shadow-sm') 
                                    : 'bg-slate-100 border-dashed border-slate-300 hover:border-blue-300'
                                }
                                ${selectedSlotIndex === index ? 'ring-2 ring-blue-400' : ''}
                            `}
                         >
                            <div className="absolute top-1 left-2 text-[10px] text-slate-400 font-mono">
                                {index + 1}
                            </div>
                            {slot ? (
                                <div className="text-center">
                                    <div className="font-bold text-slate-800">{slot.label}</div>
                                    <div className="text-[10px] text-slate-500">{slot.description}</div>
                                </div>
                            ) : (
                                <span className="text-xs text-slate-400">빈 칸</span>
                            )}
                         </div>
                    </React.Fragment>
                ))}

                 {/* Medium Mode: Actuator Slot */}
                 {difficulty === PuzzleDifficulty.MEDIUM && (
                    <div 
                        onClick={() => handleTokenSlotClick('slot_after_action')}
                        className={`w-20 h-20 md:w-24 md:h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer transition-colors
                        ${tokenSlots['slot_after_action'] ? 'bg-orange-100 border-orange-300' : 'bg-white border-slate-300 hover:bg-slate-100'}
                        `}
                    >
                         {tokenSlots['slot_after_action'] ? (
                            <span className="text-xs text-center font-bold text-orange-700">{tokenSlots['slot_after_action']?.label}</span>
                         ) : (
                            <span className="text-[10px] text-slate-400 text-center">출력<br/>(장치)</span>
                         )}
                    </div>
                )}

            </div>

             {/* Medium Mode: Agent Function (Center Top) */}
             {difficulty === PuzzleDifficulty.MEDIUM && (
                 <div className="mt-8">
                     <div 
                        onClick={() => handleTokenSlotClick('slot_center')}
                        className={`w-48 h-12 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors
                        ${tokenSlots['slot_center'] ? 'bg-purple-100 border-purple-300' : 'bg-white border-slate-300 hover:bg-slate-100'}
                        `}
                    >
                         {tokenSlots['slot_center'] ? (
                            <span className="text-sm font-bold text-purple-700">{tokenSlots['slot_center']?.label}</span>
                         ) : (
                            <span className="text-xs text-slate-400">매핑 규칙 (함수)</span>
                         )}
                    </div>
                 </div>
             )}

        </div>

        {/* Feedback Area */}
        {feedback && (
            <div className={`p-4 rounded-lg text-center font-medium animate-bounce-in ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isCorrect && <Award className="inline w-5 h-5 mr-2 mb-1" />}
                {feedback}
            </div>
        )}

        {/* Item Pool */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Shuffle className="w-4 h-4" /> 부품 보관함
            </h3>
            <div className="flex flex-wrap gap-3 min-h-[80px]">
                {items.length === 0 && !isCorrect && (
                    <div className="w-full text-center text-slate-400 text-sm py-4">모든 부품을 배치했습니다. '검사하기'를 눌러보세요!</div>
                )}
                {isCorrect && items.length === 0 && (
                     <div className="w-full text-center text-green-500 text-sm py-4 font-bold">성공!</div>
                )}
                
                {items.map((item, idx) => (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(idx)}
                        disabled={isCorrect}
                        className={`px-4 py-3 rounded-lg border shadow-sm text-sm font-medium transition-all
                            ${item.type === 'TOKEN' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-white border-slate-200 text-slate-700'}
                            ${selectedItemIndex === idx ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:bg-slate-50'}
                        `}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
             <button 
                onClick={resetGame}
                className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors"
            >
                <RotateCcw className="w-5 h-5" /> 다시하기
            </button>
            <button 
                onClick={checkAnswer}
                disabled={isCorrect}
                className={`flex-[2] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-white shadow-lg shadow-blue-200
                    ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
                `}
            >
                <Check className="w-5 h-5" /> {isCorrect ? '완료됨' : '검사하기'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default PuzzleSection;
