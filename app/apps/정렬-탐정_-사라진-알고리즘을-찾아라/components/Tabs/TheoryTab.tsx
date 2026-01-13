import React from 'react';

const TheoryTab: React.FC = () => {
  const algorithms = [
    {
      name: "버블 정렬 (Bubble Sort)",
      desc: "리스트를 반복적으로 순회하며 인접한 원소를 비교하고, 순서가 잘못된 경우 서로 교환합니다.",
      signature: "가장 큰 원소들이 하나씩 오른쪽 끝으로 '거품'처럼 이동합니다.",
      visualHint: "가장 오른쪽 끝의 원소들이 먼저 정렬되어 있는지 확인하세요. 정렬되지 않은 부분은 왼쪽에 남습니다.",
      complexity: "O(n²)"
    },
    {
      name: "선택 정렬 (Selection Sort)",
      desc: "리스트를 두 부분으로 나눕니다: 왼쪽에서 오른쪽으로 구축되는 정렬된 하위 리스트와 나머지 정렬되지 않은 부분입니다.",
      signature: "정렬되지 않은 부분에서 최솟값을 찾아 맨 앞(정렬되지 않은 부분의 시작)으로 보냅니다.",
      visualHint: "왼쪽 부분은 정렬되어 있고 가장 작은 수들로 채워져 있습니다. 오른쪽 부분은 완전히 무작위입니다.",
      complexity: "O(n²)"
    },
    {
      name: "삽입 정렬 (Insertion Sort)",
      desc: "최종 정렬된 배열을 한 번에 하나씩 구축합니다.",
      signature: "원소를 하나씩 가져와 이미 정렬된 부분의 올바른 위치에 삽입합니다.",
      visualHint: "카드 정렬과 비슷합니다. 왼쪽 부분은 그 자체로는 정렬되어 있지만, 전체 집합에서 가장 작은 수들이 아닐 수도 있습니다.",
      complexity: "O(n²)"
    },
    {
      name: "퀵 정렬 (Quick Sort)",
      desc: "'피벗' 원소를 선택하고 배열을 두 개의 하위 배열(피벗보다 작은 값과 큰 값)로 분할합니다.",
      signature: "재귀적 분할.",
      visualHint: "선형적으로 발견하기 어렵습니다. '피벗'을 찾아보세요. 피벗의 왼쪽은 모두 피벗보다 작고, 오른쪽은 모두 큽니다.",
      complexity: "O(n log n)"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {algorithms.map((algo) => (
        <div key={algo.name} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">{algo.name}</h3>
            <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-slate-400">{algo.complexity}</span>
          </div>
          
          <div className="space-y-4">
            <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">작동 원리</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{algo.desc}</p>
            </div>
            
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <h4 className="text-xs uppercase tracking-wider text-amber-500 font-bold mb-1">시각적 특징 (지문)</h4>
                <p className="text-slate-300 text-sm">{algo.signature}</p>
            </div>

            <div>
                 <h4 className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-1">탐정의 팁</h4>
                 <p className="text-slate-400 text-sm italic">"{algo.visualHint}"</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TheoryTab;