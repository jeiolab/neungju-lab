import React, { useState } from 'react';
import { Utensils, CheckCircle2, Circle } from 'lucide-react';

const ContextTab: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scenarioSteps = [
    {
      id: 'step1',
      title: '상황 파악: 급식 메뉴 관리',
      content: '영양사 선생님이 "매일 점심 메뉴를 파일(lunch.txt)에 기록하고 싶다"고 합니다. 어제 메뉴를 지우고 오늘 것만 남겨야 할까요, 아니면 기록을 모아야 할까요?',
      question: '이때 어떤 모드가 필요할까요?',
      answer: "기록을 누적하려면 'a' (append), 매일 새로 쓴다면 'w' (write)입니다. 보통은 기록을 위해 'a'를 씁니다."
    },
    {
      id: 'step2',
      title: '데이터 입력 설계',
      content: '학생들이 선호 메뉴를 투표하는 프로그램을 만든다고 가정해봅시다.',
      code: `menu = input("좋아하는 메뉴는?")\nfile = open("votes.txt", "a")\nfile.write(menu + "\\n")\nfile.close()`,
      question: '위 코드에서 "\\n" (줄바꿈)은 왜 필요할까요?',
      answer: "파일에는 줄바꿈이 자동으로 들어가지 않기 때문에, 구분하기 위해 직접 넣어줘야 합니다."
    },
    {
      id: 'step3',
      title: '안전성 검토',
      content: '프로그램 실행 중에 컴퓨터가 꺼지면 파일은 어떻게 될까요?',
      question: 'close()를 안 했을 때의 위험성은?',
      answer: "운영체제 내부 버퍼에만 남아있고 실제 파일에는 안 써질 수 있습니다. 그래서 꼭 close()가 필요합니다."
    }
  ];

  return (
    <div className="pb-24 md:pb-0 animate-in fade-in duration-500">
      <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg mb-8">
        <h2 className="text-2xl font-bold text-orange-900 mb-2 flex items-center gap-2">
          <Utensils /> 현실 시나리오: 학교 급식실
        </h2>
        <p className="text-orange-800">
          학교 급식 메뉴 데이터를 관리하는 실제 상황을 통해 파일 입출력을 이해해봅시다.
        </p>
      </div>

      <div className="space-y-4">
        {scenarioSteps.map((step, idx) => {
          const isChecked = checkedItems[step.id];
          return (
            <div key={step.id} 
              onClick={() => toggleCheck(step.id)}
              className={`cursor-pointer border rounded-xl p-5 transition-all duration-300 ${
                isChecked ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-bold text-lg mb-2 ${isChecked ? 'text-indigo-800' : 'text-gray-700'}`}>
                    Step {idx + 1}. {step.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{step.content}</p>
                  
                  {step.code && (
                    <pre className="bg-gray-800 text-gray-200 p-3 rounded-lg text-sm font-mono mb-3 overflow-x-auto">
                      {step.code}
                    </pre>
                  )}

                  {isChecked && (
                    <div className="mt-4 bg-white/50 p-3 rounded border border-indigo-100 animate-in slide-in-from-top-2">
                      <p className="font-bold text-indigo-600 text-sm">🤔 {step.question}</p>
                      <p className="text-gray-700 text-sm mt-1">👉 {step.answer}</p>
                    </div>
                  )}
                </div>
                <div className={`mt-1 ${isChecked ? 'text-indigo-600' : 'text-gray-300'}`}>
                  {isChecked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContextTab;
