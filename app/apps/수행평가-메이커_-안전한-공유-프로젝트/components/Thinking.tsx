import React from 'react';
import { THINKING_PROBLEMS } from '../constants';
import { Lightbulb } from 'lucide-react';

export const Thinking: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">생각해볼 문제</h2>
      <p className="text-gray-600 mb-8">정답은 없습니다. 여러분만의 논리로 답을 찾아보세요.</p>
      
      <div className="grid gap-6">
        {THINKING_PROBLEMS.map((prob) => (
          <div key={prob.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
            <div className={`p-6 md:w-1/4 flex flex-col justify-center items-center text-center text-white
              ${prob.type === 'condition' ? 'bg-purple-500' : prob.type === 'counter' ? 'bg-orange-500' : 'bg-blue-500'}
            `}>
              <Lightbulb size={32} className="mb-2 opacity-80"/>
              <span className="font-bold text-lg">{prob.type === 'condition' ? '조건 변경' : prob.type === 'counter' ? '반례 찾기' : '적용하기'}</span>
            </div>
            <div className="p-6 md:w-3/4 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{prob.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{prob.description}</p>
              <textarea 
                placeholder="여기에 생각을 정리해보세요..." 
                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none resize-none h-24 bg-gray-50"
              ></textarea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};