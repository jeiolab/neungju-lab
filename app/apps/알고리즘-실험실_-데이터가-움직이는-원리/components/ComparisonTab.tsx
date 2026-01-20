import React from 'react';

const ComparisonTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4">특징</th>
              <th scope="col" className="px-6 py-4 text-indigo-600">버블 정렬</th>
              <th scope="col" className="px-6 py-4 text-indigo-600">선택 정렬</th>
              <th scope="col" className="px-6 py-4 text-indigo-600">삽입 정렬</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b hover:bg-slate-50">
              <th scope="row" className="px-6 py-4 font-medium text-slate-900">비교 횟수</th>
              <td className="px-6 py-4">많음 (항상 O(n²))</td>
              <td className="px-6 py-4">많음 (항상 O(n²))</td>
              <td className="px-6 py-4">상황에 따라 다름 (최선 O(n))</td>
            </tr>
            <tr className="bg-white border-b hover:bg-slate-50">
              <th scope="row" className="px-6 py-4 font-medium text-slate-900">교환(이동) 횟수</th>
              <td className="px-6 py-4">매우 많음</td>
              <td className="px-6 py-4">적음 (회전마다 1회)</td>
              <td className="px-6 py-4">많을 수 있음 (밀어내기)</td>
            </tr>
            <tr className="bg-white border-b hover:bg-slate-50">
              <th scope="row" className="px-6 py-4 font-medium text-slate-900">최적의 상황</th>
              <td className="px-6 py-4">구현이 쉬움</td>
              <td className="px-6 py-4">교환 비용이 비쌀 때</td>
              <td className="px-6 py-4">이미 거의 정렬되어 있을 때</td>
            </tr>
            <tr className="bg-white hover:bg-slate-50">
              <th scope="row" className="px-6 py-4 font-medium text-slate-900">안정성 (Stable)</th>
              <td className="px-6 py-4 text-green-600 font-bold">안정 (Stable)</td>
              <td className="px-6 py-4 text-red-500 font-bold">불안정 (Unstable)</td>
              <td className="px-6 py-4 text-green-600 font-bold">안정 (Stable)</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-sm">
        <strong>💡 안정성(Stability)이란?</strong><br/>
        값이 같은 데이터가 있을 때, 정렬 전의 순서가 정렬 후에도 유지되는지를 의미합니다. 
        예를 들어 점수가 같은 학생이 두 명일 때, 먼저 입력된 학생이 정렬 후에도 앞에 있다면 '안정 정렬'입니다.
      </div>
    </div>
  );
};

export default ComparisonTab;