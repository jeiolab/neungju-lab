import React from 'react';
import { THEORY_CONTENT } from '../constants';
import { Brain, Network, Zap } from 'lucide-react';

const icons = [Brain, Network, Zap];

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">기계학습 유형 완전 정복</h2>
        <p className="text-slate-600">AI가 학습하는 세 가지 주요 방법을 알아봐요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {THEORY_CONTENT.map((item, index) => {
          const Icon = icons[index];
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-indigo-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-800">{item.type}</h3>
              </div>
              
              <p className="text-slate-600 mb-4 min-h-[3rem]">{item.desc}</p>
              
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">핵심 키워드</h4>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">활용 예시</h4>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {item.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabTheory;