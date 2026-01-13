import React, { useState } from 'react';
import { LEARN_CASES } from '../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LearnMoreTab: React.FC = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % LEARN_CASES.length);
  const prev = () => setIndex((prev) => (prev - 1 + LEARN_CASES.length) % LEARN_CASES.length);

  const currentCase = LEARN_CASES[index];

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">실생활 사례 더보기</h2>
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <img 
          src={currentCase.image} 
          alt={currentCase.title} 
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">{currentCase.title}</h3>
          <p className="text-gray-600 mb-4">{currentCase.description}</p>
          <div className="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
            <h4 className="font-bold text-indigo-900 text-sm mb-1">역할 분석</h4>
            <p className="text-sm text-indigo-800">{currentCase.roleAnalysis}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2">
            <button onClick={prev} className="bg-white/80 p-2 rounded-full shadow hover:bg-white text-gray-800">
                <ChevronLeft />
            </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2">
            <button onClick={next} className="bg-white/80 p-2 rounded-full shadow hover:bg-white text-gray-800">
                <ChevronRight />
            </button>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        {LEARN_CASES.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-indigo-600' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
};

export default LearnMoreTab;
