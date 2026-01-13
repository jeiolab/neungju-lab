import React from 'react';
import { THEORY_CARDS } from '../constants';
import { AlertCircle } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-1">💡 시각화의 목적</h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          시각화는 단순히 예쁜 그림을 그리는 것이 아닙니다. 
          데이터 속에 숨겨진 <strong>패턴, 추세, 이상치</strong>를 발견하고 이를 명확하게 전달하는 것이 핵심입니다.
        </p>
      </div>

      <div className="grid gap-4">
        {THEORY_CARDS.map((card, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gray-50 p-2 rounded-lg">{card.icon}</div>
              <h4 className="font-bold text-gray-800">{card.title}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">{card.desc}</p>
            <div className="bg-orange-50 p-3 rounded text-xs text-orange-800 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span><strong>주의:</strong> {card.misconception}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};