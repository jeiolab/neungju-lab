import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_TASKS } from '../../constants';
import { Task, GameState } from '../../types';
import { Button } from '../Button';
import { Play, RotateCcw, ArrowUp, ArrowDown, Zap, Clock, User, Battery, Smile, AlertCircle } from 'lucide-react';
import { getSimulationFeedback } from '../../services/geminiService';

export const TabSimulation: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [simulationResult, setSimulationResult] = useState<{
    finished: boolean;
    totalTime: number;
    success: boolean;
    stats: GameState['currentStats'];
    feedback?: string;
  } | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Helper to move tasks
  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...tasks];
    if (direction === 'up' && index > 0) {
      [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
    } else if (direction === 'down' && index < newTasks.length - 1) {
      [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
    }
    // Reset parallel flags when reordering to avoid logic errors
    const cleanedTasks = newTasks.map(t => ({...t, isParallel: false}));
    setTasks(cleanedTasks);
  };

  // Helper to change duration
  const updateDuration = (id: string, newDuration: number) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, currentDuration: newDuration } : t
    ));
  };

  // Helper to toggle parallel
  const toggleParallel = (index: number) => {
    if (index === 0) return; // First task can't be parallel
    setTasks(prev => prev.map((t, i) => 
      i === index ? { ...t, isParallel: !t.isParallel } : t
    ));
  };

  // Calculate projected finish time
  const projection = useMemo(() => {
    let totalMinutes = 0;
    let currentBlockMax = 0;

    tasks.forEach((task, idx) => {
      if (task.isParallel && idx > 0) {
        // If parallel, it runs WITH the previous one. 
        // We take the max of (previous duration, current duration)
        // But since we add linearly, we need to subtract the previous task's contribution 
        // and add the max of both.
        // Simplified Logic: 
        // Standard accumulation: Total += Duration
        // Parallel accumulation: Total = Total - PrevDuration + Max(PrevDuration, CurrDuration)
        
        const prevTask = tasks[idx-1];
        // Note: This simple logic assumes only pairwise parallelism for the UI simplicity
        const parallelTime = Math.max(prevTask.currentDuration, task.currentDuration);
        totalMinutes = (totalMinutes - prevTask.currentDuration) + parallelTime;
      } else {
        totalMinutes += task.currentDuration;
      }
    });

    const startTime = new Date();
    startTime.setHours(7, 30, 0);
    const endTime = new Date(startTime.getTime() + totalMinutes * 60000);
    
    return {
      totalMinutes,
      endTimeStr: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLate: totalMinutes > 60 // 7:30 to 8:30 is 60 mins
    };
  }, [tasks]);

  const runSimulation = () => {
    // Calculate final stats based on tradeoffs
    let hygiene = 50;
    let fullness = 50;
    let energy = 100;
    
    tasks.forEach(task => {
      // Logic: Faster than base = Stress up, Quality down
      // Slower than base = Quality up, Fatigue down (rested)
      const ratio = task.currentDuration / task.baseDuration;
      
      if (task.type === 'HYGIENE') {
        hygiene += (task.qualityImpact * 10) * ratio;
      } else if (task.type === 'FOOD') {
        fullness += (task.qualityImpact * 10) * ratio;
      }

      // Energy calculation
      // Rushing (ratio < 1) drains energy. Taking time (ratio > 1) preserves it.
      // Parallelism drains extra energy due to multitasking stress
      let fatigueHit = task.fatigueImpact; 
      if (ratio < 0.5) fatigueHit += 20; // Heavy penalty for rushing
      
      if (task.isParallel) {
        energy -= 15; // Multitasking penalty
      }
      energy -= fatigueHit; 
    });

    // Clamp stats
    hygiene = Math.min(100, Math.max(0, hygiene));
    fullness = Math.min(100, Math.max(0, fullness));
    energy = Math.min(100, Math.max(0, energy));

    setSimulationResult({
      finished: true,
      totalTime: projection.totalMinutes,
      success: !projection.isLate,
      stats: { hygiene, fullness, energy, stress: 100 - energy },
    });
  };

  const handleAIAnalysis = async () => {
    if (!simulationResult) return;
    setIsAnalyzing(true);
    const feedback = await getSimulationFeedback(tasks, simulationResult.totalTime, simulationResult.success);
    setSimulationResult(prev => prev ? { ...prev, feedback } : null);
    setIsAnalyzing(false);
  };

  return (
    <div className="pb-24">
      {/* HUD - Heads Up Display */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${projection.isLate ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
            <span className={`text-xl font-black ${projection.isLate ? 'text-red-600' : 'text-gray-900'}`}>
              {projection.endTimeStr}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              (등교 08:30)
            </span>
          </div>
          <div className="text-right">
            <span className={`text-sm font-bold ${projection.isLate ? 'text-red-500' : 'text-green-600'}`}>
              {projection.isLate ? `+${projection.totalMinutes - 60}분 초과` : `${60 - projection.totalMinutes}분 여유`}
            </span>
          </div>
        </div>
        
        {/* Mini Goal Tracker */}
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${projection.isLate ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min((projection.totalMinutes / 60) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative overflow-hidden">
            {/* Connection Line for Parallel */}
            {task.isParallel && (
              <div className="absolute top-0 left-8 w-1 h-4 bg-amber-400 z-0"></div>
            )}
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${task.type === 'HYGIENE' ? 'bg-blue-100 text-blue-600' : ''}
                    ${task.type === 'FOOD' ? 'bg-green-100 text-green-600' : ''}
                    ${task.type === 'PREP' ? 'bg-purple-100 text-purple-600' : ''}
                    ${task.type === 'TRANSIT' ? 'bg-orange-100 text-orange-600' : ''}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{task.name}</h3>
                    <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                       {task.type === 'TRANSIT' ? (
                         <span className="text-orange-500 font-medium">🚌 버스 놓치면 지각확률 UP</span>
                       ) : (
                         <span>권장: {task.baseDuration}분</span>
                       )}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-1">
                  <button onClick={() => moveTask(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveTask(index, 'down')} disabled={index === tasks.length - 1} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sliders and Parallel Toggle */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">대충하기 (빠름)</span>
                    <span className="font-bold text-blue-600">{task.currentDuration}분</span>
                    <span className="text-gray-500">꼼꼼히 (느림)</span>
                  </div>
                  <input
                    type="range"
                    min={task.minDuration}
                    max={task.baseDuration + 10}
                    value={task.currentDuration}
                    onChange={(e) => updateDuration(task.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Parallel Checkbox - Only show if not first task */}
                {index > 0 && task.canParallel && (
                  <label className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg cursor-pointer border border-amber-100 hover:bg-amber-100 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={task.isParallel}
                      onChange={() => toggleParallel(index)}
                      className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                    />
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-800">
                      이전 단계와 동시에 진행 (멀티태스킹)
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="h-4"></div> {/* Spacer */}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-0 right-0 px-4 flex justify-center z-20">
        <Button 
          onClick={runSimulation}
          size="lg"
          className="w-full max-w-sm shadow-xl shadow-blue-500/40 animate-bounce-subtle"
        >
          <Play className="w-5 h-5 mr-2" />
          등교 시작하기!
        </Button>
      </div>

      {/* Result Modal */}
      {simulationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${simulationResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {simulationResult.success ? <Smile className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                {simulationResult.success ? '지각 면제!' : '지각 확정...'}
              </h2>
              <p className="text-gray-500 mt-1">
                총 {simulationResult.totalTime}분 소요 (목표: 60분)
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <div className="text-xs text-gray-500 mb-1">청결도</div>
                <div className="font-bold text-lg text-blue-600">{Math.round(simulationResult.stats.hygiene)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <div className="text-xs text-gray-500 mb-1">포만감</div>
                <div className="font-bold text-lg text-green-600">{Math.round(simulationResult.stats.fullness)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <div className="text-xs text-gray-500 mb-1">체력</div>
                <div className="font-bold text-lg text-amber-600">{Math.round(simulationResult.stats.energy)}</div>
              </div>
            </div>

            {/* AI Feedback Section */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> AI 코치의 조언
              </h3>
              {simulationResult.feedback ? (
                <p className="text-sm text-indigo-800 leading-relaxed whitespace-pre-line">
                  {simulationResult.feedback}
                </p>
              ) : (
                <div className="text-center py-2">
                   <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleAIAnalysis}
                    isLoading={isAnalyzing}
                    className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-100"
                  >
                    내 전략 분석받기
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setSimulationResult(null)} 
                className="flex-1"
              >
                결과 닫기
              </Button>
              <Button 
                onClick={() => {
                   setTasks(INITIAL_TASKS);
                   setSimulationResult(null);
                }} 
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                다시하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};