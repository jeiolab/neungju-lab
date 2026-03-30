import React from 'react';
import { THEORY_CARDS } from '../constants';
import { ArrowRight } from 'lucide-react';

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-8 pb-20">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm">
        <h3 className="font-bold text-xl text-blue-900 mb-2">핵심 개념</h3>
        <p className="text-blue-800 text-base">
          네트워크는 <strong>커버리지(범위)</strong>에 따라 분류됩니다.<br/>
          나(PAN) → 건물(LAN) → 도시(MAN) → 세계(WAN)로 확장되는 흐름을 기억하세요!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {THEORY_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.type} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-indigo-100 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <Icon size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{card.title.split(' ')[0]}</h4>
                  <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{card.range.split(' ')[0]}</span>
                </div>
              </div>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed flex-grow">{card.description}</p>
              <div className="bg-slate-50 p-3 rounded-xl mt-auto">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">대표 예시</p>
                <div className="flex flex-wrap gap-2">
                  {card.examples.map((ex, idx) => (
                    <span key={idx} className="text-xs bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-slate-700 shadow-sm">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-2 md:gap-8 text-lg md:text-2xl font-bold opacity-90">
            <span>PAN</span>
            <ArrowRight className="opacity-50" />
            <span>LAN</span>
            <ArrowRight className="opacity-50" />
            <span>MAN</span>
            <ArrowRight className="opacity-50" />
            <span>WAN</span>
        </div>
        <span className="ml-8 text-sm md:text-base font-medium bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">범위가 점점 넓어져요!</span>
      </div>
    </div>
  );
};

export default TabTheory;