import React from 'react';
import { BookOpen, Scissors, Layers } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          퀵 정렬(Quick Sort)이란?
        </h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-6">
          퀵 정렬은 매우 효율적인 정렬 알고리즘으로, 
          <span className="font-bold text-indigo-600"> 분할 정복(Divide and Conquer)</span> 알고리즘에 기반을 두고 있습니다.
          리스트에서 '피벗(Pivot)'이라는 기준 원소를 하나 선택하고, 이 피벗보다 작은 값들은 왼쪽으로, 
          큰 값들은 오른쪽으로 나누어(Partitioning) 정렬하는 방식입니다.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              전략: 분할 (Divide)
            </h3>
            <p className="text-indigo-900/80">
              <strong>피벗(Pivot)</strong>을 선택합니다. 피벗보다 작은 값은 피벗의 앞으로, 큰 값은 뒤로 가도록 배열을 재배치합니다.
            </p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              전략: 정복 (Conquer)
            </h3>
            <p className="text-emerald-900/80">
              나뉘어진 두 개의 부분 배열(왼쪽, 오른쪽)에 대해 재귀적(Recursively)으로 같은 과정을 반복합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">알고리즘 단계</h3>
        <ol className="list-decimal list-inside space-y-4 text-slate-700 text-lg">
          <li className="pl-2"><span className="font-semibold text-slate-900">피벗 선택:</span> 리스트에서 기준이 될 원소 하나를 고릅니다.</li>
          <li className="pl-2"><span className="font-semibold text-slate-900">분할 (Partitioning):</span> 피벗을 기준으로 작은 값은 왼쪽, 큰 값은 오른쪽으로 옮깁니다.</li>
          <li className="pl-2"><span className="font-semibold text-slate-900">재귀 (Recursion):</span> 왼쪽 부분 리스트와 오른쪽 부분 리스트에 대해 위 과정을 반복합니다.</li>
        </ol>
      </div>
    </div>
  );
};