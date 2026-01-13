import React, { useState, useEffect } from 'react';
import { Block, Level } from '../../types';
import { LEVELS } from '../../constants';
import { Play, RotateCcw, CheckCircle, XCircle, ArrowRight, AlertCircle } from 'lucide-react';

interface PuzzleGameProps {
  onSuccess: (xp: number) => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ onSuccess }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [pipeline, setPipeline] = useState<Block[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });
  
  const currentLevel = LEVELS[currentLevelIdx];

  const addToPipeline = (block: Block) => {
    if (feedback.type === 'success') return;
    setPipeline([...pipeline, { ...block, id: `${block.id}-${Date.now()}` }]); // Unique IDs for rendering
    setFeedback({ type: null, msg: '' });
  };

  const removeFromPipeline = (index: number) => {
    if (feedback.type === 'success') return;
    const newPipeline = [...pipeline];
    newPipeline.splice(index, 1);
    setPipeline(newPipeline);
    setFeedback({ type: null, msg: '' });
  };

  const checkSolution = () => {
    // Check if lengths match first
    // Simplified validation: check types against types or params
    const correctTypes = currentLevel.correctSequence;
    
    // Simple logic check
    let isCorrect = true;
    let errorMsg = "";

    // Specific logic for level 2 & 3 (File modes)
    if (currentLevel.id >= 2) {
      const openBlock = pipeline.find(b => b.type === 'open');
      const closeBlock = pipeline.find(b => b.type === 'close');
      
      if (!openBlock) {
        isCorrect = false;
        errorMsg = "파일을 먼저 열어야(open) 합니다!";
      } else if (!closeBlock) {
        isCorrect = false;
        errorMsg = "작업이 끝나면 파일을 닫아야(close) 합니다!";
      } else {
        // Check mode
        const requiredMode = currentLevel.id === 2 ? 'w' : 'a';
        if (openBlock.param !== requiredMode) {
          isCorrect = false;
          errorMsg = `모드가 틀렸습니다. '${requiredMode}' 모드가 필요합니다. (현재: '${openBlock.param}')`;
        }
      }
    } else {
        // Level 1 logic
        if (pipeline.length !== correctTypes.length) isCorrect = false;
        pipeline.forEach((block, idx) => {
             if (block.type !== correctTypes[idx]) isCorrect = false;
        });
        if (!isCorrect) errorMsg = "순서가 올바르지 않습니다. 입력 -> 변수 -> 출력 순서를 생각해보세요.";
    }

    if (isCorrect) {
      setFeedback({ type: 'success', msg: '정답입니다! 완벽한 흐름이네요. 🎉' });
      onSuccess(20);
    } else {
      setFeedback({ type: 'error', msg: errorMsg || '블록 순서나 선택이 잘못되었습니다. 다시 확인해보세요.' });
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setPipeline([]);
      setFeedback({ type: null, msg: '' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Level {currentLevel.id}</span>
          <h3 className="text-xl font-bold text-gray-800">{currentLevel.title}</h3>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {currentLevelIdx + 1} / {LEVELS.length}
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-sm">
        📢 미션: {currentLevel.description}
      </p>

      {/* Workspace Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Blocks */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-400 uppercase">사용 가능한 블록 (클릭하여 추가)</h4>
          <div className="grid grid-cols-1 gap-2">
            {currentLevel.availableBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => addToPipeline(block)}
                className="flex items-center p-3 bg-white border border-gray-200 shadow-sm rounded-lg hover:border-indigo-400 hover:shadow-md transition-all text-left group"
              >
                <div className={`w-2 h-8 rounded-full mr-3 ${
                  block.type === 'open' ? 'bg-purple-400' : 
                  block.type === 'close' ? 'bg-red-400' : 
                  block.type === 'write' ? 'bg-green-400' : 'bg-blue-400'
                }`}></div>
                <code className="font-mono text-sm text-gray-700 group-hover:text-indigo-600">{block.label}</code>
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline Construction */}
        <div className="flex flex-col h-full">
           <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">나의 코드 파이프라인</h4>
           <div className="flex-1 bg-gray-900 rounded-xl p-4 min-h-[200px] relative overflow-hidden">
             {pipeline.length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                 블록을 추가하여 코드를 완성하세요
               </div>
             )}
             <div className="space-y-2">
               {pipeline.map((block, idx) => (
                 <div key={idx} className="flex items-center animate-in slide-in-from-left-2 duration-300">
                   <span className="text-gray-600 text-xs w-6">{idx + 1}</span>
                   <div 
                    onClick={() => removeFromPipeline(idx)}
                    className="flex-1 bg-gray-800 p-2 rounded border border-gray-700 text-gray-200 font-mono text-sm cursor-pointer hover:bg-gray-700 hover:border-red-500 transition-colors flex justify-between items-center group"
                   >
                     <span>{block.label}</span>
                     <XCircle size={14} className="opacity-0 group-hover:opacity-100 text-red-400" />
                   </div>
                   {idx < pipeline.length - 1 && (
                     <div className="absolute left-8 h-4 w-0.5 bg-gray-700 -bottom-3 z-0"></div>
                   )}
                 </div>
               ))}
             </div>
           </div>

           {/* Controls */}
           <div className="mt-4 flex space-x-3">
             <button 
               onClick={() => { setPipeline([]); setFeedback({type:null, msg:''}); }}
               className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
               title="Reset"
             >
               <RotateCcw size={20} />
             </button>
             <button
               onClick={checkSolution}
               disabled={pipeline.length === 0 || feedback.type === 'success'}
               className={`flex-1 flex items-center justify-center py-2 rounded-lg font-bold transition-all shadow-sm
                 ${feedback.type === 'success' 
                   ? 'bg-green-500 text-white' 
                   : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
             >
               {feedback.type === 'success' ? '성공!' : '코드 실행 (검증)'}
               {!feedback.type && <Play size={16} className="ml-2 fill-current" />}
             </button>
             {feedback.type === 'success' && currentLevelIdx < LEVELS.length - 1 && (
                <button 
                  onClick={nextLevel}
                  className="px-4 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors flex items-center animate-pulse"
                >
                  다음 <ArrowRight size={16} className="ml-1" />
                </button>
             )}
           </div>

           {/* Feedback Area */}
           {feedback.msg && (
             <div className={`mt-3 p-3 rounded-lg text-sm flex items-start ${
               feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
             }`}>
               {feedback.type === 'success' ? <CheckCircle size={18} className="mr-2 mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mr-2 mt-0.5 shrink-0" />}
               <span>{feedback.msg}</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleGame;