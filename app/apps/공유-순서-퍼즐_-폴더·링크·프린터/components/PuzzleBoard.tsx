import React, { useState, useEffect, useCallback } from 'react';
import { PuzzleScenario, PuzzleStep } from '../types';
import { Shuffle, CheckCircle, RotateCcw, HelpCircle, AlertCircle } from 'lucide-react';

interface PuzzleBoardProps {
  scenario: PuzzleScenario;
  onComplete: (success: boolean) => void;
  onExit: () => void;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ scenario, onComplete, onExit }) => {
  const [items, setItems] = useState<PuzzleStep[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string; detail?: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Initialize and scramble
  useEffect(() => {
    const scrambled = [...scenario.steps].sort(() => Math.random() - 0.5);
    setItems(scrambled);
    setFeedback(null);
    setIsCompleted(false);
  }, [scenario]);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData('dragIndex', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndexStr = e.dataTransfer.getData('dragIndex');
    if (!dragIndexStr) return;
    
    const dragIndex = parseInt(dragIndexStr, 10);
    if (dragIndex === dropIndex) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    
    setItems(newItems);
    setFeedback(null); // Clear old feedback on move
  };

  const checkOrder = () => {
    let firstErrorIndex = -1;
    
    for (let i = 0; i < scenario.steps.length; i++) {
      if (items[i].id !== scenario.steps[i].id) {
        firstErrorIndex = i;
        break;
      }
    }

    if (firstErrorIndex === -1) {
      // Success
      setIsCompleted(true);
      setFeedback({
        type: 'success',
        message: '🎉 완벽합니다! 모든 절차가 올바르게 배치되었습니다.',
        detail: '네트워크 공유 설정이 안전하게 완료되었습니다.'
      });
      onComplete(true);
    } else {
      // Error
      const wrongItem = items[firstErrorIndex];
      const correctItem = scenario.steps[firstErrorIndex];
      const explanation = scenario.feedback[correctItem.id] || "순서가 맞지 않습니다.";

      setFeedback({
        type: 'error',
        message: `❌ ${firstErrorIndex + 1}번째 단계가 어색합니다.`,
        detail: `지금 놓인 "${wrongItem.text}" 대신, "${correctItem.text}" 단계가 와야 합니다. \n이유: ${explanation}`
      });
      onComplete(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{scenario.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{scenario.description}</p>
        </div>
        <button onClick={onExit} className="text-gray-500 hover:text-gray-700 text-sm underline">
          나가기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
             <HelpCircle className="text-blue-500 shrink-0 mt-1" size={20} />
             <div className="text-sm text-blue-800">
               <p className="font-bold mb-1">미션 목표</p>
               아래 카드들을 드래그하여 올바른 순서대로 재배치하세요. 
               작업은 <strong>위에서 아래로</strong> 진행됩니다.
             </div>
          </div>

          <ul className="space-y-2 puzzle-scroll">
            {items.map((item, index) => (
              <li
                key={item.id}
                draggable={!isCompleted}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`
                  relative flex items-center p-4 rounded-lg border-2 shadow-sm transition-all
                  ${isCompleted 
                    ? 'border-green-200 bg-green-50 cursor-default' 
                    : 'border-white bg-white hover:border-blue-300 cursor-move active:scale-[0.99] active:bg-blue-50'
                  }
                `}
              >
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full mr-4 font-bold text-sm shrink-0
                  ${isCompleted ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-500'}
                `}>
                  {index + 1}
                </div>
                <span className="text-gray-800 font-medium">{item.text}</span>
                {!isCompleted && (
                   <div className="absolute right-4 text-gray-300">☰</div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar / Feedback */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center">
              <CheckCircle size={18} className="mr-2" /> 상태 확인
            </h3>
            
            <div className="flex-1">
              {!feedback && (
                <p className="text-gray-400 text-sm text-center mt-10">
                  순서를 배치한 후<br/>채점하기 버튼을 눌러보세요.
                </p>
              )}
              
              {feedback && (
                <div className={`p-4 rounded-lg text-sm ${
                  feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  <p className="font-bold flex items-center gap-2">
                    {feedback.type === 'error' && <AlertCircle size={16}/>}
                    {feedback.message}
                  </p>
                  {feedback.detail && (
                    <p className="mt-2 text-xs opacity-90 whitespace-pre-line border-t border-black/10 pt-2">
                      {feedback.detail}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {!isCompleted && (
                <button
                  onClick={checkOrder}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition-colors flex justify-center items-center"
                >
                  <CheckCircle size={20} className="mr-2" /> 채점하기
                </button>
              )}
              
              <button
                onClick={() => {
                   const scrambled = [...scenario.steps].sort(() => Math.random() - 0.5);
                   setItems(scrambled);
                   setFeedback(null);
                   setIsCompleted(false);
                }}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors flex justify-center items-center"
              >
                <RotateCcw size={20} className="mr-2" /> 초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleBoard;