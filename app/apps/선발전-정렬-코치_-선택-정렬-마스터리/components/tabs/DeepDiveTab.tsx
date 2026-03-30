import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Scale } from 'lucide-react';

const DeepDiveTab: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  const scenarios = [
    {
      id: 1,
      question: "데이터 교환(Swap) 비용이 매우 비싼 시스템이라면?",
      context: "예: 플래시 메모리 쓰기 횟수 제한, 거대한 데이터 레코드 이동 등",
      answer: true, // true = Selection sort better
      explanation: "선택 정렬은 교환 횟수가 N번 이하로 고정되어 있어, 버블/삽입 정렬보다 쓰기(Write) 연산을 최소화할 때 유리합니다."
    },
    {
      id: 2,
      question: "이미 거의 정렬된 데이터를 정렬할 때는?",
      context: "예: [1, 2, 3, 5, 4] 처럼 하나만 바뀐 경우",
      answer: false, // false = Selection sort worse
      explanation: "선택 정렬은 데이터 상태와 무관하게 무조건 전체를 스캔합니다(O(N²)). 삽입 정렬은 이 경우 O(N)에 가깝게 끝납니다."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pros Card */}
        <div className="bg-white p-6 rounded-xl border-t-4 border-green-500 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <ThumbsUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">선택 정렬의 장점</h3>
          </div>
          <ul className="space-y-3 text-slate-600">
            <li className="flex gap-2">
              <CheckBullet />
              <span><strong>구현이 매우 단순함:</strong> 코드가 직관적이라 이해하기 쉽습니다.</span>
            </li>
            <li className="flex gap-2">
              <CheckBullet />
              <span><strong>교환 횟수 최소화:</strong> 자료 이동(Swap)이 중요한 경우 효율적입니다.</span>
            </li>
            <li className="flex gap-2">
              <CheckBullet />
              <span><strong>제자리 정렬:</strong> 메모리를 추가로 거의 쓰지 않습니다.</span>
            </li>
          </ul>
        </div>

        {/* Cons Card */}
        <div className="bg-white p-6 rounded-xl border-t-4 border-red-500 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full text-red-600">
              <ThumbsDown size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">선택 정렬의 단점</h3>
          </div>
          <ul className="space-y-3 text-slate-600">
            <li className="flex gap-2">
              <XBullet />
              <span><strong>느린 속도 (O(N²)):</strong> 데이터가 10,000개만 넘어가도 매우 느려집니다.</span>
            </li>
            <li className="flex gap-2">
              <XBullet />
              <span><strong>불안정 정렬 (Unstable):</strong> 같은 값의 순서가 바뀔 수 있습니다. (예: [B1, B2, A] {'->'} [A, B2, B1])</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mini Scenarios */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Scale /> 상황별 판단: 선택 정렬, 쓸까 말까?
        </h3>
        <div className="grid gap-4">
          {scenarios.map(sc => (
            <div key={sc.id} className="bg-white border border-slate-200 rounded-lg p-5">
              <p className="font-bold text-slate-800 text-lg mb-1">{sc.question}</p>
              <p className="text-sm text-slate-500 mb-4">{sc.context}</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveScenario(activeScenario === sc.id ? null : sc.id)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm font-bold text-slate-700 transition"
                >
                  {activeScenario === sc.id ? '설명 닫기' : '정답 확인'}
                </button>
              </div>

              {activeScenario === sc.id && (
                <div className={`mt-4 p-4 rounded text-sm animate-fade-in ${sc.answer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <strong>{sc.answer ? 'YES! 유리합니다.' : 'NO! 불리합니다.'}</strong>
                  <p className="mt-1">{sc.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CheckBullet = () => <span className="text-green-500 font-bold">✓</span>;
const XBullet = () => <span className="text-red-500 font-bold">✕</span>;

export default DeepDiveTab;
