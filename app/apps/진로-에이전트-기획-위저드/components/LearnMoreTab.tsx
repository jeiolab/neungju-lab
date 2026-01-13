import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, X } from 'lucide-react';

const LearnMoreTab: React.FC = () => {
  const [mode, setMode] = useState<'good' | 'bad'>('good');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">어떤 기획이 좋은 기획일까요?</h2>
        <p className="text-gray-600 mt-2">두 가지 사례를 비교하며 배워봅시다.</p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setMode('good')}
          className={`flex items-center px-6 py-3 rounded-full font-bold transition-all ${
            mode === 'good' 
            ? 'bg-green-100 text-green-700 ring-2 ring-green-500 shadow-md' 
            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <ThumbsUp size={18} className="mr-2" /> 좋은 기획 (Good)
        </button>
        <button
          onClick={() => setMode('bad')}
          className={`flex items-center px-6 py-3 rounded-full font-bold transition-all ${
            mode === 'bad' 
            ? 'bg-red-100 text-red-700 ring-2 ring-red-500 shadow-md' 
            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <ThumbsDown size={18} className="mr-2" /> 위험한 기획 (Risky)
        </button>
      </div>

      <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${mode === 'good' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <h3 className={`text-xl font-bold mb-4 flex items-center ${mode === 'good' ? 'text-green-800' : 'text-red-800'}`}>
          {mode === 'good' ? '✅ 균형 잡힌 진로 에이전트' : '🚫 무책임한 진로 에이전트'}
        </h3>
        
        <div className="space-y-4 bg-white p-5 rounded-xl bg-opacity-60">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">목표 (Goal)</span>
            <p className="text-gray-800 font-medium">
              {mode === 'good' 
                ? '"내 성적과 흥미를 분석해 적합한 학과 정보를 줘. 최종 결정은 내가 할게."' 
                : '"그냥 나한테 딱 맞는 직업 하나만 정해줘. 알아서 다 해줘."'}
            </p>
          </div>
          
          <div className="h-px bg-gray-200"></div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">데이터 (Data)</span>
            <p className="text-gray-800 font-medium">
              {mode === 'good' 
                ? '생활기록부는 민감하니까 익명화해서 처리하고, 필요 없으면 삭제해.' 
                : '내 모든 생기부, 일기, 카톡 대화 내용 다 가져가서 분석해.'}
            </p>
          </div>

          <div className="h-px bg-gray-200"></div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">역할 (Role)</span>
            <ul className="mt-2 space-y-1">
              {mode === 'good' ? (
                <>
                  <li className="flex items-center text-sm text-gray-700"><Check size={14} className="text-green-500 mr-2"/> AI: 정보 수집, 요약, 패턴 분석</li>
                  <li className="flex items-center text-sm text-gray-700"><Check size={14} className="text-green-500 mr-2"/> <b>인간: 정보의 사실 확인, 윤리적 판단, 최종 진로 결정</b></li>
                </>
              ) : (
                <>
                  <li className="flex items-center text-sm text-gray-700"><X size={14} className="text-red-500 mr-2"/> AI: 직업 결정, 판단, 조언 (모두 수행)</li>
                  <li className="flex items-center text-sm text-gray-700"><X size={14} className="text-red-500 mr-2"/> <b>인간: 결과만 수동적으로 받아들임 (역할 없음)</b></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-6 text-sm text-center font-medium opacity-75">
          {mode === 'good' 
            ? '💡 포인트: AI를 도구로 활용하되, 주체성은 인간에게 있습니다.' 
            : '⚠️ 위험: AI에게 판단을 위임하면 편향된 결과나 잘못된 인생 설계를 피할 수 없습니다.'}
        </div>
      </div>
    </div>
  );
};

export default LearnMoreTab;