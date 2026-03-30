import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export const TheorySection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          핵심 이론 개념 카드
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">🚀 퀵 정렬과 피벗(Pivot)</h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              퀵 정렬은 <strong>피벗(기준점)</strong>을 하나 잡고, 그보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 보냅니다.
              <br/><br/>
              ⚠️ <strong>주의:</strong> 피벗이 항상 가장 작은(또는 큰) 값으로 선택되면, 분할이 제대로 안 되어 성능이 <span className="font-mono text-red-600">O(N²)</span>으로 떨어집니다 (최악의 상황). 이를 방지하려면 랜덤 피벗이나 중앙값을 사용해야 합니다.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-bold text-green-800 mb-2">⚖️ 트레이드오프 (Trade-off)</h3>
            <ul className="text-sm text-green-700 space-y-2 list-disc pl-4">
              <li><strong>시간 vs 메모리:</strong> 합병 정렬은 빠르지만 배열을 복사할 추가 공간(메모리)이 필요합니다.</li>
              <li><strong>속도 vs 안정성:</strong> 퀵 정렬은 빠르지만, 같은 값의 순서가 뒤바뀔 수 있습니다(Unstable).</li>
              <li><strong>상황적합성:</strong> 이미 거의 정렬된 데이터라면 단순한 삽입 정렬이 퀵 정렬보다 빠를 수 있습니다.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};