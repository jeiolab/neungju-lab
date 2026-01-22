import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { BookOpen, Check } from 'lucide-react';

export const TabConcepts: React.FC = () => {
  const [readCards, setReadCards] = useState<number[]>([]);

  const handleRead = (index: number) => {
    if (!readCards.includes(index)) {
      setReadCards([...readCards, index]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          <BookOpen size={20} /> 학습 목표
        </h2>
        <p className="text-blue-800 text-sm mt-1">
          개인정보의 개념과 안전한 정보 공유 원칙을 1분 안에 마스터해보세요!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {CONCEPTS.map((concept, idx) => (
          <div 
            key={idx}
            className={`border rounded-xl p-5 shadow-sm transition-all hover:shadow-md cursor-pointer relative ${
              readCards.includes(idx) ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}
            onClick={() => handleRead(idx)}
          >
            {readCards.includes(idx) && (
              <div className="absolute top-3 right-3 text-green-500">
                <Check size={20} />
              </div>
            )}
            <h3 className="font-bold text-lg mb-2 text-slate-800">{concept.title}</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed h-24 overflow-y-auto">
              {concept.content}
            </p>
            <div className="space-y-1">
              {concept.keyPoints.map((pt, i) => (
                <div key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded inline-block mr-1">
                  #{pt}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
        <h3 className="font-bold text-gray-800 mb-4">오늘의 10초 체크</h3>
        <p className="text-gray-600 mb-4">"친구의 전화번호를 동의 없이 다른 친구에게 알려주는 것은?"</p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-2 border border-red-200 bg-red-50 text-red-700 rounded hover:bg-red-100 transition">
            개인정보 침해 O
          </button>
          <button className="px-6 py-2 border border-gray-200 hover:bg-gray-50 rounded transition">
            괜찮음 X
          </button>
        </div>
      </div>
    </div>
  );
};