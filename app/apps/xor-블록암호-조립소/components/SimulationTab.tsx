import React, { useState, useEffect } from 'react';
import { PUZZLE_STEPS, CORRECT_ORDER } from '../constants';
import { runEncryptionSimulation } from '../utils';
import { Button } from './ui/Button';
import { PuzzleStep } from '../types';
import { 
  ArrowRight, 
  RotateCcw, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Maximize,
  Scissors,
  Binary,
  Hash,
  Key,
  X,
  Link,
  Trash2
} from 'lucide-react';

const Icons: Record<string, React.FC<any>> = {
  Maximize, Scissors, Binary, Hash, Key, X, Link
};

interface SimulationTabProps {
  onComplete: (score: number) => void;
  isCompleted: boolean;
}

export const SimulationTab: React.FC<SimulationTabProps> = ({ onComplete, isCompleted }) => {
  const [line, setLine] = useState<PuzzleStep[]>([]);
  const [availableSteps, setAvailableSteps] = useState<PuzzleStep[]>(PUZZLE_STEPS);
  const [plaintext, setPlaintext] = useState<string>("LOVE");
  const [cipherKey, setCipherKey] = useState<string>("XF");
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  const addToLine = (step: PuzzleStep) => {
    if (line.find(s => s.id === step.id)) return; // Prevent duplicates if logic requires unique steps
    setLine([...line, step]);
    setAvailableSteps(availableSteps.filter(s => s.id !== step.id));
    setMessage(null);
    setSimulationResult(null);
  };

  const removeFromLine = (stepId: string) => {
    const step = PUZZLE_STEPS.find(s => s.id === stepId);
    if (step) {
      setAvailableSteps([...availableSteps, step]);
      setLine(line.filter(s => s.id !== stepId));
      setSimulationResult(null);
    }
  };

  const useHint = () => {
    if (line.length >= CORRECT_ORDER.length) return;
    
    const nextCorrectStepId = CORRECT_ORDER[line.length];
    const nextStep = availableSteps.find(s => s.id === nextCorrectStepId);
    
    if (nextStep) {
      addToLine(nextStep);
      setHintsUsed(h => h + 1);
      setMessage({ type: 'info', text: '힌트를 사용하여 올바른 단계를 추가했습니다.' });
    } else {
       // Should not happen if logic is correct, but handled for safety
       // If the step is already in line but in wrong place, user needs to reset or we auto-fix.
       // For simplicity, hint only works if the available pool has the next correct item.
       setMessage({ type: 'error', text: '현재 배치된 순서가 틀렸습니다. 다시 시도해보세요.' });
    }
  };

  const runMachine = () => {
    setIsRunning(true);
    setMessage(null);

    // Simulation delay for effect
    setTimeout(() => {
      const currentOrderIds = line.map(s => s.id);
      const isCorrect = JSON.stringify(currentOrderIds) === JSON.stringify(CORRECT_ORDER);

      if (isCorrect) {
        const result = runEncryptionSimulation(plaintext, cipherKey);
        setSimulationResult(result);
        const baseScore = 100;
        const penalty = hintsUsed * 15;
        const finalScore = Math.max(0, baseScore - penalty);
        setMessage({ type: 'success', text: `공정 성공! 암호화 완료. 점수: ${finalScore}` });
        if (!isCompleted) onComplete(finalScore);
      } else {
        setMessage({ type: 'error', text: '공정 순서 오류! 기계가 멈췄습니다. 순서를 다시 확인하세요.' });
      }
      setIsRunning(false);
    }, 800);
  };

  const resetLine = () => {
    setLine([]);
    setAvailableSteps(PUZZLE_STEPS);
    setSimulationResult(null);
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-wrap gap-4 justify-between items-center shadow-lg">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">평문 (Plaintext)</label>
            <select 
              value={plaintext} 
              onChange={(e) => { setPlaintext(e.target.value); setSimulationResult(null); }}
              className="bg-slate-900 border border-slate-600 text-cyan-400 rounded px-3 py-1 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="LOVE">LOVE (4글자)</option>
              <option value="CODE">CODE (4글자)</option>
              <option value="HELLO">HELLO (5글자 - 패딩 필요)</option>
              <option value="ABC">ABC (3글자 - 패딩 필요)</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">키 (Key)</label>
            <select 
              value={cipherKey} 
              onChange={(e) => { setCipherKey(e.target.value); setSimulationResult(null); }}
              className="bg-slate-900 border border-slate-600 text-yellow-400 rounded px-3 py-1 text-sm focus:outline-none focus:border-yellow-500"
            >
              <option value="XF">XF</option>
              <option value="KEY">KEY</option>
              <option value="AB">AB</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
           <Button variant="ghost" onClick={useHint} disabled={isRunning || line.length === CORRECT_ORDER.length} title="점수 차감">
            <Lightbulb className="w-4 h-4 mr-2" /> 힌트
          </Button>
          <Button variant="secondary" onClick={resetLine} disabled={isRunning}>
            <RotateCcw className="w-4 h-4 mr-2" /> 초기화
          </Button>
          <Button onClick={runMachine} disabled={isRunning || line.length === 0} className={isRunning ? 'opacity-50' : ''}>
            {isRunning ? '가동 중...' : (
              <>
                <Play className="w-4 h-4 mr-2 fill-current" /> 공정 시작
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Assembly Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Available Parts (Inventory) */}
        <div className="lg:col-span-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></div>
            부품 창고
          </h3>
          <div className="flex flex-col gap-2">
            {availableSteps.length === 0 && <p className="text-slate-500 text-sm text-center py-4">모든 부품 사용됨</p>}
            {availableSteps.map((step) => {
               const Icon = Icons[step.iconName];
               return (
                <button
                  key={step.id}
                  onClick={() => addToLine(step)}
                  className="group flex items-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-all text-left shadow-sm hover:translate-x-1"
                >
                  <div className="p-2 bg-slate-800 rounded mr-3 text-cyan-400 group-hover:text-cyan-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-200">{step.label}</div>
                    <div className="text-xs text-slate-400">{step.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conveyor Belt */}
        <div className="lg:col-span-9 space-y-4">
          <div className="bg-slate-900 p-6 rounded-xl border-2 border-dashed border-slate-700 min-h-[200px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/20 via-cyan-500/50 to-cyan-500/20"></div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">조립 라인 (클릭하여 제거)</h3>
            
            {line.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                <p>부품 창고에서 단계를 클릭하여 추가하세요</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 items-center justify-center">
              {line.map((step, index) => {
                 const Icon = Icons[step.iconName];
                 return (
                  <div key={`${step.id}-${index}`} className="flex items-center">
                    <button
                      onClick={() => removeFromLine(step.id)}
                      className="relative group w-32 bg-slate-800 hover:bg-red-900/20 border border-cyan-900 hover:border-red-500/50 rounded-lg p-3 flex flex-col items-center gap-2 transition-all shadow-lg hover:scale-105"
                    >
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400">
                        <Trash2 size={12} />
                      </div>
                      <div className="p-2 bg-slate-900 rounded-full text-cyan-400">
                        <Icon size={20} />
                      </div>
                      <span className="text-xs font-bold text-center text-slate-200 leading-tight">{step.label}</span>
                      <span className="absolute -top-3 -left-2 w-6 h-6 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-xs font-mono text-slate-500">
                        {index + 1}
                      </span>
                    </button>
                    {index < line.length - 1 && (
                      <ArrowRight className="text-slate-600 mx-2 animate-pulse" size={20} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`p-4 rounded-lg border flex items-center ${
              message.type === 'success' ? 'bg-green-900/20 border-green-800 text-green-400' :
              message.type === 'error' ? 'bg-red-900/20 border-red-800 text-red-400' :
              'bg-blue-900/20 border-blue-800 text-blue-400'
            }`}>
              {message.type === 'success' ? <CheckCircle className="mr-2" /> : 
               message.type === 'error' ? <AlertTriangle className="mr-2" /> : 
               <Lightbulb className="mr-2" />}
              {message.text}
            </div>
          )}

          {/* Simulation Output Panel */}
          {simulationResult && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-cyan-400 flex items-center">
                  <Binary className="mr-2 w-4 h-4" /> 처리 로그
                </h3>
                <span className="text-xs text-slate-500 font-mono">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </div>
              <div className="p-4 space-y-2 max-h-80 overflow-y-auto font-mono text-sm">
                {simulationResult.stepsLog.map((log: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-slate-700 pl-3 py-1 hover:border-cyan-500 hover:bg-slate-700/30 transition-colors">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>STEP {idx + 1}: {log.step}</span>
                    </div>
                    {log.detail && <div className="text-slate-300 mb-1">{log.detail}</div>}
                    {log.step === 'PROCESS_BLOCK' && (
                      <div className="bg-slate-900 p-2 rounded text-xs grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                         <div className="text-slate-400">Plain: <span className="text-white">{log.plain}</span></div>
                         <div className="text-slate-400">Key Bits: <span className="text-yellow-500">{log.keyBinary[0]}...</span></div>
                         <div className="text-slate-400">ASCII: <span className="text-cyan-300">{log.ascii.join(' ')}</span></div>
                         <div className="text-slate-400">XOR Result: <span className="text-green-400">{log.xorBinary.join(' ')}</span></div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-4 pt-3 border-t border-slate-700">
                  <div className="text-slate-400 text-xs uppercase mb-1">최종 암호문 (Hex)</div>
                  <div className="text-xl font-bold text-green-400 tracking-wider break-all">
                    {simulationResult.finalCipher}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};