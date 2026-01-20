import React, { useState, useEffect, useCallback } from 'react';
import { DailyMission, CodeBlock } from '../types';
import { Play, RotateCcw, CheckCircle, XCircle, ArrowDown, GripVertical } from 'lucide-react';

interface Props {
  mission: DailyMission;
  onComplete: (score: number) => void;
  isCompleted: boolean;
}

const SimulationTab: React.FC<Props> = ({ mission, onComplete, isCompleted }) => {
  const [selectedAlgo, setSelectedAlgo] = useState<'linear' | 'binary' | null>(null);
  const [availableBlocks, setAvailableBlocks] = useState<CodeBlock[]>([]);
  const [solutionStack, setSolutionStack] = useState<CodeBlock[]>([]);
  const [simStep, setSimStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [visualState, setVisualState] = useState<{
    low: number;
    high: number;
    mid: number;
    currentCheck: number;
    found: boolean;
    log: string[];
  }>({
    low: -1,
    high: -1,
    mid: -1,
    currentCheck: -1,
    found: false,
    log: []
  });

  // Initialize Code Blocks shuffled
  useEffect(() => {
    const shuffled = [...mission.codeBlocks].sort(() => Math.random() - 0.5);
    setAvailableBlocks(shuffled);
    setSolutionStack([]);
    setSelectedAlgo(null);
    setSimStep(0);
    setIsRunning(false);
    resetVisuals();
  }, [mission]);

  const resetVisuals = () => {
    setVisualState({
      low: 0,
      high: mission.dataset.length - 1,
      mid: -1,
      currentCheck: -1,
      found: false,
      log: ['준비 완료. 알고리즘을 선택하고 코드를 조립하세요.']
    });
  };

  const moveBlockToSolution = (block: CodeBlock) => {
    setAvailableBlocks(prev => prev.filter(b => b.id !== block.id));
    setSolutionStack(prev => [...prev, block]);
  };

  const moveBlockToAvailable = (block: CodeBlock) => {
    setSolutionStack(prev => prev.filter(b => b.id !== block.id));
    setAvailableBlocks(prev => [...prev, block]);
  };

  const checkCode = () => {
    if (solutionStack.length !== mission.codeBlocks.length) return false;
    for (let i = 0; i < solutionStack.length; i++) {
      if (solutionStack[i].order !== i) return false;
    }
    return true;
  };

  const runSimulation = useCallback(async () => {
    if (!checkCode()) {
      alert("코드 순서가 올바르지 않습니다! 다시 확인해보세요.");
      return;
    }
    if (selectedAlgo !== mission.optimalAlgorithm) {
      alert(`선택한 알고리즘(${selectedAlgo})이 이 상황에 최적화되지 않았습니다.`);
      return;
    }

    setIsRunning(true);
    let low = 0;
    let high = mission.dataset.length - 1;
    let steps = 0;
    const target = mission.targetItem;
    const data = mission.dataset;
    const logs: string[] = [];

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    if (selectedAlgo === 'linear') {
      for (let i = 0; i < data.length; i++) {
        setVisualState(prev => ({ ...prev, currentCheck: i, log: [...logs, `Index ${i}: ${data[i]} 확인 중...`] }));
        logs.push(`Index ${i}: ${data[i]} 확인 중...`);
        await delay(800);

        if (data[i] === target) {
          setVisualState(prev => ({ ...prev, found: true, log: [...logs, `찾았다! Index ${i}`] }));
          onComplete(100);
          setIsRunning(false);
          return;
        }
      }
    } else if (selectedAlgo === 'binary') {
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        setVisualState(prev => ({ ...prev, low, high, mid, currentCheck: mid, log: [...logs, `범위[${low}~${high}], 중간값 Index ${mid} (${data[mid]}) 확인`] }));
        logs.push(`범위[${low}~${high}], 중간값 Index ${mid} (${data[mid]}) 확인`);
        await delay(1000);

        // Simple string comparison for simulation sake
        // In real app, might need more robust comparison depending on data type
        const midVal = data[mid];
        
        if (midVal === target) {
           setVisualState(prev => ({ ...prev, found: true, log: [...logs, `찾았다! Index ${mid}`] }));
           onComplete(100);
           setIsRunning(false);
           return;
        } else if (midVal < target) {
           low = mid + 1;
        } else {
           high = mid - 1;
        }
      }
    }
    
    setVisualState(prev => ({ ...prev, log: [...logs, '탐색 실패. 데이터에 없습니다.'] }));
    setIsRunning(false);
  }, [solutionStack, mission, selectedAlgo, onComplete]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pb-20">
      
      {/* Left Column: Mission & Code */}
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-2">📡 오늘의 미션</h2>
          <p className="text-slate-600 mb-4">{mission.description}</p>
          <div className="flex items-center gap-2 mb-4">
             <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
               찾을 대상: {mission.targetItem}
             </span>
             <span className={`px-3 py-1 rounded-full text-sm font-medium ${mission.datasetType === 'sorted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
               데이터: {mission.datasetType === 'sorted' ? '정렬됨' : '정렬 안 됨'}
             </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-700">1. 알고리즘 선택</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedAlgo('linear')}
                className={`flex-1 py-2 rounded-lg border transition-colors ${selectedAlgo === 'linear' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-slate-50 border-slate-300'}`}
              >
                순차 탐색 (Linear)
              </button>
              <button 
                onClick={() => setSelectedAlgo('binary')}
                className={`flex-1 py-2 rounded-lg border transition-colors ${selectedAlgo === 'binary' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-slate-50 border-slate-300'}`}
              >
                이진 탐색 (Binary)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-slate-700">2. 코드 조립 (클릭해서 이동)</h3>
            <button onClick={() => {
                setAvailableBlocks([...mission.codeBlocks].sort(() => Math.random() - 0.5));
                setSolutionStack([]);
            }} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
              <RotateCcw size={12} /> 초기화
            </button>
          </div>

          {/* Solution Area */}
          <div className="min-h-[160px] bg-slate-800 rounded-lg p-4 mb-4 border-2 border-slate-700 relative">
            <div className="absolute top-2 right-2 text-slate-500 text-xs font-mono">SOLUTION.main()</div>
            {solutionStack.length === 0 && (
               <div className="text-slate-500 text-center mt-10 text-sm">아래 블록을 클릭하여 여기에 순서대로 쌓으세요.</div>
            )}
            <div className="space-y-1">
              {solutionStack.map((block, idx) => (
                <div 
                  key={block.id} 
                  onClick={() => !isRunning && moveBlockToAvailable(block)}
                  className="bg-indigo-500 hover:bg-red-500 transition-colors text-white p-2 rounded text-sm font-mono cursor-pointer flex items-center gap-2 group"
                >
                  <span className="text-indigo-200 text-xs w-4">{idx + 1}.</span>
                  {block.text}
                </div>
              ))}
            </div>
          </div>

          {/* Available Blocks */}
          <div className="space-y-2">
             <div className="text-xs text-slate-500 font-medium">사용 가능한 블록:</div>
             <div className="flex flex-wrap gap-2">
                {availableBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => moveBlockToSolution(block)}
                    disabled={isRunning}
                    className="bg-slate-100 hover:bg-indigo-100 border border-slate-200 text-slate-700 px-3 py-2 rounded text-xs font-mono transition-all text-left"
                  >
                    {block.text}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Right Column: Visualization */}
      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 p-6 flex flex-col">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
           <Play size={18} className="text-green-400" /> 시뮬레이터
        </h2>
        
        {/* Array Visualization */}
        <div className="flex-1 flex flex-col justify-center items-center py-8">
           <div className="flex flex-wrap justify-center gap-2 w-full">
              {mission.dataset.map((item, idx) => {
                let statusClass = "bg-slate-700 border-slate-600 text-slate-300";
                
                // Highlight Logic
                if (visualState.found && idx === visualState.currentCheck) {
                  statusClass = "bg-green-500 border-green-400 text-white ring-4 ring-green-500/30";
                } else if (idx === visualState.currentCheck) {
                  statusClass = "bg-yellow-500 border-yellow-400 text-white scale-110";
                } else if (selectedAlgo === 'binary' && (idx < visualState.low || idx > visualState.high)) {
                  statusClass = "bg-slate-800 border-slate-800 text-slate-600 opacity-50"; // Out of bounds
                }

                return (
                  <div key={idx} className={`relative transition-all duration-300 w-16 h-20 flex items-center justify-center rounded-lg border-2 font-mono text-sm shadow-lg ${statusClass}`}>
                     {item}
                     <div className="absolute -bottom-6 text-[10px] text-slate-500">Idx {idx}</div>
                     {idx === visualState.low && selectedAlgo === 'binary' && !visualState.found && <div className="absolute -top-6 text-[10px] text-blue-400 font-bold">LOW</div>}
                     {idx === visualState.high && selectedAlgo === 'binary' && !visualState.found && <div className="absolute -top-6 text-[10px] text-blue-400 font-bold">HIGH</div>}
                  </div>
                )
              })}
           </div>
        </div>

        {/* Console Log */}
        <div className="h-48 bg-black rounded-lg p-4 font-mono text-xs overflow-y-auto border border-slate-800">
           {visualState.log.map((line, i) => (
             <div key={i} className="text-green-400 mb-1 opacity-90">{'>'} {line}</div>
           ))}
           {visualState.log.length === 0 && <div className="text-slate-600">시스템 대기 중...</div>}
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunning || isCompleted}
          className={`mt-4 w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isCompleted 
            ? 'bg-green-600 text-white cursor-default' 
            : isRunning 
              ? 'bg-slate-700 text-slate-400 cursor-wait'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30 shadow-lg'
          }`}
        >
          {isCompleted ? <><CheckCircle /> 미션 완료!</> : isRunning ? '실행 중...' : <><Play fill="currentColor" /> 코드 실행</>}
        </button>
      </div>

    </div>
  );
};

export default SimulationTab;
