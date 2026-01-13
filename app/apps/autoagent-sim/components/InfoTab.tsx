import React from 'react';
import { LEVELS_INFO } from '../constants';

const InfoTab: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-8 border-b border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900">자율주행 기술 단계 (SAE Levels)</h2>
        <p className="text-gray-500 mt-2">미국 자동차 공학회(SAE)에서 정의한 0단계부터 5단계까지의 자율주행 분류입니다.</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {LEVELS_INFO.map((lvl, idx) => (
          <div 
            key={lvl.level} 
            className={`
              p-6 hover:bg-gray-50 transition-colors flex flex-col items-center text-center group
              ${idx > 2 ? 'border-t md:border-t-0 lg:border-t border-gray-100' : ''} /* Adjust borders for grid */
            `}
          >
            <div className={`
              w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold text-white shadow-lg mb-4 transform group-hover:scale-110 transition-transform
              ${lvl.level < 3 ? 'bg-gray-400 shadow-gray-200' : lvl.level < 5 ? 'bg-indigo-500 shadow-indigo-200' : 'bg-indigo-600 shadow-indigo-300'}
            `}>
              <span className="text-xs opacity-80 font-medium">LEVEL</span>
              <span className="text-3xl">{lvl.level}</span>
            </div>
            
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 justify-center mb-2">
              {lvl.title}
              {lvl.level >= 5 && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Future</span>}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{lvl.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          현재 대부분의 상용차는 <span className="font-semibold text-gray-900">Level 2~2.5</span> 수준이며, 
          완전 자율주행(Level 5)을 위해서는 고도화된 <span className="text-indigo-600 font-bold">인지(Reactivity)</span>와 
          <span className="text-indigo-600 font-bold">판단(Autonomy)</span> 기술이 필요합니다.
        </p>
      </div>
    </div>
  );
};

export default InfoTab;
