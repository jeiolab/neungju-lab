'use client';

import React from 'react';
import { KNIGHTS } from '../constants';
import { DynamicIcon } from './Icons';

export const ConceptView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">정보 보호의 성</h2>
        <p className="text-slate-600 text-lg">
          정보 보호(Information Security)란 정보의 수집, 가공, 저장, 검색, 송신, 수신 중에 발생하는
          정보의 훼손, 변조, 유출 등을 방지하기 위한 관리적, 기술적 수단을 말합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {KNIGHTS.map((knight) => (
          <div 
            key={knight.id} 
            className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-slate-200 hover:-translate-y-2 transition-transform duration-300"
            style={{ borderColor: knight.color.replace('bg-', '') }} // Hacky way to use tailwind color class in border
          >
            <div className={`${knight.color} p-6 flex justify-center items-center h-40`}>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <DynamicIcon name={knight.iconName} className="text-white w-16 h-16" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{knight.koreanName}</h3>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">{knight.id}</p>
              <p className="text-slate-600 leading-relaxed">
                {knight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-8">
        <p className="text-blue-800 font-medium">
          💡 팁: 세 명의 기사가 모두 힘을 합쳐야 안전한 성(정보 시스템)을 유지할 수 있습니다. 이를 정보 보호의 3요소(CIA Triad)라고 부릅니다.
        </p>
      </div>
    </div>
  );
};