import React, { useState, useEffect } from 'react';
import { Student, SortState, SortCriteria, SortOrder } from '../../types';
import { INITIAL_STUDENTS } from '../../constants';
import { Play, RotateCcw, ArrowRight, UserPlus, Check } from 'lucide-react';
import { updateXP, addBadge } from '../../services/storageService';

interface Props {
  onUpdate: () => void;
}

const SimulationTab: React.FC<Props> = ({ onUpdate }) => {
  // Config State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [criteria, setCriteria] = useState<SortCriteria>('total');
  const [order, setOrder] = useState<SortOrder>('desc');
  
  // Sort Execution State
  const [sortState, setSortState] = useState<SortState>({
    stepIndex: 0,
    compareIndex: 1,
    minIndex: 0,
    sortedCount: 0,
    comparisons: 0,
    swaps: 0,
    students: [...INITIAL_STUDENTS],
    finished: false,
    log: '시뮬레이션을 시작하려면 버튼을 누르세요.'
  });

  const [isRunning, setIsRunning] = useState(false);

  // Reset logic
  const resetSimulation = () => {
    setSortState({
      stepIndex: 0,
      compareIndex: 1, // Start comparing with i+1
      minIndex: 0,
      sortedCount: 0,
      comparisons: 0,
      swaps: 0,
      students: [...students], // Reset to initial config
      finished: false,
      log: '초기화되었습니다. 시작하세요.'
    });
    setIsRunning(false);
  };

  // Selection Sort Logic: Execute ONE minimal comparison step
  const executeNextMicroStep = () => {
    setSortState(prev => {
      if (prev.finished) return prev;

      const currentList = [...prev.students];
      let { stepIndex, compareIndex, minIndex, comparisons, swaps, sortedCount } = prev;
      let log = '';

      // Determine value getter based on criteria
      const getValue = (s: Student) => {
        if (criteria === 'total') return s.total;
        if (criteria === 'info') return s.info;
        return s.korean;
      };

      // Comparison Logic
      const shouldSwap = (a: number, b: number) => {
        return order === 'asc' ? a < b : a > b;
      };

      const n = currentList.length;

      // If we finished a pass (compareIndex reached end)
      if (compareIndex >= n) {
        // SWAP Phase
        log = `${stepIndex + 1}회전 종료. `;
        if (minIndex !== stepIndex) {
          const temp = currentList[stepIndex];
          currentList[stepIndex] = currentList[minIndex];
          currentList[minIndex] = temp;
          swaps++;
          log += `기준(${stepIndex})과 찾은 값(${minIndex}) 교환!`;
        } else {
          log += `기준 위치가 이미 최적값입니다. 교환 없음.`;
        }
        
        // Move to next pass
        const nextStep = stepIndex + 1;
        if (nextStep >= n - 1) {
          // Finished completely
          updateXP(50);
          addBadge('정렬 시뮬레이션 완주');
          onUpdate();
          return {
            ...prev,
            students: currentList,
            stepIndex: nextStep,
            sortedCount: n, // All sorted
            swaps,
            finished: true,
            log: '정렬이 완료되었습니다!'
          };
        }

        return {
          ...prev,
          students: currentList,
          stepIndex: nextStep,
          compareIndex: nextStep + 1,
          minIndex: nextStep, // Reset minIndex to new pivot
          sortedCount: nextStep,
          swaps,
          log
        };
      }

      // COMPARISON Phase
      comparisons++;
      const currentVal = getValue(currentList[compareIndex]);
      const minVal = getValue(currentList[minIndex]);

      let newMinIndex = minIndex;
      // Note: In "Selection Sort", we look for the extreme value. 
      // If order is asc, we look for smallest. If desc, largest.
      // Logic: if currentVal is "better" than minVal, update minIndex.
      if (shouldSwap(currentVal, minVal)) {
        newMinIndex = compareIndex;
        log = `새로운 ${order === 'asc' ? '최솟값' : '최댓값'} 발견! (인덱스 ${compareIndex})`;
      } else {
        log = `비교 중... (현재 ${order === 'asc' ? '최소' : '최대'}: 인덱스 ${minIndex})`;
      }

      return {
        ...prev,
        compareIndex: compareIndex + 1,
        minIndex: newMinIndex,
        comparisons,
        log
      };
    });
  };

  // Effect for Auto-play would go here, but prompt requests "User clicks Next Step".
  // Let's make "Next Step" perform ONE comparison for granularity, 
  // OR one full pass? The prompt says "Step-by-Step". 
  // Granular is better for education.

  const getValueDisplay = (s: Student) => {
    if (criteria === 'total') return s.total;
    if (criteria === 'info') return s.info;
    return s.korean;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] overflow-hidden">
      {/* Sidebar: Controls & Data Input */}
      <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 mb-2">1. 데이터 설정</h3>
          <div className="text-sm text-slate-500 mb-2">정렬할 학생들을 확인하세요.</div>
          <div className="bg-slate-50 rounded p-2 text-xs space-y-1 max-h-40 overflow-y-auto border border-slate-100">
             {students.map((s, idx) => (
               <div key={s.id} className="flex justify-between px-2 py-1">
                 <span>{s.name}</span>
                 <span className="font-mono text-slate-400">총{s.total}/정{s.info}/국{s.korean}</span>
               </div>
             ))}
          </div>
          <button 
            disabled={isRunning || sortState.stepIndex > 0}
            onClick={() => {
              // Reset to random shuffle of initial for variety
              const shuffled = [...INITIAL_STUDENTS].sort(() => Math.random() - 0.5);
              setStudents(shuffled);
              setSortState(prev => ({ ...prev, students: shuffled }));
              resetSimulation();
            }}
            className="mt-2 w-full py-2 text-xs border border-dashed border-slate-300 rounded text-slate-500 hover:bg-slate-50"
          >
            데이터 섞기 / 초기화
          </button>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 mb-2">2. 정렬 기준</h3>
          <div className="grid grid-cols-2 gap-2">
            <select 
              className="p-2 border rounded text-sm"
              value={criteria}
              onChange={(e) => {
                setCriteria(e.target.value as SortCriteria);
                resetSimulation();
              }}
              disabled={sortState.stepIndex > 0}
            >
              <option value="total">총점</option>
              <option value="info">정보 점수</option>
              <option value="korean">국어 점수</option>
            </select>
            <select 
              className="p-2 border rounded text-sm"
              value={order}
              onChange={(e) => {
                setOrder(e.target.value as SortOrder);
                resetSimulation();
              }}
              disabled={sortState.stepIndex > 0}
            >
              <option value="desc">내림차순 (큰 순서)</option>
              <option value="asc">오름차순 (작은 순서)</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 mb-2">3. 시뮬레이터</h3>
          <div className="flex gap-2">
            <button
              onClick={executeNextMicroStep}
              disabled={sortState.finished}
              className={`flex-1 py-3 rounded-lg font-bold text-white shadow-sm flex items-center justify-center gap-2
                ${sortState.finished ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all'}`}
            >
              <Play size={16} fill="currentColor" />
              {sortState.stepIndex === 0 && sortState.compareIndex === 1 ? '정렬 시작' : '다음 단계'}
            </button>
            <button
              onClick={resetSimulation}
              className="px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
            >
              <RotateCcw size={16} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
            <div className="bg-slate-50 p-2 rounded">
              <div className="text-slate-400 text-xs">비교 횟수</div>
              <div className="font-mono font-bold text-lg text-slate-700">{sortState.comparisons}</div>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <div className="text-slate-400 text-xs">교환 횟수</div>
              <div className="font-mono font-bold text-lg text-slate-700">{sortState.swaps}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="lg:col-span-2 bg-slate-100 p-6 rounded-xl flex flex-col relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-mono border border-slate-200 shadow-sm z-10">
          {sortState.log}
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-2 w-full">
           {/* Visual Bars */}
           {sortState.students.map((student, index) => {
             const val = getValueDisplay(student);
             const isSorted = index < sortState.sortedCount;
             const isPivot = !sortState.finished && index === sortState.stepIndex;
             const isComparing = !sortState.finished && index === sortState.compareIndex;
             const isCurrentMin = !sortState.finished && index === sortState.minIndex;
             
             // Dynamic styling based on state
             let barColor = 'bg-white border-slate-200';
             let scale = 'scale-100';
             let shadow = 'shadow-sm';

             if (isSorted) {
               barColor = 'bg-emerald-100 border-emerald-300 opacity-70';
             } else if (isCurrentMin) {
               barColor = 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-400';
               shadow = 'shadow-lg';
               scale = 'scale-105';
             } else if (isComparing) {
               barColor = 'bg-blue-50 border-blue-400';
               scale = 'scale-105';
             } else if (isPivot) {
               barColor = 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500 border-dashed';
             }

             return (
               <div 
                key={student.id} 
                className={`w-full max-w-xl p-3 rounded-lg border flex items-center justify-between transition-all duration-300 ${barColor} ${shadow} ${scale}`}
               >
                 <div className="flex items-center gap-3">
                   <div className="font-mono text-slate-400 w-6 text-center text-xs">
                     {index}
                   </div>
                   <div className="font-bold text-slate-800">
                     {student.name}
                   </div>
                   {isPivot && <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded">기준(i)</span>}
                   {isCurrentMin && !isSorted && <span className="text-[10px] bg-yellow-500 text-white px-1.5 py-0.5 rounded">선택(Min/Max)</span>}
                   {isComparing && <span className="text-[10px] bg-blue-400 text-white px-1.5 py-0.5 rounded">비교중(j)</span>}
                   {isSorted && <Check className="text-emerald-500 w-4 h-4" />}
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <div className="h-2 bg-slate-200 rounded-full w-24 md:w-48 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isSorted ? 'bg-emerald-400' : 'bg-indigo-400'}`}
                        style={{ width: `${(val / 300) * 100}%` }} // Approximate scale
                      ></div>
                    </div>
                    <span className="font-mono font-bold w-10 text-right">{val}</span>
                 </div>
               </div>
             );
           })}
        </div>

        <div className="mt-8 bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">현재 단계 설명</h4>
          <p className="text-sm text-slate-700">
            {sortState.finished 
              ? "정렬이 완료되었습니다! 정렬된 데이터로 상위 3명을 선발할 수 있습니다." 
              : sortState.stepIndex === sortState.minIndex 
                ? `현재 기준 위치(인덱스 ${sortState.stepIndex})의 값이 잠정적인 ${order === 'asc' ? '최솟값' : '최댓값'}입니다.`
                : `현재까지 찾은 ${order === 'asc' ? '최솟값' : '최댓값'}은 인덱스 ${sortState.minIndex}에 있습니다.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
