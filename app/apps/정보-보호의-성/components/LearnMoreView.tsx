'use client';

import React, { useState } from 'react';
import { LEARN_MORE_CONTENT } from '../constants';
import { DynamicIcon } from './Icons';

export const LearnMoreView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">보호 대책의 3가지 계층</h2>
        <p className="text-slate-600">
          정보를 보호하기 위해서는 단순히 기술적인 방법뿐만 아니라 물리적, 관리적인 노력이 함께 필요합니다.
        </p>
      </div>

      <div className="space-y-4">
        {LEARN_MORE_CONTENT.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-slate-200 hover:border-blue-200'}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center p-6 text-left focus:outline-none"
              >
                <div className={`p-3 rounded-lg mr-4 ${isOpen ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <DynamicIcon name={item.icon} size={24} />
                </div>
                <span className={`text-xl font-bold flex-1 ${isOpen ? 'text-blue-800' : 'text-slate-700'}`}>
                  {item.title}
                </span>
                <DynamicIcon 
                  name="Shield" 
                  className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-300'}`} 
                  size={20}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="p-6 pt-0 text-slate-600 leading-relaxed ml-16">
                  {item.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
