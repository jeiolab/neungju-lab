import React, { useState } from 'react';
import { DEEP_DIVE_CONTENT } from '../constants';
import { Layers, Zap } from 'lucide-react';

export const DeepDiveTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Layers className="text-blue-500" /> 심층 분석 보고서
        </h2>
        <p className="text-slate-600 mt-2">
          단순한 이론을 넘어 실제 세상에서 기술들이 어떻게 융합되어 사용되는지 알아봅니다.
        </p>
      </div>

      <div className="grid gap-6">
        {DEEP_DIVE_CONTENT.map((content, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-amber-600">{content.title}</h3>
              <div className="flex gap-2">
                {content.techs.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-slate-100 text-xs font-mono text-blue-600 rounded-full border border-slate-200 font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-slate-700 mb-4 font-medium leading-relaxed">{content.description}</p>
            
            <div className="bg-slate-50 p-4 rounded-lg border-l-2 border-slate-300">
              <div className="flex items-start gap-2">
                <Zap className="text-amber-500 shrink-0 mt-1" size={16} />
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.realWorldExample}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};