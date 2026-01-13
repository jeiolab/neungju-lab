import React from 'react';
import { ArrowRight, Cpu, Thermometer, Volume2 } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg p-8 border-l-8 border-blue-500">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">🎓</span>
          화재 감지 시스템의 구조
        </h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          컴퓨터 시스템은 기본적으로 <strong>입력(Input)</strong>, <strong>처리(Process)</strong>, <strong>출력(Output)</strong>의 3단계를 거칩니다. 화재 경보기 또한 작은 컴퓨터와 같습니다.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
          {/* Input */}
          <div className="flex flex-col items-center bg-blue-50 p-6 rounded-xl w-full md:w-1/3 border border-blue-100 transition hover:-translate-y-1 duration-300">
            <Thermometer className="w-12 h-12 text-blue-500 mb-3" />
            <h3 className="font-bold text-lg text-slate-700">입력 (Input)</h3>
            <p className="text-sm text-center text-slate-500 mt-2">주변 환경의 데이터를 수집합니다.</p>
            <div className="mt-4 bg-white px-3 py-1 rounded text-xs font-mono text-blue-600 border border-blue-200">
              현재 온도: 24°C
            </div>
          </div>

          <ArrowRight className="w-8 h-8 text-slate-400 rotate-90 md:rotate-0" />

          {/* Process */}
          <div className="flex flex-col items-center bg-indigo-50 p-6 rounded-xl w-full md:w-1/3 border border-indigo-100 transition hover:-translate-y-1 duration-300">
            <Cpu className="w-12 h-12 text-indigo-500 mb-3" />
            <h3 className="font-bold text-lg text-slate-700">처리 (Process)</h3>
            <p className="text-sm text-center text-slate-500 mt-2">조건에 따라 판단합니다.</p>
            <div className="mt-4 bg-white px-3 py-1 rounded text-xs font-mono text-indigo-600 border border-indigo-200">
              if (온도 &gt; 50) &#123; 경보() &#125;
            </div>
          </div>

          <ArrowRight className="w-8 h-8 text-slate-400 rotate-90 md:rotate-0" />

          {/* Output */}
          <div className="flex flex-col items-center bg-red-50 p-6 rounded-xl w-full md:w-1/3 border border-red-100 transition hover:-translate-y-1 duration-300">
            <Volume2 className="w-12 h-12 text-red-500 mb-3" />
            <h3 className="font-bold text-lg text-slate-700">출력 (Output)</h3>
            <p className="text-sm text-center text-slate-500 mt-2">결과를 사용자에게 알립니다.</p>
            <div className="mt-4 bg-white px-3 py-1 rounded text-xs font-mono text-red-600 border border-red-200">
              🚨 사이렌 울림
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="font-bold text-yellow-800 text-lg mb-2">💡 핵심 포인트: 조건문 (Conditional Logic)</h3>
        <p className="text-yellow-700 text-sm">
          화재 경보기의 핵심은 <strong>"만약 ~라면(If)"</strong>이라는 조건문입니다.<br/>
          엔지니어는 이 조건을 얼마나 정교하게 설정하느냐에 따라 진짜 화재와 오작동을 구분할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default TheoryTab;
