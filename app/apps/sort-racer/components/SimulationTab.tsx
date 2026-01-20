import React, { useState, useEffect, useRef } from 'react';
import { AlgorithmType, DataType, SimulationState } from '../types';
import { getSorter } from '../services/sortingAlgorithms';
import RaceTrack from './RaceTrack';
import { Play, RotateCcw, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const INITIAL_SIZE = 20;

const generateData = (type: DataType, size: number): number[] => {
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  if (type === DataType.SORTED) return arr;
  if (type === DataType.REVERSE) return arr.reverse();
  // Random shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const emptyState = (arr: number[]): SimulationState => ({
  array: [...arr],
  activeIndices: [],
  sortedIndices: [],
  comparisons: 0,
  swaps: 0,
  finished: false,
});

const SimulationTab: React.FC = () => {
  // Settings
  const [dataSize, setDataSize] = useState<number>(INITIAL_SIZE);
  const [dataType, setDataType] = useState<DataType>(DataType.RANDOM);
  const [leftAlgo, setLeftAlgo] = useState<AlgorithmType>(AlgorithmType.BUBBLE);
  const [rightAlgo, setRightAlgo] = useState<AlgorithmType>(AlgorithmType.QUICK);
  
  // Betting
  const [prediction, setPrediction] = useState<AlgorithmType | null>(null);
  
  // Status
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [winner, setWinner] = useState<AlgorithmType | null>(null);

  // Data & State
  const [initialData, setInitialData] = useState<number[]>([]);
  const [leftState, setLeftState] = useState<SimulationState>(emptyState([]));
  const [rightState, setRightState] = useState<SimulationState>(emptyState([]));

  // Refs for loop
  const leftGenRef = useRef<Generator<any, any, any> | null>(null);
  const rightGenRef = useRef<Generator<any, any, any> | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize Data
  useEffect(() => {
    const newData = generateData(dataType, dataSize);
    setInitialData(newData);
    resetRace(newData);
  }, [dataSize, dataType]);

  const resetRace = (data: number[] = initialData) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setIsFinished(false);
    setWinner(null);
    setLeftState(emptyState(data));
    setRightState(emptyState(data));
    leftGenRef.current = null;
    rightGenRef.current = null;
  };

  const startRace = () => {
    if (isRunning) return;
    
    // Initialize generators if not paused
    if (!leftGenRef.current) leftGenRef.current = getSorter(leftAlgo, initialData);
    if (!rightGenRef.current) rightGenRef.current = getSorter(rightAlgo, initialData);

    setIsRunning(true);
    
    // The Loop
    timerRef.current = window.setInterval(() => {
      let leftDone = false;
      let rightDone = false;

      // Step Left
      if (leftGenRef.current) {
        const next = leftGenRef.current.next();
        if (!next.done) {
          setLeftState({ ...next.value, finished: false });
        } else {
          leftDone = true;
          setLeftState(prev => ({ ...prev, finished: true }));
        }
      }

      // Step Right
      if (rightGenRef.current) {
        const next = rightGenRef.current.next();
        if (!next.done) {
          setRightState({ ...next.value, finished: false });
        } else {
          rightDone = true;
          setRightState(prev => ({ ...prev, finished: true }));
        }
      }

      // Check finish conditions
      if (leftDone && rightDone) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setIsFinished(true);
      }
    }, 50); // Speed: 50ms per step
  };

  // Determine winner based on step count efficiency (simulated by who finishes logic, 
  // but since we step together, the one with FEWER comparisons+swaps is effectively faster in CPU time)
  // For the race metaphor, let's say "Efficiency Winner".
  useEffect(() => {
    if (isFinished) {
      const leftOps = leftState.comparisons + leftState.swaps;
      const rightOps = rightState.comparisons + rightState.swaps;
      if (leftOps < rightOps) setWinner(leftAlgo);
      else if (rightOps < leftOps) setWinner(rightAlgo);
      else setWinner(null); // Tie
    }
  }, [isFinished, leftState, rightState, leftAlgo, rightAlgo]);


  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">데이터 유형</label>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {Object.values(DataType).map((type) => (
                <button
                  key={type}
                  onClick={() => !isRunning && setDataType(type)}
                  disabled={isRunning}
                  className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${dataType === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">데이터 크기: {dataSize}</label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={dataSize}
              onChange={(e) => {
                  if(!isRunning) setDataSize(Number(e.target.value));
              }}
              disabled={isRunning}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">승자 예측</label>
            <select 
              className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
              value={prediction || ''}
              onChange={(e) => setPrediction(e.target.value as AlgorithmType)}
              disabled={isRunning || isFinished}
            >
              <option value="">누가 이길까요?</option>
              <option value={leftAlgo}>{leftAlgo}</option>
              <option value={rightAlgo}>{rightAlgo}</option>
            </select>
          </div>

          <div className="flex items-end space-x-2">
            {!isRunning && !isFinished ? (
               <button
               onClick={startRace}
               className="w-full flex items-center justify-center bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-lg transform hover:-translate-y-0.5"
             >
               <Play className="w-5 h-5 mr-2" fill="currentColor" />
               RACE START
             </button>
            ) : (
                <button
                onClick={() => resetRace()}
                className="w-full flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                리셋
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Race Track */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Racer 1 Selector */}
        <div className="absolute -top-3 left-4 z-10">
           <select 
             value={leftAlgo} 
             onChange={(e) => setLeftAlgo(e.target.value as AlgorithmType)}
             disabled={isRunning}
             className="bg-cyan-600 text-white text-xs font-bold py-1 px-3 rounded-full border border-cyan-700 outline-none"
           >
             {Object.values(AlgorithmType).map(a => <option key={a} value={a}>{a}</option>)}
           </select>
        </div>
        <RaceTrack 
          algorithmName={leftAlgo} 
          state={leftState} 
          colorTheme="cyan" 
          isWinner={isFinished && winner === leftAlgo}
        />

        {/* Racer 2 Selector */}
        <div className="absolute -top-3 right-4 lg:left-[52%] z-10">
           <select 
             value={rightAlgo} 
             onChange={(e) => setRightAlgo(e.target.value as AlgorithmType)}
             disabled={isRunning}
             className="bg-rose-600 text-white text-xs font-bold py-1 px-3 rounded-full border border-rose-700 outline-none"
           >
             {Object.values(AlgorithmType).map(a => <option key={a} value={a}>{a}</option>)}
           </select>
        </div>
        <RaceTrack 
            algorithmName={rightAlgo} 
            state={rightState} 
            colorTheme="rose"
            isWinner={isFinished && winner === rightAlgo}
        />
      </div>

      {/* Analysis / Results */}
      {isFinished && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-8">
             <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <Award className="w-6 h-6 text-yellow-500 mr-2" />
                    경기 결과 분석
                </h3>
                <div className="space-y-4 text-slate-700">
                    <p>
                        <span className="font-bold text-slate-900">{winner === leftAlgo ? leftAlgo : winner === rightAlgo ? rightAlgo : '무승부'}</span>
                        {winner ? '가 더 효율적이었습니다!' : '입니다.'}
                    </p>
                    
                    {prediction && (
                        <div className={`p-4 rounded-lg border ${prediction === winner ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                            {prediction === winner ? '🎉 예측 성공! 알고리즘의 특성을 잘 파악하고 계시네요.' : '😢 예측 실패. 데이터 유형에 따른 알고리즘 특성을 다시 확인해보세요.'}
                        </div>
                    )}

                    <div className="text-sm">
                        <strong className="text-indigo-600">Coach's Tip:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
                            {dataType === DataType.REVERSE && leftAlgo === AlgorithmType.INSERTION && <li>삽입 정렬은 역순 데이터에서 최악의 성능 O(n²)을 보입니다.</li>}
                            {dataType === DataType.SORTED && leftAlgo === AlgorithmType.INSERTION && <li>하지만 이미 정렬된 데이터에서는 삽입 정렬이 O(n)으로 매우 빠릅니다!</li>}
                            {(leftAlgo === AlgorithmType.QUICK || rightAlgo === AlgorithmType.QUICK) && <li>퀵 정렬은 평균적으로 가장 빠르지만, 피벗 선택에 따라 성능이 달라질 수 있습니다.</li>}
                            {dataType === DataType.RANDOM && <li>일반적인 무작위 데이터에서는 O(n log n) 알고리즘(퀵, 병합 등)이 O(n²) 알고리즘(버블, 선택, 삽입)보다 압도적으로 빠릅니다.</li>}
                        </ul>
                    </div>
                </div>
             </div>
             <div className="flex-1 h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={[
                            { name: leftAlgo, comparisons: leftState.comparisons, swaps: leftState.swaps },
                            { name: rightAlgo, comparisons: rightState.comparisons, swaps: rightState.swaps },
                        ]}
                        layout="vertical"
                    >
                         <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                         <XAxis type="number" stroke="#64748b" />
                         <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#1e293b' }}
                         />
                         <Legend />
                         <Bar dataKey="comparisons" fill="#3b82f6" name="비교 횟수" radius={[0, 4, 4, 0]} />
                         <Bar dataKey="swaps" fill="#ef4444" name="교환 횟수" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationTab;