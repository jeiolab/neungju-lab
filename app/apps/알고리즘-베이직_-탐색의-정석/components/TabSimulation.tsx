import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Target } from 'lucide-react';
import { SimulationStep } from '../types';

const INITIAL_DATA = [2, 5, 8, 12, 19, 24, 31, 45, 50, 67];
const TARGET_VALUE = 31;

const TabSimulation: React.FC = () => {
  const [method, setMethod] = useState<'linear' | 'binary'>('linear');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("탐색 시작 버튼을 눌러보세요.");
  
  // State for visualizations
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(INITIAL_DATA.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState(false);

  const resetSimulation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setComparisonCount(0);
    setActiveIndex(null);
    setLow(0);
    setHigh(INITIAL_DATA.length - 1);
    setMid(null);
    setFound(false);
    setStatusMessage("탐색 시작 버튼을 눌러보세요.");
  }, []);

  useEffect(() => {
    resetSimulation();
  }, [method, resetSimulation]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isPlaying && !found) {
      timer = setTimeout(() => {
        if (method === 'linear') {
          // Linear Search Logic
          const nextIndex = currentStep;
          if (nextIndex >= INITIAL_DATA.length) {
             setIsPlaying(false);
             return;
          }
          
          setActiveIndex(nextIndex);
          setComparisonCount(prev => prev + 1);
          
          if (INITIAL_DATA[nextIndex] === TARGET_VALUE) {
            setFound(true);
            setIsPlaying(false);
            setStatusMessage(`찾았습니다! 인덱스 ${nextIndex}에 위치합니다.`);
          } else {
            setCurrentStep(prev => prev + 1);
            setStatusMessage(`${INITIAL_DATA[nextIndex]}는 ${TARGET_VALUE}가 아닙니다. 다음으로 넘어갑니다.`);
          }

        } else {
          // Binary Search Logic
          if (low > high) {
            setIsPlaying(false);
            setStatusMessage("데이터를 찾을 수 없습니다.");
            return;
          }

          const currentMid = Math.floor((low + high) / 2);
          setMid(currentMid);
          setComparisonCount(prev => prev + 1);
          
          if (INITIAL_DATA[currentMid] === TARGET_VALUE) {
            setFound(true);
            setIsPlaying(false);
            setStatusMessage(`찾았습니다! 인덱스 ${currentMid} (중앙값)에 위치합니다.`);
          } else {
            if (INITIAL_DATA[currentMid] < TARGET_VALUE) {
              setLow(currentMid + 1);
              setStatusMessage(`${INITIAL_DATA[currentMid]} < ${TARGET_VALUE}. 오른쪽 절반을 탐색합니다.`);
            } else {
              setHigh(currentMid - 1);
              setStatusMessage(`${INITIAL_DATA[currentMid]} > ${TARGET_VALUE}. 왼쪽 절반을 탐색합니다.`);
            }
          }
        }
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, low, high, method, found]);

  const toggleMethod = (newMethod: 'linear' | 'binary') => {
    setMethod(newMethod);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <button
            onClick={() => toggleMethod('linear')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              method === 'linear' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            순차 탐색
          </button>
          <button
            onClick={() => toggleMethod('binary')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              method === 'binary' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            이진 탐색
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-slate-500">비교 횟수</p>
            <p className="text-2xl font-bold text-indigo-600">{comparisonCount} 회</p>
          </div>
          <button
            onClick={isPlaying ? () => setIsPlaying(false) : () => setIsPlaying(true)}
            disabled={found}
            className={`flex items-center px-4 py-2 rounded-lg font-bold text-white shadow-md transition-transform active:scale-95 ${
              found ? 'bg-slate-400 cursor-not-allowed' : isPlaying ? 'bg-orange-500' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isPlaying ? '일시 정지' : found ? '완료됨' : '탐색 시작'} <Play className="w-4 h-4 ml-2" />
          </button>
          <button onClick={resetSimulation} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full" title="초기화">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-xl overflow-x-auto min-h-[300px] flex flex-col items-center justify-center relative">
        <div className="text-white mb-8 text-lg font-medium flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-400"/> 찾는 값: <span className="text-2xl font-bold text-red-400 ml-2">{TARGET_VALUE}</span>
        </div>

        <div className="flex gap-2">
            {INITIAL_DATA.map((val, idx) => {
                let statusClass = "bg-slate-700 text-slate-300 border-slate-600";
                let scaleClass = "scale-100";
                let label = null;

                if (method === 'linear') {
                    if (idx === activeIndex) {
                        statusClass = val === TARGET_VALUE ? "bg-green-500 text-white border-green-400 ring-4 ring-green-500/30" : "bg-yellow-500 text-white border-yellow-400";
                        scaleClass = "scale-110";
                    } else if (activeIndex !== null && idx < activeIndex) {
                        statusClass = "bg-slate-800 text-slate-600 border-slate-700 opacity-50"; // Checked
                    }
                } else { // Binary
                    const isEliminated = idx < low || idx > high;
                    if (isEliminated) {
                         statusClass = "bg-slate-800 text-slate-700 border-slate-800 opacity-30";
                    } else if (idx === mid) {
                        statusClass = val === TARGET_VALUE ? "bg-green-500 text-white border-green-400 ring-4 ring-green-500/30" : "bg-yellow-500 text-white border-yellow-400";
                        scaleClass = "scale-110";
                        label = "MID";
                    } else if (idx === low && idx === high) {
                         // One item left
                    } else if (idx === low) {
                         statusClass = "bg-indigo-900 text-indigo-300 border-indigo-700";
                         label = "LOW";
                    } else if (idx === high) {
                         statusClass = "bg-indigo-900 text-indigo-300 border-indigo-700";
                         label = "HIGH";
                    } else {
                         statusClass = "bg-indigo-900/40 text-indigo-200 border-indigo-800"; // Active Range
                    }
                }

                return (
                    <div key={idx} className="flex flex-col items-center transition-all duration-300">
                        <div className={`w-12 h-16 md:w-16 md:h-24 flex items-center justify-center rounded-lg border-2 text-xl md:text-2xl font-bold shadow-lg transition-all duration-300 ${statusClass} ${scaleClass}`}>
                            {val}
                        </div>
                        <div className="text-xs text-slate-500 mt-2">{idx}</div>
                        {label && <div className="text-xs font-bold text-indigo-400 mt-1">{label}</div>}
                    </div>
                );
            })}
        </div>

        <div className="mt-8 text-center">
            <p className="text-indigo-200 text-lg animate-pulse">{statusMessage}</p>
        </div>
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-sm text-indigo-800">
        💡 <strong>팁:</strong> {method === 'linear' ? '순차 탐색은 10개를 찾으려면 최대 10번 비교해야 합니다.' : '이진 탐색은 10개 중 절반씩 버리므로 최대 4번(log₂10) 안에 찾을 수 있습니다.'}
      </div>
    </div>
  );
};

export default TabSimulation;