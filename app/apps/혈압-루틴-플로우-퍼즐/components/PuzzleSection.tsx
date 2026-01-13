import React, { useState, useEffect } from 'react';
import { Block, PuzzleLevel } from '../types';
import { PUZZLE_LEVELS } from '../constants';
import { RefreshCw, Check, AlertTriangle, Lightbulb, Unlock } from 'lucide-react';
import SimulationSection from './SimulationSection';

interface PuzzleSectionProps {
  completedLevels: number[];
  onComplete: (levelId: number) => void;
  onHintUse: () => void;
}

const PuzzleSection: React.FC<PuzzleSectionProps> = ({ completedLevels, onComplete, onHintUse }) => {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [slots, setSlots] = useState<(Block | null)[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'neutral', msg: string } | null>(null);
  const [hintsShown, setHintsShown] = useState<number>(0);
  const [isLevelSolved, setIsLevelSolved] = useState(false);

  const currentLevel = PUZZLE_LEVELS.find(l => l.id === currentLevelId) || PUZZLE_LEVELS[0];

  useEffect(() => {
    resetLevel();
  }, [currentLevelId]);

  const resetLevel = () => {
    setSlots([...currentLevel.initialBlocks]);
    setFeedback(null);
    setHintsShown(0);
    setIsLevelSolved(false);
    setSelectedBlock(null);
  };

  const handleSlotClick = (index: number) => {
    if (isLevelSolved) return;
    const currentSlot = slots[index];

    // If slot is locked, do nothing
    if (currentSlot && currentSlot.isLocked) return;

    // If a block is selected from palette, place it
    if (selectedBlock) {
      const newSlots = [...slots];
      newSlots[index] = { ...selectedBlock }; // Copy
      setSlots(newSlots);
      setSelectedBlock(null);
      setFeedback(null);
    } else if (currentSlot && !currentSlot.isLocked) {
      // If clicking an existing filled slot (not locked) without selection, clear it
      const newSlots = [...slots];
      newSlots[index] = null;
      setSlots(newSlots);
    }
  };

  const checkAnswer = () => {
    const currentLabels = slots.map(s => s ? s.label : "EMPTY");
    const correct = currentLevel.correctSequence;

    // Check length match (should be same as predefined slots)
    // Simple check: compare non-null labels against correct sequence.
    // However, our data structure includes nulls for empty slots.
    // We expect the USER to fill ALL nulls correctly.
    
    let isCorrect = true;
    let firstErrorIndex = -1;

    // We compare mapped labels. The 'correctSequence' in constants needs to match the visual slots order.
    // For simplicity in this demo, we assume correctSequence maps 1:1 to slots.
    
    for (let i = 0; i < correct.length; i++) {
        if (!slots[i] || slots[i]?.label !== correct[i]) {
            isCorrect = false;
            firstErrorIndex = i;
            break;
        }
    }

    if (isCorrect) {
      setFeedback({ type: 'success', msg: "🎉 정답입니다! 흐름이 완벽합니다." });
      setIsLevelSolved(true);
      onComplete(currentLevelId);
    } else {
      setFeedback({ 
        type: 'error', 
        msg: firstErrorIndex === -1 
          ? "모든 빈칸을 채워주세요." 
          : `${firstErrorIndex + 1}번째 블록이 올바르지 않습니다. 다시 생각해보세요!` 
      });
    }
  };

  const showHint = () => {
    if (hintsShown < currentLevel.hint.length) {
      setHintsShown(prev => prev + 1);
      onHintUse();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Level Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PUZZLE_LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => setCurrentLevelId(level.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors
              ${currentLevelId === level.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : completedLevels.includes(level.id)
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            {completedLevels.includes(level.id) && <Check size={14} className="inline mr-1" />}
            Level {level.id}: {level.title.split(':')[0]}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Game Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">{currentLevel.title}</h2>
             <p className="text-slate-600 mb-4">{currentLevel.description}</p>
             
             {/* Hint Box */}
             {hintsShown > 0 && (
               <div className="mb-4 bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm text-amber-800 flex items-start gap-2">
                 <Lightbulb size={16} className="mt-1 flex-shrink-0" />
                 <div>
                   {currentLevel.hint.slice(0, hintsShown).map((h, i) => (
                     <p key={i} className="mb-1 last:mb-0">💡 힌트 {i+1}: {h}</p>
                   ))}
                 </div>
               </div>
             )}

             {/* The Flowchart Slots */}
             <div className="flex flex-col items-center space-y-2 py-4 bg-slate-50 rounded-xl border border-slate-100 min-h-[400px]">
                {slots.map((slot, idx) => (
                  <React.Fragment key={idx}>
                    {/* Arrow (except first) */}
                    {idx > 0 && (
                       <div className="h-6 w-0.5 bg-slate-300"></div>
                    )}
                    {/* Loop arrow visualization for Level 3 could go here using absolute pos, simplified for now */}
                    
                    <button
                      onClick={() => handleSlotClick(idx)}
                      disabled={slot?.isLocked}
                      className={`
                        w-64 p-3 rounded-lg border-2 text-sm font-medium transition-all relative
                        ${slot 
                          ? slot.isLocked 
                            ? 'bg-slate-200 border-slate-300 text-slate-500 cursor-default' 
                            : 'bg-white border-blue-500 text-blue-700 shadow-md'
                          : 'bg-slate-100 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:bg-white'
                        }
                      `}
                    >
                      {slot ? slot.label : "블록을 선택해 채우세요"}
                      {slot?.isLocked && <Unlock size={12} className="absolute top-1 right-2 opacity-50" />}
                    </button>
                  </React.Fragment>
                ))}
             </div>

             {/* Feedback & Actions */}
             <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex gap-2">
                 <button 
                   onClick={resetLevel}
                   className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                   title="다시 하기"
                 >
                   <RefreshCw size={20} />
                 </button>
                 <button
                    onClick={showHint}
                    disabled={hintsShown >= currentLevel.hint.length || isLevelSolved}
                    className="flex items-center gap-1 px-3 py-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                 >
                    <Lightbulb size={16} /> 힌트 보기
                 </button>
               </div>

               <div className="flex items-center gap-4">
                  {feedback && (
                    <span className={`text-sm font-bold ${feedback.type === 'success' ? 'text-green-600' : 'text-rose-600'}`}>
                      {feedback.msg}
                    </span>
                  )}
                  {!isLevelSolved && (
                    <button 
                      onClick={checkAnswer}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md active:scale-95 transition-all"
                    >
                      채점하기
                    </button>
                  )}
               </div>
             </div>
          </div>
        </div>

        {/* Toolbox (Palette) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              블록 보관함
            </h3>
            <div className="space-y-3">
              {currentLevel.availableBlocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => setSelectedBlock(block)}
                  disabled={isLevelSolved}
                  className={`w-full text-left p-3 rounded-lg border-2 text-sm font-medium transition-all
                    ${selectedBlock?.id === block.id 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-slate-200 bg-white hover:border-blue-300'
                    }
                    ${isLevelSolved ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{block.label}</span>
                    {block.type === 'condition' && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">조건</span>}
                    {block.type === 'process' && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">처리</span>}
                    {block.type === 'input' && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">입력</span>}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              1. 보관함에서 블록을 클릭하세요.<br/>
              2. 왼쪽 퍼즐의 빈칸을 클릭해 넣으세요.<br/>
              3. 다시 클릭하면 블록이 빠집니다.
            </p>
          </div>
        </div>
      </div>

      {/* Simulation runs if level is solved */}
      {isLevelSolved && (
        <div className="animate-fade-in-up">
          <SimulationSection levelId={currentLevelId} />
        </div>
      )}
    </div>
  );
};

export default PuzzleSection;