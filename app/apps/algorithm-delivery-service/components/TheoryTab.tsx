import React from 'react';
import { Search, ArrowRight, ArrowDownUp, Clock } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
      
      {/* Introduction */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">어떤 방법으로 물건을 찾으시겠습니까?</h2>
        <p className="text-lg text-slate-600">
          물류 센터의 핵심은 <span className="text-amber-600 font-bold">비용(시간)</span> 절약입니다.
          상황에 맞는 최적의 알고리즘을 선택하는 것이 관리자의 능력입니다.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Linear Search */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">순차 탐색 (Linear Search)</h3>
          <p className="text-slate-600 text-sm mb-4">
            정리되지 않은 상자 더미에서 하나씩 뒤져가며 찾는 방식입니다.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2 mt-1 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
              <span><span className="font-bold">전제 조건:</span> 없음 (데이터가 막 섞여 있어도 됨)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
              <span><span className="font-bold">비용:</span> O(N) - 데이터 양에 비례해서 느려짐</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
              <span><span className="font-bold">장점:</span> 사전 준비(정렬)가 필요 없음. 1~2개 찾을 때 유리.</span>
            </li>
          </ul>
        </div>

        {/* Binary Search */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
            <ArrowDownUp size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">이진 탐색 (Binary Search)</h3>
          <p className="text-slate-600 text-sm mb-4">
            정렬된 상태에서 범위를 절반씩 줄여가며 찾는 스마트한 방식입니다.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2 mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              <span><span className="font-bold">전제 조건:</span> 반드시 <span className="text-blue-600">정렬(Sort)</span>되어 있어야 함.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              <span><span className="font-bold">비용:</span> O(log N) - 데이터가 많아져도 속도가 거의 일정함</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              <span><span className="font-bold">단점:</span> 정렬하는 데 큰 비용(시간)이 듬.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* The Trade-off Visual */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Clock className="mr-2 text-amber-600" /> 언제 정렬해야 할까요?
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-center p-4 bg-white rounded-lg border border-slate-200 flex-1 w-full">
            <p className="font-bold text-slate-700 mb-2">검색 횟수가 적을 때</p>
            <p className="text-slate-500">
              정렬 비용 {'>'} 검색 절약 비용 <br/>
              <span className="text-red-500 font-bold">그냥 찾는 게 빠름</span>
            </p>
          </div>
          <ArrowRight className="text-slate-300 hidden md:block" />
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200 flex-1 w-full">
            <p className="font-bold text-amber-800 mb-2">분기점 (Break-even Point)</p>
            <p className="text-amber-700">
              정렬 비용이 상쇄되는 지점
            </p>
          </div>
          <ArrowRight className="text-slate-300 hidden md:block" />
           <div className="text-center p-4 bg-white rounded-lg border border-slate-200 flex-1 w-full">
            <p className="font-bold text-slate-700 mb-2">검색 횟수가 많을 때</p>
            <p className="text-slate-500">
              정렬 비용 {'<'} 검색 절약 비용 <br/>
              <span className="text-blue-500 font-bold">정렬해두는 게 이득</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;