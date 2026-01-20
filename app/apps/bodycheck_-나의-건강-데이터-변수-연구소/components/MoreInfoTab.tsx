import React from 'react';
import { Lightbulb, Search, AlertOctagon } from 'lucide-react';

const MoreInfoTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <Search className="mr-2" /> 더 깊이 알아보기
        </h2>
        <p className="opacity-90">
          단순한 변수 사용을 넘어, 컴퓨터가 데이터를 다루는 원리와 실수하기 쉬운 부분을 탐구합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Concept 1: Type Checking */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
             <span className="bg-slate-100 p-1.5 rounded mr-2">🐍</span>
             파이썬의 type() 함수 원리
          </h3>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            파이썬은 변수에 값이 들어갈 때, 그 값의 모양을 보고 자동으로 타입을 결정합니다(동적 타이핑). 
            <code>type()</code> 함수는 현재 변수가 가리키고 있는 데이터 객체의 '클래스' 정보를 반환해줍니다.
          </p>
          <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-300">
            <p>age = <span className="text-orange-400">20</span></p>
            <p>print(<span className="text-blue-400">type</span>(age))</p>
            <p className="text-slate-500 mt-1"># 출력: &lt;class 'int'&gt;</p>
          </div>
        </div>

        {/* Concept 2: Dynamic Typing */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
             <span className="bg-slate-100 p-1.5 rounded mr-2">⚖️</span>
             동적 타이핑의 장단점
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">장점:</span>
                <span className="text-slate-600">코드를 짤 때 타입을 일일이 지정하지 않아도 되어 빠르고 유연하게 개발할 수 있습니다.</span>
            </li>
            <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">단점:</span>
                <span className="text-slate-600">실행 도중에 예상치 못한 타입의 데이터가 들어오면 에러가 날 수 있습니다. (예: 숫자 + 문자)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Think About It Section */}
      <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
        <h3 className="text-xl font-bold text-amber-800 mb-6 flex items-center">
            <Lightbulb className="mr-2 fill-current" />
            생각해볼 문제
        </h3>
        
        <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-amber-200">
                <h4 className="font-bold text-slate-800 mb-2">Q1. 몸무게를 문자열("65.5")로 저장하면 어떤 문제가 생길까요?</h4>
                <div className="text-slate-600 text-sm space-y-2">
                    <p>힌트: "65.5" + 10 의 결과는 무엇일까요?</p>
                    <details className="cursor-pointer group">
                        <summary className="text-amber-600 font-bold text-xs mt-2 list-none flex items-center">
                            <span className="group-hover:underline">정답 보기</span>
                        </summary>
                        <p className="mt-2 p-2 bg-slate-100 rounded text-slate-700">
                            계산(산술 연산)이 불가능합니다! "65.5" + "10"을 하면 75.5가 아니라 "65.510"처럼 글자가 이어 붙여집니다.
                        </p>
                    </details>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-amber-200">
                <h4 className="font-bold text-slate-800 mb-2">Q2. 나이를 실수형(Float)으로 저장해야 할 때는 언제일까요?</h4>
                <div className="text-slate-600 text-sm space-y-2">
                    <p>힌트: 보통 나이는 정수(14살)지만, 신생아라면?</p>
                    <details className="cursor-pointer group">
                        <summary className="text-amber-600 font-bold text-xs mt-2 list-none flex items-center">
                            <span className="group-hover:underline">정답 보기</span>
                        </summary>
                        <p className="mt-2 p-2 bg-slate-100 rounded text-slate-700">
                            생후 2개월 된 아기를 표현할 때(0.16세)나, 평균 나이를 계산할 때(35.5세)는 정밀한 실수형이 필요할 수 있습니다.
                        </p>
                    </details>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoTab;
