import React, { useState } from 'react';
import { ERROR_CASES } from '../constants';
import { ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

const TabGallery: React.FC = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % ERROR_CASES.length);
  const prev = () => setIndex((prev) => (prev - 1 + ERROR_CASES.length) % ERROR_CASES.length);

  const errorCase = ERROR_CASES[index];

  // Helper to color code the missing step badge
  const getBadgeColor = (step: string) => {
    switch (step) {
      case 'Perception': return 'bg-blue-100 text-blue-800';
      case 'Learning': return 'bg-purple-100 text-purple-800';
      case 'Reasoning': return 'bg-amber-100 text-amber-800';
      case 'Action': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
        <AlertCircle className="mr-2 text-red-500" /> 에러 사례 갤러리
      </h2>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden h-[420px] flex flex-col">
          <div className="bg-slate-800 text-white p-6 flex justify-between items-center">
             <span className="font-mono opacity-50 text-sm">CASE #{index + 1}</span>
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/20`}>
               {errorCase.missingStep} 오류
             </span>
          </div>
          
          <div className="p-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">{errorCase.title}</h3>
            
            <div className="space-y-6">
               <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">상황 (Scenario)</div>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {errorCase.scenario}
                  </p>
               </div>
               
               <div>
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">결과 (Consequence)</div>
                  <p className="text-slate-700 bg-red-50 p-3 rounded-lg border border-red-100">
                    {errorCase.consequence}
                  </p>
               </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t flex justify-center text-sm text-slate-400">
            <RefreshCw className="w-4 h-4 mr-2" /> 루프의 한 단계가 무너지면 전체가 멈춥니다
          </div>
        </div>

        {/* Navigation */}
        <button 
          onClick={prev}
          className="absolute top-1/2 -left-4 sm:-left-12 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border hover:bg-slate-50 text-slate-600"
        >
          <ChevronLeft />
        </button>
        <button 
          onClick={next}
          className="absolute top-1/2 -right-4 sm:-right-12 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border hover:bg-slate-50 text-slate-600"
        >
          <ChevronRight />
        </button>
      </div>
      
      <div className="flex gap-2 mt-6">
        {ERROR_CASES.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-slate-800 w-6' : 'bg-slate-300'}`} />
        ))}
      </div>
    </div>
  );
};

export default TabGallery;
