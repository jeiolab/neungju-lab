import React from 'react';
import { THEORY_CARDS } from '../constants';

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🔐 보안의 기초 이론</h2>
        <p className="text-gray-600">
          안전한 앱을 만들기 위해 꼭 알아야 할 4가지 핵심 기술입니다.
          이 개념들을 이해하면 보안 설계를 훨씬 쉽게 할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEORY_CARDS.map((card, index) => (
          <div key={index} className={`p-5 rounded-xl border ${card.color} transition-transform hover:scale-[1.02] cursor-default shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {card.icon}
              </div>
              <h3 className="font-bold text-lg">{card.title}</h3>
            </div>
            <p className="font-medium text-lg mb-2">{card.summary}</p>
            <p className="text-sm opacity-90 mb-4 leading-relaxed">{card.detail}</p>
            <div className="bg-white/50 p-3 rounded-lg text-sm">
              <span className="font-bold">💡 예시:</span> {card.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabTheory;
