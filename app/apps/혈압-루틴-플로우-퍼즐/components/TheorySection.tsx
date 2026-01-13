import React from 'react';
import { GitGraph, Repeat, GitMerge, ArrowDown } from 'lucide-react';

const TheorySection: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <GitGraph className="text-blue-600" />
          제어 구조란?
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          프로그램은 기본적으로 위에서 아래로 순서대로 실행됩니다(순차 구조). 
          하지만 상황에 따라 실행할 코드를 <strong>선택</strong>하거나, 특정 코드를 <strong>반복</strong>해야 할 때가 있습니다.
          이를 제어하는 것이 바로 제어 구조입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Selection Card */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <GitMerge size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">선택 구조 (Selection)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            "만약 ~라면(If)"이라는 질문을 통해 조건이 참(True)인지 거짓(False)인지에 따라 서로 다른 길로 가는 것입니다.
          </p>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm font-mono text-slate-700">
            <p className="text-purple-600">만약 (혈압 >= 140) 이면:</p>
            <p className="pl-4 text-red-600">→ "고혈압 주의" 출력</p>
            <p className="text-purple-600">아니면(Else):</p>
            <p className="pl-4 text-green-600">→ "정상" 출력</p>
          </div>
        </div>

        {/* Iteration Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <Repeat size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">반복 구조 (Iteration)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            특정 조건이 만족될 때까지 같은 행동을 되풀이하는 것입니다. "안정될 때까지 측정" 등이 예시입니다.
          </p>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm font-mono text-slate-700">
            <p className="text-purple-600">동안 (상태 == 불안정):</p>
            <p className="pl-4">→ 10분 휴식</p>
            <p className="pl-4">→ 혈압 재측정</p>
            <p className="text-slate-400">// 조건이 거짓이 되면 반복 종료</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900 mb-2">왜 혈압 측정에 제어 구조가 필요할까요?</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="mt-1 min-w-[20px]"><ArrowDown size={20} className="text-indigo-500" /></div>
            <p className="text-indigo-800 text-sm">사람마다 혈압 수치가 다릅니다. 수치에 따라 <strong>다른 진단(선택)</strong>을 내려야 합니다.</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 min-w-[20px]"><ArrowDown size={20} className="text-indigo-500" /></div>
            <p className="text-indigo-800 text-sm">수치가 너무 높으면 일시적인 현상일 수 있어 <strong>안정 후 다시 측정(반복)</strong>하는 과정이 필요합니다.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TheorySection;