import React, { useState, useEffect } from 'react';
import { PuzzleData, UserProgress } from '../types';
import { PUZZLES } from '../constants';
import { HelpCircle, CheckCircle2, AlertCircle, ArrowRight, MousePointer2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PuzzleGameProps {
  onComplete: (xp: number) => void;
  userProgress: UserProgress;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ onComplete, userProgress }) => {
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [inputDistance, setInputDistance] = useState<number | ''>('');
  const [inputLength, setInputLength] = useState<number | ''>('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  
  const puzzle = PUZZLES[currentPuzzleIdx];

  useEffect(() => {
    // Reset state when puzzle changes
    setInputDistance('');
    setInputLength('');
    setStatus('idle');
    setFeedback('');
  }, [currentPuzzleIdx]);

  const handleCheck = () => {
    const dist = Number(inputDistance);
    const len = Number(inputLength);
    
    // Calculate expected distance:
    // Pattern starts at puzzle.targetPattern.startIndex
    // It copies from puzzle.targetPattern.matchIndex
    // Distance = startIndex - matchIndex
    const expectedDist = puzzle.targetPattern.startIndex - puzzle.targetPattern.matchIndex;
    const expectedLen = puzzle.targetPattern.length;

    if (dist === expectedDist && len === expectedLen) {
      setStatus('success');
      setFeedback('정확합니다! 패턴을 완벽하게 찾아냈어요.');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onComplete(50); // Give 50 XP
    } else {
      setStatus('error');
      if (dist !== expectedDist) {
        setFeedback(`거리(Distance)가 틀렸어요. 현재 위치(${puzzle.targetPattern.startIndex})에서 원본 위치(${puzzle.targetPattern.matchIndex})까지 몇 칸 뒤로 가야 할까요?`);
      } else if (len !== expectedLen) {
        setFeedback(`길이(Length)가 틀렸어요. 반복되는 글자 수가 몇 개인가요?`);
      }
    }
  };

  const handleNext = () => {
    if (currentPuzzleIdx < PUZZLES.length - 1) {
      setCurrentPuzzleIdx(prev => prev + 1);
    } else {
      setFeedback("모든 퍼즐을 완료했습니다! 대단해요!");
    }
  };

  // Helper to render the string with highlights
  const renderVisualString = () => {
    const chars = puzzle.text.split('');
    return (
      <div className="flex justify-center mb-8 overflow-x-auto pb-4">
        <div className="flex space-x-1">
          {chars.map((char, idx) => {
            const isTarget = idx >= puzzle.targetPattern.startIndex && idx < puzzle.targetPattern.startIndex + puzzle.targetPattern.length;
            const isSource = idx >= puzzle.targetPattern.matchIndex && idx < puzzle.targetPattern.matchIndex + puzzle.targetPattern.length;
            
            let bgClass = "bg-white";
            let borderClass = "border-slate-200";
            let textClass = "text-slate-700";
            let label = null;

            if (status === 'success') {
               if (isTarget) {
                 bgClass = "bg-green-100";
                 borderClass = "border-green-400";
                 textClass = "text-green-700";
               } else if (isSource) {
                 bgClass = "bg-blue-50";
                 borderClass = "border-blue-300";
               }
            } else {
               if (isTarget) {
                 bgClass = "bg-yellow-50";
                 borderClass = "border-yellow-400 ring-2 ring-yellow-200";
                 textClass = "text-slate-900 font-bold";
                 label = <div className="absolute -top-6 text-[10px] font-bold text-yellow-600 whitespace-nowrap">현재 위치</div>
               }
               if (isSource) {
                 bgClass = "bg-indigo-50";
                 borderClass = "border-indigo-300 border-dashed";
                 textClass = "text-indigo-400";
                 label = <div className="absolute -bottom-6 text-[10px] font-bold text-indigo-400 whitespace-nowrap">참조 원본</div>
               }
            }

            return (
              <div key={idx} className="relative flex flex-col items-center">
                 {label}
                 <div className={`w-10 h-14 md:w-12 md:h-16 flex items-center justify-center rounded-lg border-2 text-xl md:text-2xl font-mono transition-all ${bgClass} ${borderClass} ${textClass}`}>
                  {char}
                </div>
                <div className="mt-2 text-xs text-slate-400 font-mono">{idx}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">🧩 파이프라인 퍼즐</h2>
          <p className="text-slate-500">하이라이트된 패턴을 보고 거리와 길이를 계산하세요.</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold uppercase text-slate-400">Difficulty</span>
          <div className={`text-sm font-bold px-3 py-1 rounded-full capitalize ${
            puzzle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            puzzle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {puzzle.difficulty}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-slate-100 p-4 md:p-8 rounded-2xl shadow-inner relative overflow-hidden">
        {renderVisualString()}

        {/* Connection Line Visualization (Simplified) */}
        <svg className="absolute top-1/2 left-0 w-full h-full pointer-events-none opacity-20">
           {/* Decorative lines could go here */}
        </svg>

        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-lg mx-auto">
           <div className="flex items-start space-x-3 mb-4">
             <HelpCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
             <p className="text-sm text-slate-600">{puzzle.hint}</p>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-6">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">거리 (Distance)</label>
               <input 
                 type="number" 
                 value={inputDistance}
                 onChange={(e) => setInputDistance(Number(e.target.value))}
                 placeholder="?"
                 className="w-full text-center text-xl font-bold p-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                 disabled={status === 'success'}
               />
               <p className="text-[10px] text-slate-400 mt-1 text-center">몇 칸 뒤로 가야 하나요?</p>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">길이 (Length)</label>
               <input 
                 type="number" 
                 value={inputLength}
                 onChange={(e) => setInputLength(Number(e.target.value))}
                 placeholder="?"
                 className="w-full text-center text-xl font-bold p-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                 disabled={status === 'success'}
               />
                <p className="text-[10px] text-slate-400 mt-1 text-center">몇 글자가 반복되나요?</p>
             </div>
           </div>

           {status === 'idle' || status === 'error' ? (
             <button 
               onClick={handleCheck}
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
             >
               <MousePointer2 className="w-4 h-4" />
               <span>치환 검증하기</span>
             </button>
           ) : (
             <button 
                onClick={handleNext}
                disabled={currentPuzzleIdx >= PUZZLES.length - 1}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <span>다음 퍼즐로</span>
               <ArrowRight className="w-4 h-4" />
             </button>
           )}

           {status !== 'idle' && (
             <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 text-sm font-medium ${
               status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
             }`}>
               {status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
               <span>{feedback}</span>
             </div>
           )}
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-400 px-2">
        <span>Puzzle {currentPuzzleIdx + 1} of {PUZZLES.length}</span>
        <span>Progress Saved</span>
      </div>
    </div>
  );
};

export default PuzzleGame;