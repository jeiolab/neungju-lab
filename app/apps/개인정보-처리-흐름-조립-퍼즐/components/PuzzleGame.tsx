import React, { useState, useEffect } from 'react';
import { PuzzleBlock } from '../types';
import { PUZZLE_STEPS } from '../constants';
import { CheckCircle, RotateCcw, HelpCircle, ArrowRight } from 'lucide-react';

interface PuzzleGameProps {
  onComplete: (score: number) => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ onComplete }) => {
  const [bank, setBank] = useState<PuzzleBlock[]>([]);
  const [slots, setSlots] = useState<(PuzzleBlock | null)[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffled = [...PUZZLE_STEPS].sort(() => Math.random() - 0.5);
    setBank(shuffled);
    setSlots(Array(PUZZLE_STEPS.length).fill(null));
    setFeedback(null);
    setIsSuccess(false);
  };

  const moveToSlot = (block: PuzzleBlock) => {
    if (isSuccess) return;
    const firstEmptyIndex = slots.findIndex(s => s === null);
    if (firstEmptyIndex !== -1) {
      const newSlots = [...slots];
      newSlots[firstEmptyIndex] = block;
      setSlots(newSlots);
      setBank(bank.filter(b => b.id !== block.id));
      setFeedback(null);
    }
  };

  const returnToBank = (block: PuzzleBlock, index: number) => {
    if (isSuccess) return;
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
    setBank([...bank, block]);
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (bank.length > 0) {
      setFeedback("모든 블록을 순서대로 배치해주세요!");
      return;
    }

    let correctCount = 0;
    let firstErrorIndex = -1;

    // The canonical order is defined by PUZZLE_STEPS array index because we import it directly
    // Wait, PUZZLE_STEPS is just the data. The correct order is basically the order in PUZZLE_STEPS constant.
    // Let's assume PUZZLE_STEPS is defined in the correct logical order in constants.ts (which it is).

    slots.forEach((slot, index) => {
      if (slot && slot.id === PUZZLE_STEPS[index].id) {
        correctCount++;
      } else if (firstErrorIndex === -1) {
        firstErrorIndex = index;
      }
    });

    if (correctCount === PUZZLE_STEPS.length) {
      setIsSuccess(true);
      setFeedback("정답입니다! 개인정보 처리 흐름을 완벽하게 이해하셨네요.");
      onComplete(100);
    } else {
      setFeedback(`${firstErrorIndex + 1}번째 단계부터 순서가 어색해요. 다시 생각해볼까요?`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">흐름 조립 퍼즐</h2>
          <p className="text-slate-600 text-sm">아래 블록을 클릭하여 올바른 순서대로 타임라인에 배치하세요.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={resetGame} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <RotateCcw size={16} /> 초기화
          </button>
          <button 
            onClick={checkAnswer} 
            disabled={isSuccess}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-colors ${isSuccess ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <CheckCircle size={16} /> 정답 확인
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${isSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-orange-50 text-orange-800 border border-orange-200'}`}>
          <Info size={20} className="mt-0.5 flex-shrink-0" />
          <p className="font-medium">{feedback}</p>
        </div>
      )}

      {/* Timeline Slots */}
      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 mb-8 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {slots.map((slot, index) => (
            <React.Fragment key={`slot-${index}`}>
              <div 
                onClick={() => slot && returnToBank(slot, index)}
                className={`
                  w-28 h-32 flex-shrink-0 rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all relative
                  ${slot 
                    ? `bg-white border-indigo-200 shadow-sm hover:border-red-300 group` 
                    : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100'
                  }
                `}
              >
                <div className="absolute top-1 left-2 text-xs font-bold text-slate-300">#{index + 1}</div>
                {slot ? (
                  <>
                    <span className="text-xs font-semibold text-indigo-500 mb-1">{slot.category}</span>
                    <span className="text-sm font-bold text-slate-800 leading-tight">{slot.label}</span>
                    <span className="text-[10px] text-slate-500 mt-2 line-clamp-2">{slot.description}</span>
                    <div className="absolute inset-0 bg-red-50/80 items-center justify-center text-red-600 text-xs font-bold hidden group-hover:flex rounded-lg backdrop-blur-sm">
                      제거하기
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">빈 슬롯</span>
                )}
              </div>
              {index < slots.length - 1 && (
                <ArrowRight className="text-slate-300 flex-shrink-0" size={16} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Block Bank */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">사용 가능한 블록</h3>
        {bank.length === 0 && !isSuccess && (
          <div className="text-center py-8 text-slate-400 text-sm">
            모든 블록을 사용했습니다! 정답을 확인해보세요.
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {bank.map((block) => (
            <button
              key={block.id}
              onClick={() => moveToSlot(block)}
              className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 px-4 py-3 rounded-lg text-sm font-medium shadow-sm transition-all hover:shadow hover:-translate-y-0.5 flex flex-col items-start gap-1"
            >
              <span className="font-bold">{block.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper icon
const Info = ({ className, size }: { className?: string, size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default PuzzleGame;