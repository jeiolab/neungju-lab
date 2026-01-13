import React, { useState } from 'react';
import { FLOW_STEPS } from '../constants';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

const FlowTab: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const nextStep = () => {
    if (currentStep < FLOW_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setCompleted(false);
    }
  };

  const stepData = FLOW_STEPS[currentStep];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">IoT 데이터 흐름 이해하기</h2>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${((currentStep + 1) / FLOW_STEPS.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px] flex flex-col">
        {/* Visual Content Placeholder - Abstract Representation */}
        <div className="h-48 bg-slate-900 flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900"></div>
           {currentStep === 0 && <span className="text-6xl">🛠️</span>}
           {currentStep === 1 && <span className="text-6xl animate-pulse">🌡️</span>}
           {currentStep === 2 && <span className="text-6xl animate-bounce">📡</span>}
           {currentStep === 3 && <span className="text-6xl">📥</span>}
           {currentStep === 4 && <span className="text-6xl text-red-500 animate-ping">🚨</span>}
        </div>

        <div className="p-8 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-2">
              Step {stepData.step}: {stepData.title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {stepData.desc}
            </p>
          </div>

          <div className="flex justify-between mt-8">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> 이전
            </button>
            <button 
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-transform active:scale-95"
            >
              {currentStep === FLOW_STEPS.length - 1 ? '완료하기' : '다음'} 
              {currentStep !== FLOW_STEPS.length - 1 && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </div>
        </div>
      </div>

      {completed && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center text-green-800 animate-bounce">
          <Check className="inline-block w-6 h-6 mr-2" />
          전체 흐름을 모두 확인했습니다! 퀴즈에 도전해보세요.
        </div>
      )}
    </div>
  );
};

export default FlowTab;