import React, { useState, useEffect, useMemo } from 'react';
import { generateDailyGrid, runSimulationLogic, getTodaySeed } from '../utils';
import { GridCell, SensitivityLevel, SimulationResult } from '../types';
import { TreePine, Mountain, Waves, Home, Radio, ThermometerSun, Play, RotateCcw, Info } from 'lucide-react';

interface Props {
  onComplete: (result: SimulationResult, layout: GridCell[]) => void;
  initialCompleted: boolean;
}

const BUDGET = 10;

const SimulationTab: React.FC<Props> = ({ onComplete, initialCompleted }) => {
  const seed = useMemo(() => getTodaySeed(), []);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('MEDIUM');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    setGrid(generateDailyGrid(seed));
  }, [seed]);

  const toggleSensor = (index: number) => {
    if (result) return; // Locked after run
    
    const newGrid = [...grid];
    const cell = newGrid[index];
    const currentSensors = newGrid.filter(c => c.hasSensor).length;

    if (!cell.hasSensor && currentSensors >= BUDGET) {
      alert("예산이 부족합니다! 센서를 더 배치할 수 없습니다.");
      return;
    }

    if (cell.type === 'WATER' || cell.type === 'ROCK') {
        // Can simulate inability to place on water/rock if desired, but let's allow rock, maybe not water
         if(cell.type === 'WATER') return;
    }

    cell.hasSensor = !cell.hasSensor;
    setGrid(newGrid);
  };

  const handleRun = () => {
    setIsSimulating(true);
    // Simulate delay for dramatic effect
    setTimeout(() => {
      const simResult = runSimulationLogic(seed, grid, sensitivity);
      setResult(simResult);
      setIsSimulating(false);
      onComplete(simResult, grid);
    }, 1500);
  };

  const resetToday = () => {
    if (initialCompleted) return; // Prevent reset if already saved as complete for the day logic in parent, but here we act as "retry before submit" if needed.
    // Actually, design says "Daily Mission". Usually means one try or refine until success. 
    // Let's allow retry to learn.
    setResult(null);
    setGrid(generateDailyGrid(seed));
  };

  const usedBudget = grid.filter(c => c.hasSensor).length;

  const getCellColor = (type: string) => {
    switch (type) {
      case 'FOREST': return 'bg-green-100 border-green-200 hover:bg-green-200';
      case 'ROCK': return 'bg-gray-200 border-gray-300';
      case 'WATER': return 'bg-blue-100 border-blue-200';
      case 'VILLAGE': return 'bg-orange-100 border-orange-200';
      default: return 'bg-white';
    }
  };

  const getCellIcon = (type: string) => {
    switch (type) {
      case 'FOREST': return <TreePine className="w-5 h-5 text-green-700 opacity-60" />;
      case 'ROCK': return <Mountain className="w-5 h-5 text-gray-500 opacity-60" />;
      case 'WATER': return <Waves className="w-5 h-5 text-blue-500 opacity-60" />;
      case 'VILLAGE': return <Home className="w-5 h-5 text-orange-600 opacity-60" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-medium">예산 (센서 수)</span>
            <div className="flex items-end gap-1">
              <span className={`text-2xl font-bold ${usedBudget > BUDGET ? 'text-red-500' : 'text-blue-600'}`}>
                {usedBudget}
              </span>
              <span className="text-gray-400 mb-1">/ {BUDGET}</span>
            </div>
          </div>
          
          <div className="w-px h-10 bg-gray-200 mx-2 hidden md:block"></div>

          <div className="flex flex-col">
             <span className="text-sm text-gray-500 font-medium mb-1">감지 민감도</span>
             <div className="flex bg-gray-100 rounded-lg p-1">
                {(['LOW', 'MEDIUM', 'HIGH'] as SensitivityLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => !result && setSensitivity(level)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      sensitivity === level 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                    disabled={!!result}
                  >
                    {level === 'LOW' ? '낮음' : level === 'MEDIUM' ? '보통' : '높음'}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <button
          onClick={result ? resetToday : handleRun}
          disabled={isSimulating}
          className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 text-white shadow-lg transition-all transform active:scale-95 ${
            result 
            ? 'bg-gray-500 hover:bg-gray-600' 
            : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSimulating ? (
            <span className="animate-pulse">시뮬레이션 중...</span>
          ) : result ? (
            <>
              <RotateCcw size={18} /> 다시 배치하기
            </>
          ) : (
            <>
              <Play size={18} /> 시뮬레이션 시작
            </>
          )}
        </button>
      </div>

      {/* Main Grid Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex justify-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="grid grid-cols-10 gap-1 w-fit">
              {grid.map((cell, idx) => (
                <button
                  key={`${cell.x}-${cell.y}`}
                  onClick={() => toggleSensor(idx)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border rounded-md flex items-center justify-center relative transition-colors ${getCellColor(cell.type)}`}
                >
                  {getCellIcon(cell.type)}
                  {cell.hasSensor && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
                      <Radio className="w-6 h-6 text-red-600 drop-shadow-md animate-bounce-short" />
                    </div>
                  )}
                </button>
              ))}
           </div>
        </div>

        {/* Result Panel */}
        <div className="lg:w-80 flex flex-col gap-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
               <Info size={18}/> 미션 목표
             </h3>
             <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
               <li>산불 발생 시 <strong>빠르게</strong> 감지하세요.</li>
               <li><strong>예산</strong>을 절약하여 효율을 높이세요.</li>
               <li>센서 민감도를 조절해 <strong>오탐</strong>을 줄이세요.</li>
               <li>오늘의 지형(Seed: {seed})은 고정입니다.</li>
             </ul>
          </div>

          {result && (
            <div className={`p-5 rounded-xl border-2 shadow-sm ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`text-xl font-bold mb-4 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? "산불 감지 성공! 🎉" : "감지 실패... 🔥"}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-black/5">
                   <span className="text-gray-600">감지 시간</span>
                   <span className="font-mono font-bold text-lg">{result.detectedAt ? `${result.detectedAt}분` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-black/5">
                   <span className="text-gray-600">소실 면적</span>
                   <span className="font-mono font-bold text-lg">{result.burnedArea} 구역</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-black/5">
                   <span className="text-gray-600">오탐 횟수</span>
                   <span className={`font-mono font-bold text-lg ${result.falseAlarms > 2 ? 'text-red-600' : 'text-gray-800'}`}>{result.falseAlarms}회</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                   <span className="text-gray-800 font-bold">총점</span>
                   <span className="font-mono font-bold text-2xl text-indigo-600">{result.score}점</span>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 bg-white/50 p-2 rounded">
                 <strong>피드백:</strong> {result.success 
                   ? (result.score > 80 ? "완벽한 배치입니다! 예산과 성능의 균형이 훌륭해요." : "성공했지만, 센서 위치나 민감도를 최적화해보세요.")
                   : "센서가 너무 멀리 있거나 민감도가 낮았습니다. 바람이 부는 숲 쪽에 집중해보세요."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
