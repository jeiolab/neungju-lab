import React from 'react';
import { Search, AlertTriangle, Database } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">왜 데이터 전처리를 할까?</h2>
        <p className="text-indigo-100">
          "Garbage In, Garbage Out!"<br/>
          쓰레기 데이터가 들어가면 쓰레기 결과가 나옵니다. 우리는 탐정처럼 데이터를 씻겨줘야 합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">결측치 (Missing Value)</h3>
          </div>
          <p className="text-slate-600 mb-4">
            데이터가 비어있는 값입니다. 설문조사에서 답변을 안 했거나, 시스템 오류로 기록되지 않은 경우입니다.
          </p>
          <div className="bg-slate-50 p-3 rounded text-sm text-slate-500">
            <strong>예시:</strong> 키 입력란이 비어있음 (NULL, NaN)
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-l-4 border-rose-500 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">이상치 (Outlier)</h3>
          </div>
          <p className="text-slate-600 mb-4">
            정상 범위를 크게 벗어난 값입니다. 입력 실수일 수도 있고, 아주 특이한 케이스일 수도 있습니다.
          </p>
          <div className="bg-slate-50 p-3 rounded text-sm text-slate-500">
            <strong>예시:</strong> 고등학생 키가 999cm 혹은 -10cm
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          주요 처리 전략
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="font-bold text-indigo-600 w-24 flex-shrink-0">삭제 (Drop)</span>
            <span className="text-slate-600">문제가 있는 행을 아예 지워버립니다. 데이터가 충분할 때 좋습니다.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-indigo-600 w-24 flex-shrink-0">평균 (Mean)</span>
            <span className="text-slate-600">전체 평균값으로 채웁니다. 하지만 이상치가 있으면 평균도 오염될 수 있습니다.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-indigo-600 w-24 flex-shrink-0">중앙값 (Median)</span>
            <span className="text-slate-600">순서대로 나열했을 때 가운데 값입니다. 이상치의 영향을 덜 받습니다.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-indigo-600 w-24 flex-shrink-0">최빈값 (Mode)</span>
            <span className="text-slate-600">가장 자주 나온 값입니다. 옷 사이즈 같은 범주형 데이터에 씁니다.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TheoryTab;
