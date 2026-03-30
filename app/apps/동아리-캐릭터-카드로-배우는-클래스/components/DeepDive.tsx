import React from 'react';
import { ArrowRight, Code } from 'lucide-react';

export const DeepDive: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">함수 vs 클래스: 선언과 사용</h2>
        <p className="text-slate-600 mb-6">
          우리가 함수를 미리 만들어두고 필요할 때 호출하는 것처럼, 
          클래스도 미리 정의해두고 필요할 때 객체로 만들어 사용합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Function Side */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-slate-600 text-sm flex items-center gap-2">
              <Code className="w-4 h-4" /> 함수 (Function)
            </div>
            <div className="p-4 bg-slate-50 font-mono text-xs sm:text-sm leading-relaxed">
              <div className="text-slate-400 mb-2">// 1. 함수 선언 (레시피 정의)</div>
              <div className="text-purple-600">function <span className="text-blue-600">createCard</span>(name) {'{'}</div>
              <div className="pl-4 text-slate-700">return `Card: ${'{'}name{'}'}`;</div>
              <div className="text-purple-600">{'}'}</div>
              
              <div className="my-4 border-t border-dashed border-slate-300"></div>

              <div className="text-slate-400 mb-2">// 2. 함수 호출 (요리하기)</div>
              <div className="text-slate-800">
                const card1 = <span className="text-blue-600">createCard</span>("철수");<br/>
                const card2 = <span className="text-blue-600">createCard</span>("영희");
              </div>
            </div>
          </div>

          {/* Class Side */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 font-bold text-indigo-800 text-sm flex items-center gap-2">
              <Code className="w-4 h-4" /> 클래스 (Class)
            </div>
            <div className="p-4 bg-white font-mono text-xs sm:text-sm leading-relaxed">
              <div className="text-slate-400 mb-2">// 1. 클래스 정의 (설계도 제작)</div>
              <div className="text-purple-600">class <span className="text-indigo-600">Card</span> {'{'}</div>
              <div className="pl-4 text-purple-600">constructor<span className="text-slate-700">(name)</span> {'{'}</div>
              <div className="pl-8 text-slate-700">this.name = name;</div>
              <div className="pl-4 text-purple-600">{'}'}</div>
              <div className="text-purple-600">{'}'}</div>

              <div className="my-4 border-t border-dashed border-slate-300"></div>

              <div className="text-slate-400 mb-2">// 2. 인스턴스화 (실체 만들기)</div>
              <div className="text-slate-800">
                const card1 = <span className="text-purple-600">new</span> <span className="text-indigo-600">Card</span>("철수");<br/>
                const card2 = <span className="text-purple-600">new</span> <span className="text-indigo-600">Card</span>("영희");
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 bg-indigo-50 p-4 rounded-xl text-indigo-900 text-sm font-medium text-center">
            <div>📜 정의(Definition)</div>
            <ArrowRight className="w-4 h-4 text-indigo-400 rotate-90 sm:rotate-0" />
            <div>✨ 생성/호출(Creation/Call)</div>
            <ArrowRight className="w-4 h-4 text-indigo-400 rotate-90 sm:rotate-0" />
            <div>🚀 활용(Usage)</div>
        </div>
      </div>
    </div>
  );
};
