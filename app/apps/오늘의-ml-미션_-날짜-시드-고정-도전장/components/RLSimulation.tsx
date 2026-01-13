import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RLSimulation: React.FC = () => {
  const [rewardSize, setRewardSize] = useState<number>(5);
  const [step, setStep] = useState<number>(0);
  const [learningData, setLearningData] = useState<{ step: number; performance: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Simulation logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && step < 20) {
      interval = setInterval(() => {
        setStep(prev => prev + 1);
        
        // Simple mock function for RL performance curve based on reward size
        // Too small reward (<3): slow learning
        // Optimal reward (3-7): fast learning
        // Too large reward (>7): unstable/overfitting (simulated by random drops)
        setLearningData(prev => {
          const currentStep = prev.length + 1;
          let basePerformance = 0;
          
          if (rewardSize < 3) {
            basePerformance = currentStep * 3; // Linear, slow
          } else if (rewardSize <= 7) {
            basePerformance = 100 * (1 - Math.exp(-0.2 * currentStep)); // Logarithmic, fast
          } else {
            // High variance
            const noise = Math.random() * 30 - 15;
            basePerformance = 100 * (1 - Math.exp(-0.3 * currentStep)) + noise;
          }
          
          return [...prev, { step: currentStep, performance: Math.min(100, Math.max(0, basePerformance)) }];
        });
      }, 500);
    } else if (step >= 20) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, step, rewardSize]);

  const handleReset = () => {
    setIsRunning(false);
    setStep(0);
    setLearningData([]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 my-6">
      <h3 className="text-lg font-bold text-slate-800 mb-2">🔭 마이크로 실험실: 보상의 크기</h3>
      <p className="text-sm text-slate-500 mb-4">
        강화학습에서 '보상(Reward)'의 크기가 학습 속도와 안정성에 어떤 영향을 미칠까요? 
        슬라이더를 조절하고 [실험 시작]을 눌러보세요.
      </p>

      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
          <span>보상 크기: {rewardSize}</span>
          <span>{rewardSize < 3 ? "너무 작음 (동기부여 부족)" : rewardSize > 7 ? "너무 큼 (과도한 욕심/불안정)" : "적절함"}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={rewardSize}
          onChange={(e) => {
            setRewardSize(Number(e.target.value));
            handleReset();
          }}
          disabled={isRunning}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>1 (작음)</span>
          <span>10 (큼)</span>
        </div>
      </div>

      <div className="h-48 w-full bg-slate-50 rounded-lg mb-4 border border-slate-100 relative overflow-hidden">
        {learningData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
            데이터가 없습니다. 실험을 시작하세요.
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={learningData}>
            <XAxis dataKey="step" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{fill: 'transparent'}}
            />
            <Bar dataKey="performance" fill="#6366f1" radius={[4, 4, 0, 0]} animationDuration={300} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(true)}
          disabled={isRunning || step >= 20}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-white transition-colors ${
            isRunning || step >= 20 ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          <Play size={18} />
          {isRunning ? '학습 중...' : step >= 20 ? '학습 완료' : '실험 시작'}
        </button>
        <button
          onClick={handleReset}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>
      
      {step >= 20 && (
        <div className="mt-4 p-3 bg-indigo-50 text-indigo-800 text-sm rounded-lg animate-fade-in">
          <strong>결과 분석: </strong>
          {rewardSize < 3 
            ? "보상이 너무 작아 학습 속도가 느립니다. 에이전트가 행동의 가치를 충분히 느끼지 못했습니다."
            : rewardSize > 7
            ? "보상이 너무 커서 초반엔 빨랐지만, 결과가 불안정합니다(오실레이션). 과도한 보상은 최적화 실패를 부를 수 있습니다."
            : "적절한 보상 설정으로 안정적이고 빠른 학습 곡선을 그렸습니다!"}
        </div>
      )}
    </div>
  );
};

export default RLSimulation;