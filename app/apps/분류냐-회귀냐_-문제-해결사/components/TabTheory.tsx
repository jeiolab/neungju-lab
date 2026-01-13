import React from 'react';
import { ScanSearch, TrendingUp, CheckCircle2 } from 'lucide-react';

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">분류 vs 회귀: 핵심 정리</h2>
        <p className="opacity-90">머신러닝 지도학습의 두 기둥을 완벽하게 이해해봅시다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Classification Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-indigo-500">
          <div className="flex items-center mb-4 text-indigo-600">
            <ScanSearch className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">분류 (Classification)</h3>
          </div>
          <p className="text-gray-700 mb-4 font-medium">
            "이것은 A인가, B인가?"
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-indigo-400" />
              <span>결과가 딱 떨어지는 <strong>카테고리(범주)</strong>입니다.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-indigo-400" />
              <span>예: 개/고양이, 합격/불합격, 스팸/정상</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-indigo-400" />
              <span><strong>이산적인(Discrete)</strong> 값을 예측합니다.</span>
            </li>
          </ul>
        </div>

        {/* Regression Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-pink-500">
          <div className="flex items-center mb-4 text-pink-600">
            <TrendingUp className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">회귀 (Regression)</h3>
          </div>
          <p className="text-gray-700 mb-4 font-medium">
            "얼마나 많이? 얼마나 높게?"
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-pink-400" />
              <span>결과가 <strong>연속적인 숫자(수치)</strong>입니다.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-pink-400" />
              <span>예: 내일 기온(23.5도), 아파트 가격, 주식 시세</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-pink-400" />
              <span><strong>연속적인(Continuous)</strong> 값을 예측합니다.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
        <h4 className="font-bold text-yellow-800 mb-2">💡 선생님의 꿀팁</h4>
        <p className="text-yellow-700 text-sm">
          헷갈릴 땐 <strong>"두 값 사이에 중간값이 존재하는가?"</strong>를 생각해보세요.<br/>
          성적 A와 B 사이엔 등급이 없지만(분류), 80점과 81점 사이엔 80.5점이 존재하죠(회귀)!
        </p>
      </div>
    </div>
  );
};

export default TabTheory;
