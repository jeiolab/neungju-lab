import React, { useState, useEffect } from 'react';
import { ML_STEPS, SCENARIOS, getIconComponent } from '../constants';
import { MLStep, MLStepType, AlgorithmType, AssemblyStatus, Scenario } from '../types';
import { analyzeFailure } from '../services/geminiService';
import { Play, RotateCcw, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const AssemblyTab: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [pipeline, setPipeline] = useState<(MLStep | null)[]>([null, null, null, null, null]);
  const [availableSteps, setAvailableSteps] = useState<MLStep[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType | null>(null);
  const [status, setStatus] = useState<AssemblyStatus>('IDLE');
  const [feedback, setFeedback] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize randomized steps
  useEffect(() => {
    resetGame();
  }, [activeScenario]);

  const resetGame = () => {
    // Shuffle steps for the supply bin
    const shuffled = [...ML_STEPS].sort(() => Math.random() - 0.5);
    setAvailableSteps(shuffled);
    setPipeline([null, null, null, null, null]);
    setSelectedAlgo(null);
    setStatus('IDLE');
    setFeedback("");
    setShowConfetti(false);
  };

  const addToPipeline = (step: MLStep) => {
    if (status === 'RUNNING' || status === 'SUCCESS') return;
    
    // Find first empty slot
    const firstEmptyIndex = pipeline.findIndex(s => s === null);
    if (firstEmptyIndex !== -1) {
      const newPipeline = [...pipeline];
      newPipeline[firstEmptyIndex] = step;
      setPipeline(newPipeline);
      setAvailableSteps(prev => prev.filter(s => s.id !== step.id));
    }
  };

  const removeFromPipeline = (index: number) => {
    if (status === 'RUNNING' || status === 'SUCCESS') return;

    const stepToRemove = pipeline[index];
    if (stepToRemove) {
      const newPipeline = [...pipeline];
      newPipeline[index] = null;
      setPipeline(newPipeline);
      setAvailableSteps(prev => [...prev, stepToRemove]);
    }
  };

  const runProduction = async () => {
    setStatus('RUNNING');
    setFeedback("공정 가동 중... 파이프라인 검사 중...");

    // 1. Check if full
    if (pipeline.some(p => p === null)) {
      setStatus('ERROR');
      setFeedback("오류: 파이프라인이 완성되지 않았습니다. 모든 단계를 연결하세요.");
      return;
    }

    // 2. Extract types
    const currentSequence = pipeline.map(p => p!.type);
    const correctSequence = [
      MLStepType.PROBLEM_DEFINITION,
      MLStepType.DATA_COLLECTION,
      MLStepType.PREPROCESSING,
      MLStepType.MODEL_TRAINING,
      MLStepType.EVALUATION
    ];

    // 3. Check Order
    let isOrderCorrect = true;
    for (let i = 0; i < 5; i++) {
      if (currentSequence[i] !== correctSequence[i]) {
        isOrderCorrect = false;
        break;
      }
    }

    // 4. Check Algorithm
    const isAlgoCorrect = selectedAlgo === activeScenario.correctAlgorithm;

    if (isOrderCorrect && isAlgoCorrect) {
      setTimeout(() => {
        setStatus('SUCCESS');
        setFeedback("공정 성공! 완벽한 모델이 생산되었습니다. 자격증 포인트 +100");
        setShowConfetti(true);
      }, 1500);
    } else {
      // Use Gemini or fallback for detailed error
      const aiMsg = await analyzeFailure(
        activeScenario.title,
        currentSequence,
        selectedAlgo,
        activeScenario.correctAlgorithm
      );
      setStatus('ERROR');
      setFeedback(aiMsg);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Scenario Header */}
      <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-factory-800 flex items-center gap-2">
            <span className="text-sm bg-factory-200 px-2 py-1 rounded text-factory-600">의뢰서</span>
            {activeScenario.title}
          </h2>
          <p className="text-factory-500 text-sm mt-1">{activeScenario.description}</p>
        </div>
        <div className="flex gap-2">
           {SCENARIOS.map(s => (
             <button
              key={s.id}
              onClick={() => setActiveScenario(s)}
              className={`px-3 py-1 text-xs rounded border ${activeScenario.id === s.id ? 'bg-factory-800 text-white' : 'bg-white text-factory-600'}`}
             >
               {s.id === 'rain-pred' ? '🌧️ 비 예측' : '🚗 탄소 예측'}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Left: Supply Bin */}
        <div className="lg:w-1/4 bg-slate-200 rounded-lg p-4 flex flex-col shadow-inner overflow-y-auto">
          <h3 className="font-bold text-slate-600 mb-3 flex items-center gap-2">
             부품 창고 (Click to Add)
          </h3>
          <div className="space-y-3">
            {availableSteps.map(step => (
              <button
                key={step.id}
                onClick={() => addToPipeline(step)}
                disabled={status === 'RUNNING' || status === 'SUCCESS'}
                className="w-full bg-white p-3 rounded shadow hover:bg-blue-50 transition-all text-left flex items-center gap-3 border border-slate-300 hover:border-blue-400"
              >
                <div className="text-factory-600">{getIconComponent(step.iconName, "w-5 h-5")}</div>
                <span className="font-medium text-sm text-slate-700">{step.label}</span>
              </button>
            ))}
            {availableSteps.length === 0 && (
              <div className="text-center text-slate-400 text-sm py-10 italic">
                모든 부품이 라인에 올라갔습니다.
              </div>
            )}
          </div>
        </div>

        {/* Center: Assembly Line */}
        <div className="flex-1 bg-white rounded-lg p-6 shadow flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400 striped-bg opacity-50"></div>
          
          <h3 className="text-center font-bold text-xl text-factory-800 mb-6">MAIN ASSEMBLY LINE</h3>
          
          <div className="flex-1 flex flex-col justify-center items-center space-y-4">
             {/* The Conveyor Slots */}
             <div className="flex flex-col md:flex-row gap-2 w-full justify-center items-center">
                {pipeline.map((step, index) => (
                  <React.Fragment key={index}>
                    <div 
                      className={`relative w-full md:w-32 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-2 transition-all cursor-pointer
                        ${step ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-slate-50 border-slate-300'}
                        ${status === 'ERROR' && step ? 'bg-red-50 border-red-400' : ''}
                        ${status === 'SUCCESS' && step ? 'bg-green-50 border-green-500' : ''}
                      `}
                      onClick={() => removeFromPipeline(index)}
                    >
                      {step ? (
                        <>
                          <div className="text-factory-700 mb-1">{getIconComponent(step.iconName, "w-6 h-6")}</div>
                          <span className="text-xs text-center font-bold text-slate-700 break-words w-full">{step.label}</span>
                          <span className="absolute -top-2 -right-2 bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">x</span>
                        </>
                      ) : (
                        <span className="text-slate-300 text-2xl font-black">{index + 1}</span>
                      )}
                    </div>
                    {index < 4 && (
                      <ArrowRight className="text-slate-300 hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
             </div>

             {/* Algorithm Selector */}
             <div className="mt-8 bg-slate-100 p-4 rounded-xl border border-slate-200 w-full max-w-lg">
                <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Select Algorithm Core</h4>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedAlgo(AlgorithmType.CLASSIFICATION)}
                    className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all
                      ${selectedAlgo === AlgorithmType.CLASSIFICATION ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'}
                    `}
                  >
                     <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">?</div>
                     <span className="font-bold text-sm">분류 (Classification)</span>
                     <span className="text-[10px]">Yes/No, A/B/C</span>
                  </button>

                  <button 
                    onClick={() => setSelectedAlgo(AlgorithmType.REGRESSION)}
                    className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all
                      ${selectedAlgo === AlgorithmType.REGRESSION ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200'}
                    `}
                  >
                     <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">#</div>
                     <span className="font-bold text-sm">회귀 (Regression)</span>
                     <span className="text-[10px]">수치 예측 (12.5, 99...)</span>
                  </button>
                </div>
             </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-col items-center">
             <div className="flex gap-4">
                <button 
                  onClick={resetGame}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-2 font-medium"
                >
                  <RotateCcw className="w-4 h-4" /> 초기화
                </button>
                <button 
                  onClick={runProduction}
                  disabled={status === 'RUNNING'}
                  className={`px-8 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 text-white transition-transform active:scale-95
                    ${status === 'RUNNING' ? 'bg-slate-400 cursor-wait' : 'bg-factory-800 hover:bg-factory-900'}
                  `}
                >
                  <Play className="w-5 h-5 fill-current" /> 공정 가동 (START)
                </button>
             </div>
             
             {/* Feedback Area */}
             {status !== 'IDLE' && (
               <div className={`mt-4 w-full max-w-2xl p-4 rounded border-l-4 animation-fade-in
                 ${status === 'SUCCESS' ? 'bg-green-50 border-green-500 text-green-800' : ''}
                 ${status === 'ERROR' ? 'bg-red-50 border-red-500 text-red-800' : ''}
                 ${status === 'RUNNING' ? 'bg-blue-50 border-blue-500 text-blue-800' : ''}
               `}>
                  <div className="flex items-start gap-3">
                    {status === 'SUCCESS' && <CheckCircle className="w-6 h-6 flex-shrink-0" />}
                    {status === 'ERROR' && <AlertTriangle className="w-6 h-6 flex-shrink-0" />}
                    {status === 'RUNNING' && <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                    <div>
                      <p className="font-bold">{status === 'SUCCESS' ? '성공' : status === 'ERROR' ? '공정 중단' : '처리 중'}</p>
                      <p className="text-sm mt-1 whitespace-pre-line">{feedback}</p>
                    </div>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssemblyTab;