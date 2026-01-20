import React from 'react';
import { BIG_O_CARDS } from '../constants';
import { Scale, RefreshCw, Zap } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">정렬 알고리즘, 왜 중요할까?</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          컴퓨터 과학에서 데이터 정렬은 가장 기본적이면서도 중요한 문제입니다. 
          데이터가 10개일 때는 차이가 없지만, 100만 개가 되면 알고리즘에 따라 처리 시간이 
          <strong>1초</strong>가 될 수도, <strong>10일</strong>이 될 수도 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">비교 (Comparison)</h3>
            <p className="text-slate-600 text-sm">
                두 데이터를 확인하여 어떤 것이 더 큰지 판단하는 작업입니다. 
                비교 횟수가 많을수록 CPU가 더 많은 질문을 던져야 합니다.
            </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="text-red-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">교환 (Swap)</h3>
            <p className="text-slate-600 text-sm">
                두 데이터의 위치를 실제로 바꾸는 작업입니다. 
                메모리 쓰기 작업이 포함되므로, 데이터가 클수록(예: 무거운 화물) 비용이 매우 비쌉니다.
            </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-yellow-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">시간 복잡도 (Big O)</h3>
            <p className="text-slate-600 text-sm">
                데이터 개수(n)가 늘어날 때, 필요한 작업량이 얼마나 가파르게 늘어나는지를 나타내는 척도입니다.
            </p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Big O 카드</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BIG_O_CARDS.map((card, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="text-6xl font-black text-slate-900">{card.title.replace('O(', '').replace(')', '')}</span>
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 mb-1">{card.title}</h4>
                        <p className="text-xs font-mono text-slate-500 mb-4">{card.complexity}</p>
                        <p className="text-slate-700 text-sm mb-4 leading-relaxed">{card.description}</p>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <span className="text-xs font-bold text-indigo-600 uppercase">Analogy</span>
                            <p className="text-slate-600 text-xs mt-1 italic">"{card.analogy}"</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-indigo-700 flex items-center mb-2">
              <Scale className="w-5 h-5 mr-2" />
              생각해볼 문제: Trade-off
          </h3>
          <p className="text-slate-700 mb-4">
              "교환 비용이 매우 비싼 시스템(예: 컨테이너 항구에서 크레인으로 무거운 화물 옮기기)에서는 어떤 정렬이 유리할까요?"
          </p>
          <div className="bg-white p-4 rounded-lg text-sm text-slate-600 border border-slate-200">
              <p>
                <strong>정답 힌트:</strong> 선택 정렬(Selection Sort)은 비교는 많이 하지만, 교환 횟수는 <strong>최대 n번</strong>으로 제한됩니다. 
                반면 퀵 정렬이나 버블 정렬은 교환이 훨씬 빈번하게 일어날 수 있습니다. 
                따라서 '옮기는 비용'이 '비교하는(쳐다보는) 비용'보다 압도적으로 크다면 선택 정렬이 가장 경제적일 수 있습니다.
              </p>
          </div>
      </div>
    </div>
  );
};

export default TheoryTab;
