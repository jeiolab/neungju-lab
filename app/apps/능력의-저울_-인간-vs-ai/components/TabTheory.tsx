import React from 'react';
import { THEORY_CARDS } from '../constants';

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in p-4">
      <div className="bg-slate-800 border-l-4 border-blue-500 p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold text-white mb-2">💡 분석가의 브리핑</h2>
        <p className="text-slate-300">
          인간과 AI는 각자 잘하는 영역이 다릅니다. AI는 <strong>'계산과 패턴'</strong>에 강하고, 
          인간은 <strong>'직관과 공감'</strong>에 강합니다. 아래 카드를 통해 상세 내용을 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEORY_CARDS.map((card, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-slate-900 rounded-lg">{card.icon}</div>
              <h3 className="text-lg font-bold text-white">{card.title}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-orange-900/20 p-3 rounded border border-orange-500/30">
                <span className="block text-orange-400 font-bold mb-1">Human 🧑</span>
                <p className="text-slate-300">{card.humanSide}</p>
              </div>
              <div className="bg-cyan-900/20 p-3 rounded border border-cyan-500/30">
                <span className="block text-cyan-400 font-bold mb-1">AI 🤖</span>
                <p className="text-slate-300">{card.aiSide}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-purple-500/30">
        <h3 className="text-lg font-bold text-purple-400 mb-4">핵심 개념: 약인공지능 vs 강인공지능</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">약인공지능 (Weak AI):</strong> 특정 문제(바둑, 청소, 번역) 해결에 특화된 AI. 현재의 모든 AI가 이에 해당함.</li>
          <li><strong className="text-white">강인공지능 (Strong AI):</strong> 인간처럼 자아와 일반적인 지능을 가진 AI. 영화 속의 AI(아이언맨 자비스 등)로, 아직 개발되지 않음.</li>
        </ul>
      </div>
    </div>
  );
};

export default TabTheory;