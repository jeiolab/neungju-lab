import React from 'react';
import { SortType } from '../types';

interface TheoryTabProps {
  currentSortType: SortType;
}

const TheoryTab: React.FC<TheoryTabProps> = ({ currentSortType }) => {
  const getContent = () => {
    switch (currentSortType) {
      case SortType.BUBBLE:
        return {
          title: "버블 정렬 (Bubble Sort)",
          concept: "인접한 두 원소를 비교하여 순서가 뒤바뀌어 있으면 서로 교환하는 방식입니다.",
          analogy: "물속의 거품이 수면 위로 뽀글뽀글 올라오는 것처럼, 큰(혹은 작은) 데이터가 배열의 끝으로 서서히 이동합니다.",
          pros: "구현이 매우 간단하고 직관적입니다.",
          cons: "데이터의 이동(Swap)이 매우 빈번하게 일어나서 효율이 떨어집니다.",
          timeComplexity: "O(n²)"
        };
      case SortType.SELECTION:
        return {
          title: "선택 정렬 (Selection Sort)",
          concept: "전체 데이터 중에서 가장 작은(혹은 큰) 값을 찾아 선택하여, 정해진 위치로 이동시키는 방식입니다.",
          analogy: "카드 뭉치에서 가장 작은 숫자를 찾아 맨 앞에 놓고, 남은 카드 중 다시 가장 작은 것을 찾아 두 번째에 놓는 과정과 같습니다.",
          pros: "버블 정렬보다 교환 횟수가 적습니다.",
          cons: "데이터가 이미 정렬되어 있어도 비교 과정을 모두 거쳐야 합니다.",
          timeComplexity: "O(n²)"
        };
      case SortType.INSERTION:
        return {
          title: "삽입 정렬 (Insertion Sort)",
          concept: "데이터를 하나씩 뽑아서, 이미 정렬된 부분의 적절한 위치를 찾아 삽입하는 방식입니다.",
          analogy: "손안의 카드를 정리할 때, 새로운 카드를 뽑아서 이미 정리된 카드들 사이 적절한 틈에 끼워 넣는 것과 같습니다.",
          pros: "데이터가 거의 정렬되어 있을 때 매우 빠릅니다. (최선 O(n))",
          cons: "데이터 이동이 많을 수 있습니다.",
          timeComplexity: "O(n²)"
        };
      default:
        return { title: "", concept: "", analogy: "", pros: "", cons: "", timeComplexity: "" };
    }
  };

  const content = getContent();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">{content.title}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">핵심 개념</h3>
            <p className="text-slate-800 text-lg leading-relaxed">{content.concept}</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-1">비유 (Analogy)</h3>
            <p className="text-indigo-900 font-medium">{content.analogy}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-2">장점</h3>
            <p className="text-slate-600">{content.pros}</p>
         </div>
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-2">단점</h3>
            <p className="text-slate-600">{content.cons}</p>
         </div>
      </div>
       <div className="bg-slate-800 text-white p-4 rounded-xl text-center">
            <span className="text-slate-400 mr-2">시간 복잡도(평균):</span>
            <span className="font-mono text-xl font-bold text-yellow-400">{content.timeComplexity}</span>
       </div>
    </div>
  );
};

export default TheoryTab;