import React from 'react';
import { BookOpen, TrendingUp, Target } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          선형 회귀(Linear Regression)란?
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4 text-lg">
          데이터 탐정이 되어 오신 것을 환영합니다! 🕵️‍♀️ <br/>
          선형 회귀는 흩어져 있는 데이터들 사이에서 <strong>가장 합리적인 직선 하나</strong>를 찾는 방법입니다.
          이 직선을 통해 우리는 <strong>'추세'</strong>를 읽고, 미래를 <strong>'예측'</strong>할 수 있습니다.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-indigo-50 p-6 rounded-xl">
            <h3 className="font-bold text-indigo-900 mb-2 text-lg">핵심 용어</h3>
            <ul className="space-y-3 text-sm text-indigo-800">
              <li className="flex items-start gap-2">
                <span className="font-bold bg-indigo-200 px-2 py-0.5 rounded">독립변수 (x)</span>
                <span>원인이 되는 값 (예: 공부 시간)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold bg-indigo-200 px-2 py-0.5 rounded">종속변수 (y)</span>
                <span>결과가 되는 값 (예: 시험 성적)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold bg-indigo-200 px-2 py-0.5 rounded">잔차 (Residual)</span>
                <span>실제 값과 예측 값(직선)의 차이</span>
              </li>
            </ul>
          </div>
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="font-bold text-green-900 mb-2 text-lg">수식의 의미: y = ax + b</h3>
            <ul className="space-y-3 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="font-bold bg-green-200 px-2 py-0.5 rounded">a (기울기)</span>
                <span>x가 1 증가할 때 y가 얼마나 변하는가? (영향력)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold bg-green-200 px-2 py-0.5 rounded">b (절편)</span>
                <span>x가 0일 때의 기본값 (시작점)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          '평균으로의 회귀' 이야기
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          이 용어는 19세기 유전학자 프랜시스 골턴이 처음 사용했습니다. 
          그는 "키가 매우 큰 부모의 자녀는 부모보다 작아지는 경향이 있고, 
          키가 매우 작은 부모의 자녀는 부모보다 커지는 경향이 있다"는 것을 발견했습니다.
        </p>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <p className="text-orange-800 italic">
            "데이터는 결국 전체 평균으로 되돌아오려는 성질이 있다."
          </p>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;