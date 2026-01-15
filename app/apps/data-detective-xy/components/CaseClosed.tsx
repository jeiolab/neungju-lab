import React from 'react';

const CaseClosed: React.FC = () => {
  return (
    <div className="text-center space-y-8 animate-fadeIn max-w-2xl mx-auto pt-10">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 rounded-full"></div>
        <svg className="w-32 h-32 text-amber-500 relative z-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <div>
        <h2 className="text-4xl font-bold text-white mb-2">사건 종결 (CASE CLOSED)</h2>
        <p className="text-xl text-amber-500 font-mono">상태: 성공 (SUCCESSFUL)</p>
      </div>

      <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
        <p className="text-slate-300 mb-6 leading-relaxed">
            훌륭합니다, 탐정님. 당신은 데이터가 단순한 숫자가 아니라 지도라는 것을 증명했습니다. 
            <span className="text-white font-bold">변수 X</span>와 <span className="text-white font-bold">변수 Y</span>를 함께 배치함으로써, 
            육안으로는 보이지 않던 숨겨진 패턴을 밝혀냈습니다.
        </p>
        <p className="text-slate-400 italic text-sm">
            "세상은 뻔한 일들로 가득 차 있지만, 산점도 위에 올려놓기 전까지는 아무도 거들떠보지 않는다."
        </p>
      </div>

      <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded transition">
        새로운 수사 시작하기
      </button>
    </div>
  );
};

export default CaseClosed;
