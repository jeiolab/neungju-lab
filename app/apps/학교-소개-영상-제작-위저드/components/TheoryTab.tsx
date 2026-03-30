import React from 'react';
import { Layers, GitMerge, Calendar } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      {/* Concept 1 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Layers size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">문제 분해 (Decomposition)</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
            크고 무서워 보이는 문제를 작고 관리 가능한 조각으로 나누는 것입니다. 이상적으로는 각 조각을 한 사람이 짧은 시간 안에 해결할 수 있어야 합니다.
        </p>
        <div className="bg-slate-50 p-3 rounded text-xs text-slate-500">
            <strong>예시:</strong> "영상 제작" → "대본 작성", "촬영", "편집"으로 나누기.
        </div>
      </div>

      {/* Concept 2 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <GitMerge size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">의존 관계 (Dependencies)</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
            일의 논리적인 순서입니다. 어떤 일은 다른 일이 끝나야만 시작할 수 있습니다. 촬영을 하기도 전에 편집을 할 수는 없으니까요!
        </p>
        <div className="bg-slate-50 p-3 rounded text-xs text-slate-500">
            <strong>규칙:</strong> A → B라면, A는 <em>선행 작업</em>이고 B는 <em>후행 작업</em>입니다.
        </div>
      </div>

      {/* Concept 3 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <Calendar size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">일정 수립 (Scheduling)</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
            "누가", "무엇을", "언제" 할지 정하는 것입니다. 좋은 일정은 병목 현상을 피하고 팀원들이 동시에 일할 수 있게 해줍니다(병렬 처리).
        </p>
        <div className="bg-slate-50 p-3 rounded text-xs text-slate-500">
            <strong>목표:</strong> 모든 팀원이 공평하게 일하면서 제시간에 끝내는 것.
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;