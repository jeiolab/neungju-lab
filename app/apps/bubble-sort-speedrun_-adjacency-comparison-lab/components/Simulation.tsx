import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, FastForward, RotateCcw, CheckCircle, ArrowRight } from 'lucide-react';
import { Student, GameState, SimulationStats, FeedbackData } from '../types';

interface SimulationProps {
  onComplete: (stats: SimulationStats) => void;
}

const Simulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [arraySize, setArraySize] = useState<number>(6);
  const [speed, setSpeed] = useState<'SLOW' | 'NORMAL' | 'FAST'>('NORMAL');
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  
  // Algorithm State
  const [i, setI] = useState(0); // Outer loop index
  const [j, setJ] = useState(0); // Inner loop index
  const [stats, setStats] = useState<SimulationStats>({ comparisons: 0, swaps: 0, startTime: null, endTime: null });
  const [feedback, setFeedback] = useState<FeedbackData>({
    meaning: "시작 버튼을 눌러 정렬을 시작하세요.",
    impact: "아직 비교가 수행되지 않았습니다.",
    next: "첫 번째 비교 대상을 기다리는 중입니다."
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize
  const generateStudents = useCallback(() => {
    const newStudents: Student[] = Array.from({ length: arraySize }, (_, idx) => ({
      id: `student-${Date.now()}-${idx}`,
      height: Math.floor(Math.random() * 50) + 150 // 150cm ~ 199cm
    }));
    setStudents(newStudents);
    resetAlgorithm();
  }, [arraySize]);

  const resetAlgorithm = () => {
    setI(0);
    setJ(0);
    setGameState(GameState.IDLE);
    setStats({ comparisons: 0, swaps: 0, startTime: null, endTime: null });
    setFeedback({
      meaning: "새로운 사진 촬영 대열이 준비되었습니다.",
      impact: "키 순서대로 정렬을 시작해봅시다.",
      next: "맨 왼쪽 두 학생부터 비교를 시작합니다."
    });
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    generateStudents();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [generateStudents]);

  // Core Bubble Sort Step Logic
  const step = useCallback(() => {
    setStudents(currentStudents => {
      const arr = [...currentStudents];
      const n = arr.length;
      
      // Check completion
      if (i >= n - 1) {
        setGameState(GameState.COMPLETED);
        if (timerRef.current) clearInterval(timerRef.current);
        const finalStats = { ...stats, endTime: Date.now() };
        setStats(finalStats);
        onComplete(finalStats);
        setFeedback({
            meaning: "모든 비교가 완료되었습니다!",
            impact: "모든 학생이 키 순서대로 섰습니다.",
            next: "정렬 종료. 수고하셨습니다!"
        });
        return arr;
      }

      // Logic for current step
      const studentA = arr[j];
      const studentB = arr[j + 1];
      let swapped = false;
      let impactMsg = "순서가 맞아 그대로 둡니다.";

      setStats(prev => ({ ...prev, comparisons: prev.comparisons + 1, startTime: prev.startTime || Date.now() }));

      if (studentA.height > studentB.height) {
        // Swap
        arr[j] = studentB;
        arr[j + 1] = studentA;
        swapped = true;
        setStats(prev => ({ ...prev, swaps: prev.swaps + 1 }));
        impactMsg = `키 큰 학생(${studentA.height}cm)을 오른쪽으로 보냈습니다.`;
      }

      // Generate Feedback
      setFeedback({
        meaning: `${j+1}번째와 ${j+2}번째 학생의 키 비교: ${studentA.height}cm vs ${studentB.height}cm`,
        impact: impactMsg,
        next: `${n - 1 - i}번째 자리에 가장 큰 학생이 확정될 예정입니다.`
      });

      // Advance Pointers
      let nextJ = j + 1;
      let nextI = i;

      if (nextJ >= n - 1 - i) {
        nextJ = 0;
        nextI = i + 1;
      }

      setJ(nextJ);
      setI(nextI);

      return arr;
    });
  }, [i, j, stats, onComplete]);

  // Auto-run effect
  useEffect(() => {
    if (gameState === GameState.RUNNING) {
      const delay = speed === 'FAST' ? 200 : speed === 'NORMAL' ? 800 : 1500;
      timerRef.current = setInterval(step, delay);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, speed, step]);

  // Controls
  const toggleAuto = () => {
    if (gameState === GameState.RUNNING) setGameState(GameState.PAUSED);
    else if (gameState !== GameState.COMPLETED) setGameState(GameState.RUNNING);
  };

  const manualStep = () => {
    setGameState(GameState.PAUSED);
    step();
  };

  const finishPass = () => {
    setGameState(GameState.PAUSED);
    // Simple speed up logic: run steps until i changes
    const currentI = i;
    let loopLimit = 100; // safety break
    const fastForward = setInterval(() => {
        setI(prevI => {
            if (prevI !== currentI || loopLimit-- <= 0) {
                clearInterval(fastForward);
                return prevI;
            }
            step();
            return prevI;
        });
    }, 50);
  };

  // Visualization Helpers
  const isComparing = (idx: number) => (gameState !== GameState.COMPLETED) && (idx === j || idx === j + 1);
  const isSorted = (idx: number) => idx >= students.length - i;

  const totalPossibleComparisons = (arraySize * (arraySize - 1)) / 2;
  const progress = Math.min(100, Math.round((stats.comparisons / totalPossibleComparisons) * 100));

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4">
      {/* Top Bar: Settings & Stats */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-semibold mb-1">인원 수 (N={arraySize})</label>
                <input 
                    type="range" min="5" max="12" value={arraySize} 
                    onChange={(e) => { setArraySize(Number(e.target.value)); }}
                    disabled={gameState === GameState.RUNNING}
                    className="w-32 accent-indigo-600"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-semibold mb-1">속도</label>
                <select 
                    value={speed} 
                    onChange={(e) => setSpeed(e.target.value as any)}
                    className="text-sm border rounded p-1"
                >
                    <option value="SLOW">느림</option>
                    <option value="NORMAL">보통</option>
                    <option value="FAST">빠름</option>
                </select>
            </div>
        </div>
        
        <div className="flex gap-6 text-sm">
            <div className="text-center">
                <div className="text-slate-500 text-xs uppercase">비교 횟수</div>
                <div className="font-bold text-indigo-600 text-lg">{stats.comparisons}</div>
            </div>
            <div className="text-center">
                <div className="text-slate-500 text-xs uppercase">교환 횟수</div>
                <div className="font-bold text-rose-600 text-lg">{stats.swaps}</div>
            </div>
            <div className="text-center">
                <div className="text-slate-500 text-xs uppercase">진행률</div>
                <div className="font-bold text-emerald-600 text-lg">{progress}%</div>
            </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="relative h-64 bg-indigo-50 rounded-xl border border-indigo-100 flex items-end justify-center p-8 gap-2 overflow-hidden">
        {students.map((student, idx) => {
            const comparing = isComparing(idx);
            const sorted = isSorted(idx);
            const heightPx = (student.height - 140) * 4; // Scale height
            
            return (
                <div key={student.id} className="flex flex-col items-center gap-2 transition-all duration-300" style={{ order: idx }}>
                    <div 
                        className={`w-12 sm:w-16 rounded-t-lg flex items-end justify-center pb-2 text-white font-bold text-sm shadow-md transition-colors duration-200
                            ${comparing ? 'bg-yellow-400 scale-105 z-10 ring-4 ring-yellow-200' : 
                              sorted ? 'bg-emerald-500' : 'bg-indigo-500'}
                        `}
                        style={{ height: `${heightPx}px` }}
                    >
                        {student.height}
                    </div>
                    <div className={`text-xs font-bold ${comparing ? 'text-yellow-600' : 'text-slate-400'}`}>
                        {idx + 1}번
                    </div>
                </div>
            );
        })}
      </div>

      {/* 3-Line Feedback Panel */}
      <div className="bg-slate-800 text-white p-4 rounded-xl shadow-lg border-l-4 border-yellow-400">
        <h3 className="text-yellow-400 text-xs font-bold uppercase mb-2 tracking-wider">코치 피드백</h3>
        <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
                <span className="text-slate-400 min-w-[3rem]">현재:</span>
                <span>{feedback.meaning}</span>
            </li>
            <li className="flex gap-2">
                <span className="text-slate-400 min-w-[3rem]">영향:</span>
                <span className="text-indigo-200">{feedback.impact}</span>
            </li>
            <li className="flex gap-2">
                <span className="text-slate-400 min-w-[3rem]">다음:</span>
                <span className="text-emerald-300">{feedback.next}</span>
            </li>
        </ul>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sticky bottom-4 z-20">
        <button 
            onClick={manualStep}
            disabled={gameState === GameState.COMPLETED}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 font-bold py-3 px-4 rounded-lg shadow-sm active:scale-95 transition-all"
        >
            <ArrowRight size={18} /> 다음 비교
        </button>

        <button 
            onClick={toggleAuto}
            disabled={gameState === GameState.COMPLETED}
            className={`flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg shadow-sm active:scale-95 transition-all text-white
                ${gameState === GameState.RUNNING ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
        >
            {gameState === GameState.RUNNING ? <><Pause size={18}/> 일시정지</> : <><Play size={18}/> 자동 실행</>}
        </button>

        <button 
            onClick={finishPass}
            disabled={gameState === GameState.COMPLETED}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3 px-4 rounded-lg shadow-sm active:scale-95 transition-all"
        >
            <FastForward size={18} /> 1회전 완료
        </button>

        <button 
            onClick={generateStudents}
            className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-3 px-4 rounded-lg shadow-sm active:scale-95 transition-all"
        >
            <RotateCcw size={18} /> {gameState === GameState.COMPLETED ? '다시 하기' : '초기화'}
        </button>
      </div>
      
      {gameState === GameState.COMPLETED && (
        <div className="bg-emerald-100 text-emerald-800 p-4 rounded-lg text-center font-bold animate-bounce">
            🎉 정렬 완료! 결과가 기록되었습니다.
        </div>
      )}
    </div>
  );
};

export default Simulation;