import React, { useState } from 'react';
import { BookOpen, ArrowRight, Check } from 'lucide-react';

const concepts = [
  {
    title: "변수 (Variable)",
    desc: "데이터를 저장하는 '기억 상자'입니다. 이름표(변수명)를 붙여 관리합니다.",
    example: "score = 90",
    key: "변수는 값을 담는 그릇!"
  },
  {
    title: "대입 연산자 (=)",
    desc: "오른쪽의 값을 왼쪽 변수 상자에 '넣는다'는 뜻입니다. 수학의 '같다'와 다릅니다.",
    example: "name = '철수'",
    key: "오른쪽 값을 왼쪽에 저장!"
  },
  {
    title: "자료형 (Data Type)",
    desc: "데이터의 종류입니다. 컴퓨터는 숫자와 문자를 다르게 처리합니다.",
    example: "int(정수), float(실수), str(문자열)",
    key: "type() 함수로 확인 가능!"
  },
  {
    title: "변수명 규칙",
    desc: "변수 이름은 숫자로 시작할 수 없고, 띄어쓰기를 할 수 없습니다.",
    example: "my_score (O), 1st_class (X)",
    key: "스네이크 표기법(my_var) 추천!"
  }
];

const ConceptTab: React.FC = () => {
  const [checked, setChecked] = useState<boolean[]>(new Array(4).fill(false));

  const toggleCheck = (idx: number) => {
    const newChecked = [...checked];
    newChecked[idx] = !newChecked[idx];
    setChecked(newChecked);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          오늘의 학습 목표
        </h3>
        <p className="text-blue-800 text-sm mt-1">
          변수의 개념을 이해하고, 상황에 맞는 올바른 자료형을 선택할 수 있다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concepts.map((concept, idx) => (
          <div 
            key={idx} 
            className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
              checked[idx] 
                ? 'bg-indigo-50 border-indigo-300' 
                : 'bg-white border-slate-100 hover:border-indigo-200'
            }`}
            onClick={() => toggleCheck(idx)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg text-slate-800">{concept.title}</h4>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                checked[idx] ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 text-transparent'
              }`}>
                <Check className="w-4 h-4" />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-3 h-10">{concept.desc}</p>
            <div className="bg-slate-100 p-2 rounded text-xs font-mono text-slate-700 mb-2">
              예시: {concept.example}
            </div>
            <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> {concept.key}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center text-sm text-slate-500">
        카드를 클릭하여 읽음 표시를 해보세요!
      </div>
    </div>
  );
};

export default ConceptTab;