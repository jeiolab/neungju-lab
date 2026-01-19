import React, { useState, useEffect } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, Play, Check, AlertCircle } from 'lucide-react';
import { SCENARIOS, PROCESS_STAGES } from '../constants';
import { Scenario, ScenarioBlock } from '../types';

interface SimulationTabProps {
  onComplete: (chapter: string) => void;
  progress: any;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onComplete, progress }) => {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [items, setItems] = useState<ScenarioBlock[]>([]);
  const [status, setStatus] = useState<'playing' | 'success' | 'fail'>('playing');

  const scenario = SCENARIOS[activeScenarioIdx];

  useEffect(() => {
    shuffleItems();
  }, [scenario]);

  const shuffleItems = () => {
    const shuffled = [...scenario.blocks].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setStatus('playing');
  };

  const handleCheck = () => {
    let correct = true;
    for (let i = 0; i < items.length; i++) {
      if (items[i].stage !== scenario.correctOrder[i]) {
        correct = false;
        break;
      }
    }

    if (correct) {
      setStatus('success');
      onComplete(scenario.chapter);
    } else {
      setStatus('fail');
    }
  };

  const nextLevel = () => {
    if (activeScenarioIdx < SCENARIOS.length - 1) {
      setActiveScenarioIdx(prev => prev + 1);
    }
  };

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 pb-8">
      
      {/* Left Panel: Context & Instructions */}
      <div className="lg:col-span-4 flex flex-col gap-6 order-1 lg:order-1">
        <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <div className="flex items-center justify-between mb-4">
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                {scenario.chapter} Chapter
                </span>
                <div className="flex gap-2">
                    {SCENARIOS.map((s, idx) => (
                        <div key={s.id} className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === activeScenarioIdx ? 'bg-blue-500 scale-110' : 'bg-slate-200'}`} />
                    ))}
                </div>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">{scenario.title}</h2>
            <p className="text-slate-600 leading-relaxed mb-8">{scenario.description}</p>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Play size={16} className="text-blue-500" />
                    미션 목표
                </h3>
                <p className="text-sm text-slate-500">
                    오른쪽의 카드들을 논리적인 순서(입력 → 처리 → 출력)에 맞게 드래그하여 재배치하세요.
                </p>
            </div>
        </div>

        {/* Desktop Controls (Left Side) */}
        <div className="hidden lg:block space-y-4">
             <AnimatePresence mode="wait">
                {status === 'playing' ? (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCheck}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-3 text-lg transition-transform hover:scale-[1.02] active:scale-95"
                    >
                        <CheckCircle2 size={24} />
                        시스템 가동 (Run)
                    </motion.button>
                ) : status === 'success' ? (
                     <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-600 text-white p-6 rounded-2xl shadow-xl shadow-green-200 text-center"
                    >
                        <div className="font-bold text-2xl mb-2 flex items-center justify-center gap-2">
                            <CheckCircle2 size={28} /> 성공!
                        </div>
                        <p className="text-green-100 mb-6">모든 단계가 논리적으로 완벽합니다.</p>
                        {activeScenarioIdx < SCENARIOS.length - 1 ? (
                            <button 
                                onClick={nextLevel}
                                className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-50 w-full shadow-sm transition-colors"
                            >
                                다음 시나리오로 이동
                            </button>
                        ) : (
                            <div className="bg-white/20 py-3 rounded-xl font-medium">
                                모든 챕터 완료! 🎉
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setStatus('playing')}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-red-200 flex items-center justify-center gap-3 text-lg transition-transform hover:scale-[1.02]"
                    >
                        <RotateCcw size={24} />
                        다시 시도하기
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Right Panel: Puzzle Area */}
      <div className="lg:col-span-8 order-2 lg:order-2">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider text-sm">Logic Sequence</h3>
            <button onClick={shuffleItems} className="text-sm text-slate-400 flex items-center gap-1.5 hover:text-blue-500 transition-colors px-3 py-1 rounded-full hover:bg-blue-50">
                <RotateCcw size={14} /> 초기화
            </button>
        </div>

        <Reorder.Group 
            axis="y" 
            values={items} 
            onReorder={setItems} 
            className="space-y-3"
        >
          {items.map((item, index) => {
            const stageDef = PROCESS_STAGES.find(s => s.id === item.stage);
            const isCorrectPosition = status === 'success' || (status === 'fail' && item.stage === scenario.correctOrder[index]);
            
            return (
              <Reorder.Item key={item.id} value={item} className="relative group">
                <div 
                    className={`
                        p-5 lg:p-6 rounded-2xl shadow-sm border-2 cursor-grab active:cursor-grabbing select-none transition-all duration-300
                        flex items-center gap-5 bg-white relative overflow-hidden
                        ${status === 'success' ? 'border-green-400 bg-green-50/50' : ''}
                        ${status === 'fail' && !isCorrectPosition ? 'border-red-200 bg-red-50/50' : 'border-white hover:border-blue-300 hover:shadow-md'}
                    `}
                >
                     {/* Stage Indicator Bar (Left) */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stageDef?.color.split(' ')[0].replace('bg-', 'bg-') || 'bg-slate-200'}`} />

                    <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg
                        ${stageDef?.color || 'bg-slate-100 text-slate-500'}
                    `}>
                        {index + 1}
                    </div>
                    
                    <div className="flex-1">
                        <p className="font-bold text-slate-800 text-lg">{item.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                            {status !== 'playing' && (
                                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${stageDef?.color}`}>
                                    {stageDef?.label}
                                </span>
                            )}
                            {status === 'fail' && !isCorrectPosition && (
                                <span className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} /> 위치 오류
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="text-slate-300 group-hover:text-blue-400 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM18 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM18 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM18 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                        </svg>
                    </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>

      {/* Mobile Controls (Sticky Bottom) - Hidden on Desktop */}
      <div className="lg:hidden sticky bottom-0 z-20 mt-4">
        <AnimatePresence mode="wait">
            {status === 'playing' ? (
                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={handleCheck}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-lg"
                >
                    <CheckCircle2 /> 작동 확인
                </motion.button>
            ) : status === 'success' ? (
                <motion.div className="bg-green-600 text-white p-4 rounded-2xl shadow-lg text-center">
                    <p className="font-bold text-lg mb-2">성공!</p>
                    <button onClick={nextLevel} className="bg-white text-green-700 px-6 py-2 rounded-full font-bold w-full">다음</button>
                </motion.div>
            ) : (
                <motion.button
                    onClick={() => setStatus('playing')}
                    className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                    <RotateCcw /> 다시 시도
                </motion.button>
            )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default SimulationTab;