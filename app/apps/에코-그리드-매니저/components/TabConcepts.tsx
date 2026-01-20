import React, { useState } from 'react';
import { Layers, Grid3X3, ArrowRight } from 'lucide-react';

const TabConcepts: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const concepts = [
    {
      title: "1. 2D 세상 (평면)",
      icon: <Grid3X3 className="w-12 h-12 text-blue-500" />,
      text: "2D 배열은 단일 층의 평면도와 같습니다. 특정 방을 찾으려면 행(Row)과 열(Column) 두 개의 숫자가 필요합니다.",
      code: "room = school[row][col]",
      visual: (
        <div className="grid grid-cols-3 gap-1 w-32 mx-auto mt-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`h-8 w-8 border rounded flex items-center justify-center text-xs ${i === 4 ? 'bg-blue-500 text-white' : 'bg-blue-50'}`}>
              {i === 4 ? '[1][1]' : ''}
            </div>
          ))}
        </div>
      )
    },
    {
      title: "2. 3D 세상 (입체)",
      icon: <Layers className="w-12 h-12 text-purple-500" />,
      text: "현실에는 높이가 있습니다! 여러 평면도를 층층이 쌓으면 3D 구조가 됩니다. 이제 층(Floor), 행(Row), 열(Column) 세 개의 숫자가 필요합니다.",
      code: "room = school[floor][row][col]",
      visual: (
        <div className="relative h-32 w-32 mx-auto mt-6 perspective-500">
          <div className="absolute top-0 left-0 bg-purple-200 border border-purple-400 w-24 h-24 transform rotate-x-60 translate-y-8 opacity-50"></div>
          <div className="absolute top-0 left-0 bg-purple-300 border border-purple-500 w-24 h-24 transform rotate-x-60 translate-y-4 opacity-75"></div>
          <div className="absolute top-0 left-0 bg-purple-500 border border-purple-600 w-24 h-24 transform rotate-x-60 text-white flex items-center justify-center">
            3D 인덱스
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 flex flex-col items-center justify-center h-full max-w-lg mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full text-center transition-all duration-300">
        <div className="flex justify-center mb-6">
          {concepts[step].icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{concepts[step].title}</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">{concepts[step].text}</p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm mb-6 shadow-inner">
          {concepts[step].code}
        </div>
        
        {concepts[step].visual}

        <div className="mt-8 flex justify-between items-center w-full">
            <div className="flex gap-2">
                <div className={`h-2 w-2 rounded-full ${step === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div className={`h-2 w-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          <button 
            onClick={() => {
              if (step < concepts.length - 1) setStep(step + 1);
              else onComplete();
            }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
          >
            {step === concepts.length - 1 ? "시뮬레이션 시작" : "다음"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabConcepts;