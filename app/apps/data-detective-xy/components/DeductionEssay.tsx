import React, { useState } from 'react';
import { evaluateDeduction } from '../services/geminiService';

const DeductionEssay: React.FC = () => {
  const [essay, setEssay] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!essay.trim()) return;
    setLoading(true);
    setFeedback(null);
    
    const result = await evaluateDeduction(essay);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 animate-fadeIn">
      <div className="space-y-6">
        <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-amber-500">
          <h2 className="text-2xl font-bold text-white mb-2">최종 추리 (Final Deduction)</h2>
          <p className="text-slate-300 mb-4">
            탐정님, 최종 보고서를 제출하세요. 다음 내용을 고려하여 작성해주세요:
          </p>
          <div className="bg-slate-900 p-4 rounded text-amber-100 italic">
            "우리는 펭귄을 부리 길이(1차원)만으로 분류하려 했지만 뒤죽박죽이었습니다. 하지만 날개 길이(2차원)를 추가하자 그룹이 명확해졌습니다. 왜 이런 일이 일어났을까요?"
          </div>
        </div>

        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="여기에 추리 내용을 입력하세요..."
          className="w-full h-48 bg-slate-800 text-white p-4 rounded border border-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || essay.length < 10}
          className={`w-full py-3 rounded font-bold text-lg transition ${
            loading || essay.length < 10
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/50'
          }`}
        >
          {loading ? '본부(HQ)에 자문 구하는 중...' : '보고서 제출'}
        </button>
      </div>

      <div className="relative">
        <div className="bg-slate-800 h-full p-6 rounded-lg border border-slate-700 flex flex-col items-center justify-center text-center">
            {!feedback && !loading && (
                <div className="opacity-30">
                    <svg className="w-24 h-24 mx-auto mb-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-slate-400">보고서 제출 대기 중...</p>
                </div>
            )}

            {loading && (
                 <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-4 bg-amber-500 rounded-full mb-2 animate-bounce"></div>
                    <p className="text-amber-500 font-mono text-sm">논리 패턴 분석 중...</p>
                 </div>
            )}

            {feedback && (
                <div className="w-full text-left animate-slideUp">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold">
                            AI
                        </div>
                        <div>
                            <p className="text-white font-bold">수석 탐정 (Senior Detective)</p>
                            <p className="text-xs text-slate-400">자동 피드백 유닛</p>
                        </div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-slate-200 leading-relaxed font-mono text-sm">
                        {feedback}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DeductionEssay;
