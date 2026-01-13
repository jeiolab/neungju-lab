import React, { useState } from 'react';
import { THINK_QUESTIONS } from '../constants';
import { Lightbulb } from 'lucide-react';

const TabThink: React.FC = () => {
  const [answers, setAnswers] = useState<{[key: number]: string}>({});

  const handleChange = (id: number, val: string) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 rounded-xl shadow-lg text-white mb-8">
        <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
                <Lightbulb className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
                 <h2 className="text-2xl font-bold mb-2">심화 탐구: 생각해볼 문제</h2>
                <p className="opacity-90">
                보안에는 정답이 없습니다. 상황에 따라 최선의 선택이 달라질 뿐입니다.
                아래 질문들에 대해 고민해보고 나만의 논리를 만들어보세요.
                </p>
            </div>
        </div>
      </div>

      {THINK_QUESTIONS.map((q) => (
        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                ${q.type === 'condition' ? 'bg-blue-100 text-blue-700' : 
                  q.type === 'counter' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {q.type === 'condition' ? '조건 변경' : q.type === 'counter' ? '반례 찾기' : '적용 설계'}
            </span>
            <h3 className="font-bold text-lg text-gray-800">{q.title}</h3>
          </div>
          <p className="text-gray-600 mb-4 bg-gray-50 p-4 rounded-lg">{q.description}</p>
          <textarea
            className="w-full border p-3 rounded-lg h-32 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            placeholder={q.placeholder}
            value={answers[q.id] || ''}
            onChange={(e) => handleChange(q.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default TabThink;
