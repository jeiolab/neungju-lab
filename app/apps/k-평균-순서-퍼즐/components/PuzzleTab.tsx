import React, { useState } from 'react';
import { PUZZLE_STEPS, CORRECT_ORDER } from '../constants';
import { PuzzlePiece } from '../types';
import { GripVertical, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface PuzzleTabProps {
  onComplete: (score: number) => void;
}

const PuzzleTab: React.FC<PuzzleTabProps> = ({ onComplete }) => {
  // Fisher-Yates shuffle for initial state
  const getShuffledSteps = () => {
    const array = [...PUZZLE_STEPS];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const [items, setItems] = useState<PuzzlePiece[]>(getShuffledSteps());
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'neutral' } | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index);
    // Standard DnD data transfer
    e.dataTransfer.effectAllowed = "move";
    // For iOS/Mobile limitations of HTML5 DnD, this might be limited, 
    // but works on most modern desktop/tablet browsers.
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedItemIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    
    setItems(newItems);
    setDraggedItemIndex(null);
    setFeedback(null); // Reset feedback on move
  };

  const checkAnswer = () => {
    const currentOrderIds = items.map(item => item.id);
    let correctCount = 0;
    let sequenceCorrect = true;

    // Check strict sequence
    for (let i = 0; i < CORRECT_ORDER.length; i++) {
      if (currentOrderIds[i] === CORRECT_ORDER[i]) {
        correctCount++;
      } else {
        sequenceCorrect = false;
      }
    }

    if (sequenceCorrect) {
      setFeedback({ message: "완벽합니다! K-평균의 흐름을 정확히 이해하셨군요. (+100점)", type: 'success' });
      onComplete(100);
    } else {
      // Partial credit logic: check relative pairs or just count correct positions
      setFeedback({ 
        message: `아직 순서가 조금 다릅니다. (${correctCount}/${CORRECT_ORDER.length}개 위치 정답)`, 
        type: 'error' 
      });
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
    setFeedback(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800">알고리즘 순서 맞추기</h2>
        <p className="text-slate-600 mt-2">카드를 드래그하여 K-평균 알고리즘의 올바른 순서를 만들어주세요.</p>
      </div>

      <div className="space-y-3 mb-8">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              bg-white border-2 rounded-xl p-4 flex items-center gap-4 cursor-move transition-all
              ${draggedItemIndex === index ? 'opacity-50 border-dashed border-indigo-400' : 'border-slate-200 hover:border-indigo-300 shadow-sm'}
            `}
          >
            <div className="text-slate-400 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">{item.text}</h4>
              <p className="text-sm text-slate-500">{item.description}</p>
            </div>

            {/* Mobile/Accessibility Controls */}
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
                className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"
              >
                ▲
              </button>
              <button 
                onClick={() => moveItem(index, 'down')}
                disabled={index === items.length - 1}
                className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        {feedback && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${
            feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {feedback.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
            {feedback.message}
          </div>
        )}
        
        <div className="flex gap-4">
          <button 
            onClick={() => { setItems(getShuffledSteps()); setFeedback(null); }}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            초기화
          </button>
          <button 
            onClick={checkAnswer}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl font-bold transition-all transform hover:-translate-y-0.5"
          >
            <CheckCircle className="w-5 h-5" />
            정답 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuzzleTab;
