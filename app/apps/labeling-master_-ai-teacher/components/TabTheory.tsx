import React, { useState, useEffect } from 'react';
import { THEORY_STEPS } from '../constants';
import { BookOpen, ChevronRight, CheckCircle } from 'lucide-react';

interface TabTheoryProps {
  onComplete: () => void;
}

const TabTheory: React.FC<TabTheoryProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    setTimer(5);
    setCanProceed(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanProceed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleNext = () => {
    if (step < THEORY_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex items-center space-x-2 text-indigo-600 mb-4">
        <BookOpen className="w-6 h-6" />
        <h2 className="text-2xl font-bold">지도학습이란 무엇일까요?</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px] flex flex-col justify-between border-2 border-indigo-50">
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
              Step {step + 1} / {THEORY_STEPS.length}
            </span>
            <div className="flex gap-1">
                {THEORY_STEPS.map((_, i) => (
                    <div key={i} className={`h-2 w-8 rounded-full transition-colors ${i <= step ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                ))}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{THEORY_STEPS[step].title}</h3>
          <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
            {THEORY_STEPS[step].content}
          </p>
          
          <div className="mt-8 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <p className="text-yellow-800 font-medium">💡 {THEORY_STEPS[step].keyword}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all transform ${
              canProceed
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canProceed ? (
              <>
                <span>{step === THEORY_STEPS.length - 1 ? '학습 완료' : '다음으로'}</span>
                {step === THEORY_STEPS.length - 1 ? <CheckCircle className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </>
            ) : (
              <span>읽는 중... ({timer}초)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabTheory;