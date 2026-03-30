import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';
import { SortType, SortDirection, AnimationStep } from '../types';
import { generateRandomArray, generateSteps } from '../services/sortingAlgorithms';
import Visualizer from './Visualizer';

interface SimulationTabProps {
  onComplete: (type: SortType) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onComplete }) => {
  // Configuration State
  const [sortType, setSortType] = useState<SortType>(SortType.BUBBLE);
  const [count, setCount] = useState<number>(7);
  const [direction, setDirection] = useState<SortDirection>(SortDirection.ASC);
  const [speed, setSpeed] = useState<number>(800);

  // Execution State
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Initialize
  useEffect(() => {
    resetSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType, count, direction]);

  const resetSimulation = () => {
    setIsPlaying(false);
    setIsFinished(false);
    const initialArray = generateRandomArray(count);
    const calculatedSteps = generateSteps(initialArray, sortType, direction);
    setSteps(calculatedSteps);
    setCurrentStepIndex(0);
  };

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      if (!isFinished) {
          setIsFinished(true);
          onComplete(sortType);
      }
    }
  }, [currentStepIndex, steps.length, isFinished, onComplete, sortType]);

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsFinished(false);
    }
  };

  // Auto-play logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, handleNext, speed]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        
        <div className="flex gap-4 items-center flex-wrap">
          {/* Algorithm Selector */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-bold mb-1">알고리즘</label>
            <select 
              value={sortType} 
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="p-2 border rounded-md text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              disabled={isPlaying}
            >
              <option value={SortType.BUBBLE}>버블 정렬</option>
              <option value={SortType.SELECTION}>선택 정렬</option>
              <option value={SortType.INSERTION}>삽입 정렬</option>
            </select>
          </div>

          {/* Count Slider */}
          <div className="flex flex-col w-32">
            <label className="text-xs text-slate-500 font-bold mb-1">데이터 개수: {count}</label>
            <input 
              type="range" 
              min="5" 
              max="10" 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="accent-indigo-600 cursor-pointer"
              disabled={isPlaying}
            />
          </div>

          {/* Direction Toggle */}
          <div className="flex flex-col">
             <label className="text-xs text-slate-500 font-bold mb-1">정렬 기준</label>
             <div className="flex bg-slate-100 rounded-md p-1">
                <button 
                    onClick={() => setDirection(SortDirection.ASC)}
                    className={`px-3 py-1 text-xs rounded ${direction === SortDirection.ASC ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                >오름차순</button>
                <button 
                    onClick={() => setDirection(SortDirection.DESC)}
                    className={`px-3 py-1 text-xs rounded ${direction === SortDirection.DESC ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                >내림차순</button>
             </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
            <button onClick={resetSimulation} className="p-2 hover:bg-slate-100 rounded-full text-slate-600" title="리셋">
                <RotateCcw size={20} />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button onClick={handlePrev} disabled={currentStepIndex === 0 || isPlaying} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 disabled:opacity-30">
                <SkipBack size={20} />
            </button>
            <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white shadow-md transition-colors ${isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
                <span className="text-sm">{isPlaying ? "일시정지" : "시작"}</span>
            </button>
            <button onClick={handleNext} disabled={currentStepIndex >= steps.length - 1 || isPlaying} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 disabled:opacity-30">
                <SkipForward size={20} />
            </button>
        </div>
      </div>

      {/* Speed Control (Optional) */}
      <div className="flex justify-end items-center gap-2 text-xs text-slate-500">
         <FastForward size={14} />
         <span>속도 조절</span>
         <input 
            type="range" 
            min="100" 
            max="1500" 
            step="100"
            // Inverse logic: lower value = faster speed
            value={1600 - speed} 
            onChange={(e) => setSpeed(1600 - Number(e.target.value))}
            className="w-24 accent-slate-400"
         />
      </div>

      {/* Visualizer Area */}
      <Visualizer 
        step={steps[currentStepIndex] || null} 
        sortType={sortType}
      />

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-slate-500">
        Step {currentStepIndex + 1} / {steps.length}
      </div>

    </div>
  );
};

export default SimulationTab;