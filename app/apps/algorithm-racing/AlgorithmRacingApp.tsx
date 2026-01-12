'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { SearchStep, RaceState, AlgorithmType } from './types';
import { generateSortedData, generateSequentialSteps, generateBinarySteps } from './utils/algorithms';
import { RaceTrack } from './components/RaceTrack';
import { PerformanceChart } from './components/PerformanceChart';
import { SPEEDS, BINARY_DELAY_MULTIPLIER } from './constants';
import { Trophy, RotateCcw, Info, Play, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';

const AlgorithmRacingApp: React.FC = () => {
  // --- Settings State ---
  const [dataSize, setDataSize] = useState<number>(100);
  const [targetNumber, setTargetNumber] = useState<number>(77);
  const [bet, setBet] = useState<AlgorithmType | null>(null);

  // --- Simulation Data ---
  const [data, setData] = useState<number[]>([]);
  const [simData, setSimData] = useState<{ seq: SearchStep[], bin: SearchStep[] }>({ seq: [], bin: [] });

  // --- Runtime State ---
  const [raceState, setRaceState] = useState<RaceState>({
    status: 'idle',
    sequentialCurrentStepIndex: -1,
    binaryCurrentStepIndex: -1,
    bet: null,
    winner: null,
  });

  const [showWarning, setShowWarning] = useState(false);

  // Timers
  const seqTimerRef = useRef<number | null>(null);
  const binTimerRef = useRef<number | null>(null);

  // --- Initialization ---
  useEffect(() => {
    const newData = generateSortedData(dataSize);
    setData(newData);
    // Ensure target is within bounds when resizing
    if (targetNumber > dataSize) setTargetNumber(dataSize);
  }, [dataSize]);

  // Pre-calculate steps when data or target changes
  useEffect(() => {
    if (data.length > 0) {
      setSimData({
        seq: generateSequentialSteps(data, targetNumber),
        bin: generateBinarySteps(data, targetNumber),
      });
      resetRace();
    }
  }, [data, targetNumber]);

  // --- Actions ---

  const resetRace = () => {
    stopTimers();
    setRaceState({
      status: 'idle',
      sequentialCurrentStepIndex: -1,
      binaryCurrentStepIndex: -1,
      bet: bet, // Keep the bet
      winner: null,
    });
  };

  const stopTimers = () => {
    if (seqTimerRef.current) clearInterval(seqTimerRef.current);
    if (binTimerRef.current) clearInterval(binTimerRef.current);
  };

  const startRace = () => {
    if (raceState.status === 'running' || raceState.status === 'finished') {
      resetRace();
      // Allow a brief tick for state to reset before starting again if needed, 
      // but simpler to just reset. User clicks Start again.
      return;
    }

    if (!bet) {
      alert("먼저 캐릭터(베팅)를 선택해주세요!");
      return;
    }

    setRaceState(prev => ({ ...prev, status: 'running', winner: null }));

    const baseDelay = SPEEDS[dataSize as keyof typeof SPEEDS] || 50;
    
    // Start Sequential
    let seqIdx = 0;
    seqTimerRef.current = window.setInterval(() => {
      setRaceState(prev => {
        // Check if already won by binary or finished
        if (prev.winner || prev.status === 'finished') {
          stopTimers();
          return prev;
        }

        const nextIdx = seqIdx;
        seqIdx++;
        
        const isFinished = nextIdx >= simData.seq.length - 1;
        
        if (isFinished) {
          clearInterval(seqTimerRef.current!);
          return {
            ...prev,
            sequentialCurrentStepIndex: nextIdx,
            winner: prev.winner || 'sequential',
            status: prev.winner ? 'finished' : (prev.winner === 'binary' ? 'finished' : 'running') // Logic check
          };
        }
        return { ...prev, sequentialCurrentStepIndex: nextIdx };
      });
      
      // Check win condition outside setter to avoid complex state merge logic if possible,
      // but inside setter is safer for concurrency emulation.
      if (seqIdx >= simData.seq.length) {
         finishRace('sequential');
      }

    }, baseDelay);

    // Start Binary
    // Binary is naturally faster in steps, but we slow it down visually so the user can see it hopping.
    let binIdx = 0;
    const binaryDelay = Math.max(200, baseDelay * BINARY_DELAY_MULTIPLIER); 
    
    binTimerRef.current = window.setInterval(() => {
      setRaceState(prev => {
        if (prev.winner || prev.status === 'finished') {
          stopTimers();
          return prev;
        }

        const nextIdx = binIdx;
        binIdx++;

        const isFinished = nextIdx >= simData.bin.length - 1;

        if (isFinished) {
          clearInterval(binTimerRef.current!);
          return {
            ...prev,
            binaryCurrentStepIndex: nextIdx,
          };
        }
        return { ...prev, binaryCurrentStepIndex: nextIdx };
      });
      
      if (binIdx >= simData.bin.length) {
        finishRace('binary');
      }
    }, binaryDelay);
  };

  const finishRace = (winner: AlgorithmType) => {
    // This function is called by the intervals.
    // We need to verify inside the state update to ensure no double-win.
    setRaceState(prev => {
      if (prev.winner) return prev; // Already has a winner
      stopTimers();
      return {
        ...prev,
        winner: winner,
        status: 'finished',
        // Make sure both visually complete to the end of their arrays if they won
        sequentialCurrentStepIndex: winner === 'sequential' ? simData.seq.length - 1 : prev.sequentialCurrentStepIndex,
        binaryCurrentStepIndex: winner === 'binary' ? simData.bin.length - 1 : prev.binaryCurrentStepIndex,
      };
    });
  };

  // Cleanup
  useEffect(() => {
    return () => stopTimers();
  }, []);

  // --- Derived Data for UI ---
  const currentSeqStep = simData.seq[raceState.sequentialCurrentStepIndex] || null;
  const currentBinStep = simData.bin[raceState.binaryCurrentStepIndex] || null;

  // History sets for visualization
  const seqHistory = useMemo(() => {
    const s = new Set<number>();
    for (let i = 0; i <= raceState.sequentialCurrentStepIndex; i++) {
      if (simData.seq[i]) s.add(simData.seq[i].index);
    }
    return s;
  }, [raceState.sequentialCurrentStepIndex, simData.seq]);

  const binHistory = useMemo(() => {
    const s = new Set<number>();
    for (let i = 0; i <= raceState.binaryCurrentStepIndex; i++) {
      if (simData.bin[i]) s.add(simData.bin[i].index);
    }
    return s;
  }, [raceState.binaryCurrentStepIndex, simData.bin]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">알고리즘 레이싱</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">선형 탐색과 이진 탐색 알고리즘의 성능 차이를 시각적으로 비교하고 학습하는 인터랙티브 교육 앱입니다.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWarning(true)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200"
              >
                <Info size={16} />
                <span>이진 탐색은 왜 빠른가요?</span>
              </button>
            </header>

            {/* Control Panel */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">데이터 개수 (N)</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {[10, 100, 1000].map(size => (
                    <button
                      key={size}
                      onClick={() => {
                         if (raceState.status !== 'running') setDataSize(size);
                      }}
                      disabled={raceState.status === 'running'}
                      className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${
                        dataSize === size ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">찾을 숫자</label>
                <div className="relative flex items-center">
                   <input 
                     type="number" 
                     min={1} 
                     max={dataSize}
                     value={targetNumber}
                     onChange={(e) => {
                       let val = parseInt(e.target.value) || 1;
                       if (val > dataSize) val = dataSize;
                       if (val < 1) val = 1;
                       if (raceState.status !== 'running') setTargetNumber(val);
                     }}
                     disabled={raceState.status === 'running'}
                     className="w-full bg-slate-100 border-none rounded-lg py-2 pl-3 pr-20 text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                   />
                   <div className="absolute left-1/2 -translate-x-1/2 flex flex-col">
                     <button
                       type="button"
                       onClick={() => {
                         if (raceState.status !== 'running' && targetNumber < dataSize) {
                           setTargetNumber(Math.min(targetNumber + 1, dataSize));
                         }
                       }}
                       disabled={raceState.status === 'running' || targetNumber >= dataSize}
                       className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     >
                       <ChevronUp size={14} />
                     </button>
                     <button
                       type="button"
                       onClick={() => {
                         if (raceState.status !== 'running' && targetNumber > 1) {
                           setTargetNumber(Math.max(targetNumber - 1, 1));
                         }
                       }}
                       disabled={raceState.status === 'running' || targetNumber <= 1}
                       className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     >
                       <ChevronDown size={14} />
                     </button>
                   </div>
                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">/ {dataSize}</span>
                </div>
              </div>

              <div className="md:col-span-4 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">우승자 예측 (베팅)</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => raceState.status === 'idle' && setBet('sequential')}
                    className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                      bet === 'sequential' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-slate-100 hover:border-emerald-200 text-slate-400'
                    } ${raceState.status !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-xs font-bold">거북이</span>
                  </button>
                  <button
                    onClick={() => raceState.status === 'idle' && setBet('binary')}
                    className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                      bet === 'binary' 
                        ? 'border-rose-500 bg-rose-50 text-rose-700' 
                        : 'border-slate-100 hover:border-rose-200 text-slate-400'
                    } ${raceState.status !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-xs font-bold">토끼</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 flex items-end">
                 {raceState.status === 'idle' || raceState.status === 'finished' ? (
                   <button 
                     onClick={startRace}
                     disabled={!bet}
                     className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                   >
                     <Play fill="currentColor" size={18} />
                     시작
                   </button>
                 ) : (
                   <button 
                    onClick={resetRace}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                   >
                     <RotateCcw size={18} />
                     초기화
                   </button>
                 )}
              </div>
            </section>

            {/* Main Arena */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* Sequential Track */}
                <RaceTrack 
                  type="sequential" 
                  dataSize={dataSize} 
                  currentStep={currentSeqStep} 
                  history={seqHistory} 
                />

                {/* Binary Track */}
                <RaceTrack 
                  type="binary" 
                  dataSize={dataSize} 
                  currentStep={currentBinStep} 
                  history={binHistory}
                  range={currentBinStep ? { low: currentBinStep.low!, high: currentBinStep.high! } : undefined}
                />
              </div>

              <div className="lg:col-span-1 space-y-6">
                {/* Scoreboard */}
                <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy size={120} />
                  </div>
                  <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">실시간 현황</h2>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-emerald-400 font-bold">거북이 시도</span>
                      <span className="text-3xl font-mono">{raceState.sequentialCurrentStepIndex + 1}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-rose-400 font-bold">토끼 점프</span>
                      <span className="text-3xl font-mono">{raceState.binaryCurrentStepIndex + 1}</span>
                    </div>
                  </div>

                  {raceState.winner && (
                     <div className="mt-6 p-3 bg-white/10 rounded-lg text-center backdrop-blur-sm animate-pulse">
                        <p className="text-sm text-slate-300 mb-1">최종 우승</p>
                        <p className={`text-xl font-black uppercase ${raceState.winner === 'binary' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {raceState.winner === 'binary' ? '토끼 (이진 탐색)' : '거북이 (선형 탐색)'}
                        </p>
                        {bet === raceState.winner 
                          ? <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full mt-2 inline-block">예측 성공!</span> 
                          : <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full mt-2 inline-block">아쉬워요!</span>
                        }
                     </div>
                  )}
                </div>

                {/* Hint / Message */}
                {raceState.winner === 'binary' && dataSize >= 100 && (
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800">
                    <p className="font-semibold mb-1">차이가 느껴지시나요?</p>
                    <p>
                      거북이가 {raceState.sequentialCurrentStepIndex + 1}번 확인하는 동안, 
                      토끼는 단 {raceState.binaryCurrentStepIndex + 1}번 만에 {dataSize}개 중 {targetNumber}을(를) 찾아냈어요!
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Graph Section */}
            <PerformanceChart />

            {/* Warning/Education Modal */}
            {showWarning && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                 <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                    <div className="flex items-start gap-4">
                       <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                          <AlertTriangle size={24} />
                       </div>
                       <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-2">핵심 규칙</h3>
                          <p className="text-slate-600 mb-4 leading-relaxed">
                            이진 탐색(토끼)은 매우 빠르지만 한 가지 중요한 조건이 있습니다:
                            <br/><br/>
                            <strong className="text-slate-900 bg-amber-100 px-1">데이터가 반드시 정렬되어 있어야 합니다.</strong>
                            <br/><br/>
                            만약 숫자들이 뒤섞여 있다면 토끼는 어디로 점프할지 알 수 없게 되고, 
                            거북이(선형 탐색)가 유일한 해결책이 됩니다.
                          </p>
                          <button 
                            onClick={() => setShowWarning(false)}
                            className="w-full py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                          >
                            알겠습니다!
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AlgorithmRacingApp;

