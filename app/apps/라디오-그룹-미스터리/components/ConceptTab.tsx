import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { CheckCircle2, Circle } from 'lucide-react';

const ConceptTab: React.FC = () => {
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);

  const handleCheck = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h2 className="font-bold text-blue-700 text-lg">기본 개념 익히기</h2>
        <p className="text-blue-600">IoT 시스템을 만들기 위해 꼭 알아야 할 3가지 개념입니다. 읽어보고 체크해보세요!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {CONCEPTS.map((concept, idx) => (
          <div 
            key={idx} 
            className={`bg-white rounded-xl shadow-sm border p-6 transition-all cursor-pointer hover:shadow-md ${checked[idx] ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}
            onClick={() => handleCheck(idx)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{concept.icon}</span>
              {checked[idx] ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-300" />}
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">{concept.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{concept.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-100 p-6 rounded-lg text-center">
        <p className="text-lg font-medium mb-2">
          나의 숙련도: <span className="text-indigo-600 font-bold">{Math.round((checked.filter(Boolean).length / 3) * 100)}%</span>
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-md mx-auto">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(checked.filter(Boolean).length / 3) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default ConceptTab;