import React, { useState } from 'react';
import { ClipboardList, CheckSquare, Square } from 'lucide-react';

const CHECKLIST_ITEMS = [
  "최소 1,000건 이상의 데이터가 있나요?",
  "정답(레이블)이 일관되고 신뢰할 수 있나요?",
  "과거의 데이터가 미래의 상황을 잘 대변하나요?",
  "10-15% 정도 틀려도 괜찮은 문제인가요?",
  "'성공'을 수학적으로 측정할 방법이 있나요?",
  "이 데이터를 사용할 법적 권리가 있나요?"
];

const LearnMore: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));

  const toggleCheck = (index: number) => {
    const newItems = [...checkedItems];
    newItems[index] = !newItems[index];
    setCheckedItems(newItems);
  };

  const score = checkedItems.filter(Boolean).length;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ClipboardList />
            데이터 준비 체크리스트
          </h2>
          <p className="text-indigo-100 mt-2">머신러닝 프로젝트를 시작하기 전에 스스로 질문해보세요.</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => toggleCheck(idx)}
                className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <div className={`mt-1 transition-colors ${checkedItems[idx] ? 'text-emerald-500' : 'text-gray-300 group-hover:text-indigo-400'}`}>
                  {checkedItems[idx] ? <CheckSquare size={24} /> : <Square size={24} />}
                </div>
                <span className={`text-lg ${checkedItems[idx] ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-500 uppercase">준비 점수</span>
                <span className="text-2xl font-bold text-indigo-600">{score} / {CHECKLIST_ITEMS.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(score / CHECKLIST_ITEMS.length) * 100}%` }}
                ></div>
            </div>
            <p className="mt-4 text-center text-gray-600 text-sm">
                {score < 3 ? "추천: 수동 규칙이나 데이터 수집부터 시작하세요." : "추천: 파일럿 모델을 만들어볼 준비가 되셨군요!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;