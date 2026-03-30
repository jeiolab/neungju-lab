import React, { useState, useEffect } from 'react';
import { PuzzleCard, StageId, STAGES_DATA, Difficulty } from '../types';
import { AlertCircle, CheckCircle, RotateCcw, HelpCircle, GripVertical } from 'lucide-react';

interface PuzzleBoardProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, mistakes: number) => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ difficulty, onComplete }) => {
  const [cards, setCards] = useState<PuzzleCard[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    initializeBoard();
  }, [difficulty]);

  const initializeBoard = () => {
    let initialCards: PuzzleCard[] = [];
    const baseStages = [
      STAGES_DATA[StageId.PROBLEM_DEF],
      STAGES_DATA[StageId.DATA_COLLECT],
      STAGES_DATA[StageId.PREPROCESSING],
      STAGES_DATA[StageId.MODEL_TRAIN],
      STAGES_DATA[StageId.EVALUATION],
      STAGES_DATA[StageId.IMPROVEMENT],
    ];

    if (difficulty === Difficulty.CHALLENGE) {
      initialCards = [...baseStages, STAGES_DATA[StageId.TRAP_GUESS], STAGES_DATA[StageId.TRAP_FAKE]];
    } else {
      initialCards = [...baseStages];
    }

    // Shuffle
    initialCards.sort(() => Math.random() - 0.5);
    setCards(initialCards);
    setMistakes(0);
    setIsChecked(false);
    setFeedback(null);
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null) return;
    if (draggedItem !== index) {
      const newCards = [...cards];
      const item = newCards[draggedItem];
      newCards.splice(draggedItem, 1);
      newCards.splice(index, 0, item);
      setDraggedItem(index);
      setCards(newCards);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const checkOrder = () => {
    setIsChecked(true);
    
    // Filter out traps for validation if in challenge mode (traps shouldn't be in the list ideally, but for this UI we check order)
    // Actually, distinct mechanic: Challenge mode requires removing traps? 
    // To keep it simple: Challenge mode just adds confusion, user must order correct ones. 
    // If traps are present in the final sequence, it's a fail or partial credit.
    
    // Let's implement: The top 6 cards must be the correct 6 stages in order. Traps should be at the bottom or removed (UI doesn't support 'bin' easily, so let's say traps must be at the very bottom).

    const correctOrder = [
      StageId.PROBLEM_DEF,
      StageId.DATA_COLLECT,
      StageId.PREPROCESSING,
      StageId.MODEL_TRAIN,
      StageId.EVALUATION,
      StageId.IMPROVEMENT
    ];

    let currentMistakes = 0;
    let firstErrorIndex = -1;

    for (let i = 0; i < 6; i++) {
        // If we ran out of cards or the card at i doesn't match correctOrder[i]
        if (!cards[i] || cards[i].stageId !== correctOrder[i]) {
            currentMistakes++;
            if (firstErrorIndex === -1) firstErrorIndex = i;
        }
    }

    // Check if traps are mixed in the top 6
    if (difficulty === Difficulty.CHALLENGE) {
       for(let i=0; i<6; i++) {
           if(cards[i].isTrap) {
               setFeedback({
                   message: `⚠️ 함정 카드 '${cards[i].title}'가 파이프라인에 포함되었습니다! 제거하세요 (아래로 내리세요).`,
                   type: 'error'
               });
               setMistakes(prev => prev + 1);
               return;
           }
       }
    }

    if (currentMistakes === 0) {
      setFeedback({ message: "완벽합니다! ML 파이프라인이 정상적으로 구축되었습니다.", type: 'success' });
      onComplete(true, mistakes);
    } else {
      setMistakes(prev => prev + 1);
      const wrongCard = cards[firstErrorIndex];
      let msg = "순서가 올바르지 않습니다.";
      
      // Contextual Feedback
      if (wrongCard) {
        if (wrongCard.stageId === StageId.MODEL_TRAIN && firstErrorIndex < 2) {
             msg = "❌ 모델 학습을 너무 빨리 시작했습니다. 데이터가 준비되었나요?";
        } else if (wrongCard.stageId === StageId.EVALUATION && firstErrorIndex < 3) {
             msg = "❌ 학습하지 않은 모델은 평가할 수 없습니다.";
        } else if (wrongCard.stageId === StageId.PREPROCESSING && firstErrorIndex === 0) {
             msg = "❌ 데이터를 수집하기도 전에 전처리를 할 수 없습니다.";
        } else {
             msg = `❌ '${wrongCard.title}' 단계의 위치가 잘못되었습니다.`;
        }
      }
      
      setFeedback({ message: msg, type: 'error' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
           <RotateCcw className="w-5 h-5 text-indigo-600 cursor-pointer hover:rotate-180 transition-transform" onClick={initializeBoard} />
           파이프라인 조립 ({difficulty})
        </h2>
        <div className="text-sm font-semibold text-slate-500">실수: {mistakes}</div>
      </div>

      <div className="space-y-3 min-h-[400px]">
        {cards.map((card, index) => (
          <div
            key={card.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              relative p-4 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all flex items-center gap-4 bg-white
              ${isChecked && card.order === index && !card.isTrap ? 'border-green-400 bg-green-50' : ''}
              ${isChecked && (card.order !== index || card.isTrap) && index < 6 ? 'border-red-300 bg-red-50' : 'border-slate-100 hover:border-indigo-300 shadow-sm'}
              ${card.isTrap ? 'border-dashed border-orange-200' : ''}
            `}
          >
            <GripVertical className="text-slate-400 w-5 h-5" />
            <div className="flex-1">
              <h3 className={`font-bold ${card.isTrap ? 'text-orange-600' : 'text-slate-800'}`}>{card.title}</h3>
              <p className="text-xs text-slate-500">{card.description}</p>
            </div>
            <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-400">
              {index + 1}
            </div>
            {isChecked && index < 6 && (
                card.order === index && !card.isTrap ? 
                <CheckCircle className="w-5 h-5 text-green-500" /> : 
                <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        ))}
        {difficulty === Difficulty.CHALLENGE && (
             <div className="border-t-2 border-dashed border-slate-200 my-4 text-center text-xs text-slate-400 py-2">
                 ▼ 파이프라인 제외 (함정 카드 놓는 곳) ▼
             </div>
        )}
      </div>

      {feedback && (
        <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <div>
              <p className="font-semibold">{feedback.message}</p>
              {feedback.type === 'error' && (
                  <p className="text-xs mt-1 opacity-80">TIP: 논리적인 작업 순서를 생각해보세요. 입력이 있어야 출력이 나옵니다.</p>
              )}
          </div>
        </div>
      )}

      <button
        onClick={checkOrder}
        className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md active:transform active:scale-95"
      >
        파이프라인 가동 (채점하기)
      </button>
    </div>
  );
};
