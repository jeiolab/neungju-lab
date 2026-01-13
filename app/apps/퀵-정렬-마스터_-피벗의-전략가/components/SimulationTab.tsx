import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './Button';
import { RefreshCw, ArrowRight, CheckCircle, AlertCircle, Trophy, MousePointerClick } from 'lucide-react';

interface SimulationTabProps {
  onScoreUpdate: (score: number) => void;
}

const generateRandomArray = (size: number) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
};

export const SimulationTab: React.FC<SimulationTabProps> = ({ onScoreUpdate }) => {
  const [array, setArray] = useState<number[]>([]);
  const [pivot, setPivot] = useState<{ value: number; index: number } | null>(null);
  const [leftBucket, setLeftBucket] = useState<number[]>([]);
  const [rightBucket, setRightBucket] = useState<number[]>([]);
  const [processedIndices, setProcessedIndices] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState("피벗이 될 숫자를 선택하세요!");
  const [phase, setPhase] = useState<'SELECT' | 'PARTITION' | 'RESULT'>('SELECT');
  const [score, setScore] = useState(0);
  const [strategyScore, setStrategyScore] = useState<number | null>(null);

  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetGame = () => {
    setArray(generateRandomArray(7));
    setPivot(null);
    setLeftBucket([]);
    setRightBucket([]);
    setProcessedIndices(new Set());
    setPhase('SELECT');
    setMessage("1단계: 전략적으로 피벗을 선택하세요. (힌트: 중간값에 가까운 수를 찾아보세요)");
    setStrategyScore(null);
  };

  const handlePivotSelect = (value: number, index: number) => {
    setPivot({ value, index });
    setProcessedIndices(new Set([index]));
    setPhase('PARTITION');
    setMessage("2단계: 남은 숫자들을 왼쪽(< 피벗) 또는 오른쪽(> 피벗)으로 드래그하세요.");
    
    // Calculate strategy score based on median proximity
    const sorted = [...array].sort((a, b) => a - b);
    const medianIndex = Math.floor(sorted.length / 2);
    const median = sorted[medianIndex];
    const diff = Math.abs(value - median);
    // Score: 100 if median, lower if far away
    const calculatedScore = Math.max(10, 100 - (diff * 5));
    setStrategyScore(calculatedScore);
  };

  const handleDragStart = (e: React.DragEvent, value: number, index: number) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ value, index }));
  };

  const handleDrop = (e: React.DragEvent, targetBucket: 'LEFT' | 'RIGHT') => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;

    const { value, index } = JSON.parse(data);
    
    if (!pivot) return;

    // Validation
    if (targetBucket === 'LEFT' && value > pivot.value) {
      setMessage(`❌ 오류: ${value}은(는) 피벗 ${pivot.value}보다 큽니다. 오른쪽으로 가야 해요!`);
      return;
    }
    if (targetBucket === 'RIGHT' && value < pivot.value) {
      setMessage(`❌ 오류: ${value}은(는) 피벗 ${pivot.value}보다 작습니다. 왼쪽으로 가야 해요!`);
      return;
    }

    // Success move
    if (targetBucket === 'LEFT') {
      setLeftBucket(prev => [...prev, value]);
    } else {
      setRightBucket(prev => [...prev, value]);
    }
    
    setProcessedIndices(prev => new Set(prev).add(index));
    setMessage("정답입니다! 계속하세요.");

    // Check completion
    if (processedIndices.size + 1 === array.length) {
      setPhase('RESULT');
      setMessage("분할 완료! 피벗이 그룹 사이의 올바른 정렬 위치에 놓였습니다.");
      onScoreUpdate(score + (strategyScore || 0));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in flex flex-col gap-8">
      
      {/* Header / Instructions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MousePointerClick className="w-6 h-6 text-indigo-600"/>
            분할 시뮬레이터 (Partition Simulator)
          </h2>
          <p className="text-slate-600 mt-1">{message}</p>
        </div>
        <div className="flex gap-4 items-center">
            {strategyScore !== null && (
                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-semibold">전략 점수</p>
                    <p className={`text-xl font-bold ${strategyScore > 80 ? 'text-green-600' : 'text-amber-600'}`}>
                        {strategyScore}/100
                    </p>
                </div>
            )}
            <Button onClick={resetGame} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" /> 초기화
            </Button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[400px]">
        
        {/* Left Bucket */}
        <div 
          onDrop={(e) => handleDrop(e, 'LEFT')}
          onDragOver={handleDragOver}
          className={`
            border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-start gap-3 transition-colors
            ${phase === 'PARTITION' ? 'bg-indigo-50/50 border-indigo-300 hover:bg-indigo-50' : 'bg-slate-50 border-slate-200'}
          `}
        >
          <div className="text-center mb-4">
            <h3 className="font-bold text-indigo-900">더 작음 ({'<'}{pivot ? pivot.value : '피벗'})</h3>
            <p className="text-sm text-indigo-600/70">작은 숫자는 여기로</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {leftBucket.map((num, i) => (
              <div key={`left-${i}`} className="w-12 h-12 bg-indigo-100 text-indigo-800 font-bold rounded-lg flex items-center justify-center shadow-sm">
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Source Array / Pivot Area */}
        <div className="flex flex-col items-center justify-start gap-8 py-8">
            
            {/* Pivot Stage */}
            <div className="w-full flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">선택된 피벗</span>
                <div className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg transition-all
                    ${pivot ? 'bg-purple-600 text-white scale-110' : 'bg-slate-100 text-slate-300 border-2 border-dashed border-slate-300'}
                `}>
                    {pivot ? pivot.value : '?'}
                </div>
            </div>

            {/* Original Array Line */}
            <div className="w-full">
                <div className="text-center mb-4">
                    <span className="text-sm font-medium text-slate-500">
                        {phase === 'SELECT' ? '피벗으로 만들 숫자를 클릭하세요' : '숫자를 알맞은 곳으로 드래그하세요'}
                    </span>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {array.map((num, idx) => {
                        const isProcessed = processedIndices.has(idx);
                        const isPivot = pivot?.index === idx;

                        if (isProcessed && !isPivot) return null; // Hide processed numbers (except pivot)

                        return (
                            <div
                                key={idx}
                                draggable={phase === 'PARTITION' && !isPivot}
                                onDragStart={(e) => handleDragStart(e, num, idx)}
                                onClick={() => phase === 'SELECT' && handlePivotSelect(num, idx)}
                                className={`
                                    w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm transition-all cursor-pointer
                                    ${isPivot ? 'hidden' : ''} 
                                    ${phase === 'SELECT' 
                                        ? 'bg-white text-slate-800 border-2 border-slate-200 hover:border-purple-500 hover:text-purple-600 hover:-translate-y-1' 
                                        : 'bg-white text-slate-800 border-2 border-indigo-200 cursor-move hover:shadow-md active:cursor-grabbing'}
                                `}
                            >
                                {num}
                            </div>
                        );
                    })}
                    {/* Placeholder when empty */}
                    {processedIndices.size === array.length && (
                        <div className="text-slate-400 italic">배열 분할 완료!</div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Bucket */}
        <div 
          onDrop={(e) => handleDrop(e, 'RIGHT')}
          onDragOver={handleDragOver}
          className={`
            border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-start gap-3 transition-colors
            ${phase === 'PARTITION' ? 'bg-emerald-50/50 border-emerald-300 hover:bg-emerald-50' : 'bg-slate-50 border-slate-200'}
          `}
        >
          <div className="text-center mb-4">
            <h3 className="font-bold text-emerald-900">더 큼 ({'>'}{pivot ? pivot.value : '피벗'})</h3>
            <p className="text-sm text-emerald-600/70">큰 숫자는 여기로</p>
          </div>
           <div className="flex flex-wrap gap-2 justify-center">
            {rightBucket.map((num, i) => (
              <div key={`right-${i}`} className="w-12 h-12 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center justify-center shadow-sm">
                {num}
              </div>
            ))}
          </div>
        </div>

      </div>

      {phase === 'RESULT' && (
        <div className="bg-slate-900 text-white p-6 rounded-xl flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                    <h4 className="font-bold text-lg">분할 성공!</h4>
                    <p className="text-slate-300">
                        현재 배열 상태: [{leftBucket.join(', ')}] <span className="text-purple-400 font-bold">[{pivot?.value}]</span> [{rightBucket.join(', ')}]
                    </p>
                </div>
            </div>
            <Button onClick={resetGame} variant="primary">
                다음 라운드 <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      )}
    </div>
  );
};