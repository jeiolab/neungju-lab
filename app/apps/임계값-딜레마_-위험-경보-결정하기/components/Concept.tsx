import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { ChevronRight, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

export const Concept: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const icons = [
    <Scale className="w-12 h-12 text-brand-500" />,
    <div className="text-2xl font-bold text-brand-500">S</div>,
    <div className="w-12 h-1 bg-brand-500 relative"><div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-red-500 rounded-full"></div></div>,
    <AlertTriangle className="w-12 h-12 text-orange-500" />
  ];

  const handleNext = () => {
    if (step < CONCEPTS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">개념 익히기</h2>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 min-h-[400px] relative">
        <div className="bg-brand-50 p-6 flex justify-center items-center h-40 border-b border-brand-100">
          {icons[step]}
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold">
              KEYWORD: {CONCEPTS[step].keyword}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">{CONCEPTS[step].title}</h3>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            {CONCEPTS[step].content}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-2">
            {CONCEPTS.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-brand-600' : 'bg-slate-300'}`}
              />
            ))}
          </div>
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
          >
            {step === CONCEPTS.length - 1 ? '시뮬레이션 시작' : '다음'}
            {step === CONCEPTS.length - 1 ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};