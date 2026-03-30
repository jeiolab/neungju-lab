import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { ChevronDown, ChevronUp, BookOpen, AlertTriangle } from 'lucide-react';

const TabTheory: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          학습 목표
        </h2>
        <p className="text-blue-800">
          공유해야 할 정보와 보호해야 할 정보를 구분하고, SNS 업로드 전 스스로 점검하는 습관을 기릅니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((concept) => (
          <div
            key={concept.id}
            className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
              expandedId === concept.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <div
              className="p-5 cursor-pointer flex justify-between items-start"
              onClick={() => toggleExpand(concept.id)}
            >
              <div>
                <h3 className="text-lg font-bold text-slate-800">{concept.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {concept.keywords.map((k, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
              <button className="text-slate-400 hover:text-blue-500">
                {expandedId === concept.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>

            {expandedId === concept.id && (
              <div className="px-5 pb-5 border-t border-slate-100 pt-4 bg-slate-50 rounded-b-xl">
                <div className="space-y-3 text-sm text-slate-700">
                  <p><span className="font-bold text-blue-600">정의:</span> {concept.definition}</p>
                  <p><span className="font-bold text-green-600">예시:</span> {concept.example}</p>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-orange-800">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <AlertTriangle className="w-4 h-4" /> 오해하기 쉬운 점
                    </div>
                    {concept.misconception}
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-lg mt-3 text-center font-bold">
                    Q. {concept.question}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabTheory;
