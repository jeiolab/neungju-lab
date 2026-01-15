import React from 'react';
import { Compass, Lightbulb, TrendingUp, Layers } from 'lucide-react';

const ConceptTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-3xl font-bold font-serif text-slate-800">진로 설계, 어떻게 시작할까?</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          단순히 존재하는 직업을 고르는 것을 넘어, 변화하는 세상에 맞춰 나만의 길을 만들어가는 과정입니다.
        </p>
      </div>

      {/* 3 Steps */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Compass className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">1. 자기 이해</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            나의 흥미, 적성, 가치관을 깊이 있게 들여다보는 단계입니다. 내가 무엇을 할 때 행복한지 발견해보세요.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">2. 직업 탐색 & 창직</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            세상에 어떤 일이 있는지 알아보고, 없으면 새로운 기술을 더해 직접 직업을 만들어(Job Creation) 봅니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">3. 역량 개발</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            목표를 이루기 위해 필요한 구체적인 기술과 태도를 기릅니다. 작은 실천들이 모여 경쟁력이 됩니다.
          </p>
        </div>
      </div>

      {/* Job Creation Concept */}
      <div className="bg-slate-800 text-white rounded-2xl p-8 mt-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-bold uppercase">
            핵심 개념
          </div>
          <h3 className="text-2xl font-serif font-bold">창직 (Job Creation)이란?</h3>
          <p className="text-slate-300 leading-relaxed">
            기존 노동 시장에 없는 새로운 직업을 자신의 능력과 적성, 그리고 디지털 기술을 융합하여 주도적으로 만들어내는 활동을 말합니다. 
            <br/><br/>
            이제 직업은 '찾는 것'이 아니라 '만드는 것'입니다.
          </p>
        </div>
        <div className="flex-shrink-0 bg-white/10 p-6 rounded-full">
          <Layers className="w-24 h-24 text-amber-400" />
        </div>
      </div>
    </div>
  );
};

export default ConceptTab;