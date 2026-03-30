import React, { useState } from 'react';
import { AgentStep, AgentStepData } from '../types';
import { AGENT_STEPS, SCENARIOS } from '../constants';
import { Eye, Brain, Cpu, Zap, RotateCcw, PlayCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const iconMap: any = { Eye, Brain, Cpu, Zap };

interface Props {
  onSuccess: () => void;
}

const TabPuzzle: React.FC<Props> = ({ onSuccess }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const [currentOrder, setCurrentOrder] = useState<AgentStep[]>([]);
  const [feedback, setFeedback] = useState<{ title: string; content: string; type: 'success' | 'error' | 'neutral' } | null>(null);
  
  // Experiment State
  const [sensorAccuracy, setSensorAccuracy] = useState(80);
  const [dataVolume, setDataVolume] = useState(50);
  const [experimentResult, setExperimentResult] = useState<{errorRate: number; feedback: string[]} | null>(null);

  const currentScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  // Puzzle Logic
  const handleAddToOrder = (stepId: AgentStep) => {
    if (currentOrder.includes(stepId)) return;
    if (currentOrder.length < 4) {
      const newOrder = [...currentOrder, stepId];
      setCurrentOrder(newOrder);
      setFeedback(null);
    }
  };

  const handleReset = () => {
    setCurrentOrder([]);
    setFeedback(null);
  };

  const checkOrder = () => {
    const correct = currentScenario.correctOrder;
    // Simple check: strict equality of arrays
    const isCorrect = currentOrder.length === 4 && currentOrder.every((val, index) => val === correct[index]);

    if (isCorrect) {
      setFeedback({
        title: "완벽한 루프입니다!",
        content: "인식 → 학습 → 추론 → 행동 순서가 맞습니다. 데이터가 흐르는 자연스러운 순서예요.",
        type: 'success'
      });
      onSuccess();
    } else {
      // Diagnostic feedback
      let msg = "순서가 꼬였습니다.";
      if (currentOrder[0] !== 'Perception') {
        msg = "시작은 항상 외부 정보를 받아들이는 '인식'이어야 합니다.";
      } else if (currentOrder[1] === 'Action') {
        msg = "인식하자마자 생각 없이 행동하면 위험합니다. '학습'이나 '추론'이 필요해요.";
      } else if (!currentOrder.includes('Learning')) {
        msg = "학습 과정이 빠졌습니다.";
      } else {
        msg = "논리적 흐름(인식→학습→추론→행동)을 다시 생각해보세요.";
      }
      setFeedback({
        title: "루프 연결 끊김",
        content: msg,
        type: 'error'
      });
    }
  };

  // Experiment Logic
  const runExperiment = () => {
    // Formula: Error % = (100 - SensorAccuracy) * 0.6 + (100 - DataVolume) * 0.4
    // We dampen DataVolume impact slightly
    const errorProb = ((100 - sensorAccuracy) * 0.6) + ((100 - dataVolume) * 0.2); // Simplified
    const actualError = Math.min(100, Math.max(0, Math.round(errorProb)));

    const feedbackLines = [
      `1. 인식: 센서 정확도가 ${sensorAccuracy}%로 ${sensorAccuracy < 70 ? '낮아 위험합니다' : '양호합니다'}.`,
      `2. 추론/행동: 학습 데이터가 ${dataVolume < 30 ? '부족해 판단력이 떨어질 수 있습니다' : '충분하여 패턴을 잘 찾습니다'}.`,
      `3. 보완: ${actualError > 20 ? '인간의 개입이나 예외처리 규칙이 반드시 필요합니다!' : '자율적으로 맡겨도 비교적 안전합니다.'}`
    ];

    setExperimentResult({
      errorRate: actualError,
      feedback: feedbackLines
    });
  };

  const chartData = experimentResult ? [
    { name: '성공 확률', value: 100 - experimentResult.errorRate, color: '#10b981' }, // emerald-500
    { name: '오류 확률', value: experimentResult.errorRate, color: '#ef4444' } // red-500
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      {/* 1. Scenario Selector */}
      <div className="bg-white p-4 shadow-sm border-b sticky top-0 z-10">
        <label className="block text-sm font-bold text-gray-700 mb-2">시나리오 선택</label>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedScenarioId(s.id); handleReset(); }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${selectedScenarioId === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">{currentScenario.description}</p>
      </div>

      <div className="p-4 space-y-8 max-w-2xl mx-auto w-full">
        {/* 2. Puzzle Board */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
            <RotateCcw className="w-5 h-5 mr-2 text-indigo-500" />
            1. 루프 순서 맞추기
          </h3>
          
          {/* Slots */}
          <div className="flex justify-between mb-6 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 min-h-[100px] items-center">
            {currentOrder.map((stepId, idx) => {
              const step = AGENT_STEPS.find(s => s.id === stepId)!;
              const Icon = iconMap[step.icon];
              return (
                <div key={`${stepId}-${idx}`} className="flex items-center">
                   <div className={`w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center rounded-lg shadow-sm text-xs sm:text-sm font-bold border ${step.color} bg-white animate-pop-in`}>
                      <Icon className="w-6 h-6 mb-1" />
                      {step.koreanName.split(' ')[0]}
                   </div>
                   {idx < 3 && <div className="w-4 h-0.5 bg-slate-300 mx-1"></div>}
                </div>
              );
            })}
            {currentOrder.length === 0 && <span className="text-gray-400 text-sm mx-auto">아래 카드를 눌러 순서대로 채우세요</span>}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-4 gap-2 mb-4">
             {AGENT_STEPS.map(step => {
               const Icon = iconMap[step.icon];
               const isDisabled = currentOrder.includes(step.id as AgentStep);
               return (
                 <button
                   key={step.id}
                   disabled={isDisabled}
                   onClick={() => handleAddToOrder(step.id as AgentStep)}
                   className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${isDisabled ? 'opacity-30 cursor-not-allowed bg-gray-50' : 'bg-white hover:bg-indigo-50 border-gray-200 hover:border-indigo-300 shadow-sm'}`}
                 >
                   <Icon className="w-5 h-5 mb-1 text-gray-600" />
                   <span className="text-xs font-medium text-gray-700">{step.koreanName.split(' ')[0]}</span>
                 </button>
               )
             })}
          </div>

          <div className="flex space-x-2">
            <button onClick={handleReset} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50">
              초기화
            </button>
            <button onClick={checkOrder} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md">
              결과 확인
            </button>
          </div>

          {feedback && (
             <div className={`mt-4 p-4 rounded-xl text-sm border ${feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
               <strong className="block mb-1 text-base">{feedback.title}</strong>
               {feedback.content}
             </div>
          )}
        </section>

        <hr className="border-slate-200" />

        {/* 3. Micro Experiment */}
        <section>
           <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
             <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
             2. 성능 실험실
           </h3>
           <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
             <div className="space-y-6 mb-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">센서 정확도</label>
                    <span className="text-sm text-blue-600 font-mono">{sensorAccuracy}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={sensorAccuracy} onChange={(e) => setSensorAccuracy(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">인식 단계에 영향을 줍니다.</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">학습 데이터 양</label>
                    <span className="text-sm text-purple-600 font-mono">{dataVolume}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={dataVolume} onChange={(e) => setDataVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">추론 품질에 영향을 줍니다.</p>
                </div>
             </div>

             <button onClick={runExperiment} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 flex items-center justify-center">
               <PlayCircle className="w-5 h-5 mr-2" /> 실험 실행
             </button>

             {experimentResult && (
               <div className="mt-6 animate-fade-in">
                  <div className="h-40 w-full mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                           {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-2 border border-slate-200">
                    <p className="font-bold text-slate-800 border-b pb-2 mb-2">AI 코치 피드백</p>
                    {experimentResult.feedback.map((line, i) => (
                      <p key={i} className="text-slate-700">{line}</p>
                    ))}
                  </div>
               </div>
             )}
           </div>
        </section>
      </div>
    </div>
  );
};

export default TabPuzzle;
