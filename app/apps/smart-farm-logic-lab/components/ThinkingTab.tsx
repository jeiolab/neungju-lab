import React, { useState } from 'react';
import { evaluateThinkingAnswer } from '../services/geminiService';

const ThinkingTab: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scenario = "스마트팜 온도 센서가 갑자기 고장 나서 '999도'라는 비정상적인 값을 출력했습니다. 만약 당신의 코드가 `if (temp > 30) { fan_on() }`라고만 되어 있다면 어떤 문제가 발생할까요? 그리고 이를 해결하려면 코드를 어떻게 수정해야 할까요?";

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const result = await evaluateThinkingAnswer(answer, scenario);
      setFeedback(result);
    } catch (e) {
      setFeedback("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col p-4">
      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span>🤔</span> 생각해볼 문제: 예외 처리
        </h2>
        <p className="text-indigo-100 leading-relaxed">
          {scenario}
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="여기에 당신의 해결책을 적어보세요... (예: 999도는 현실적으로 불가능하니 센서 오류로 판단하고 관리자에게 알림을 보낸다)"
          className="flex-1 w-full p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none text-slate-700"
        />
        
        <button
          onClick={handleSubmit}
          disabled={loading || !answer.trim()}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2
            ${loading || !answer.trim() 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:-translate-y-1'
            }`}
        >
          {loading ? (
             <>
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               멘토가 답변을 분석 중입니다...
             </>
          ) : (
            '제출하고 멘토 피드백 받기'
          )}
        </button>
      </div>

      {feedback && (
        <div className="mt-6 bg-white border-l-4 border-emerald-500 rounded-xl shadow-lg p-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
              👨‍🏫
            </div>
            <div>
              <h3 className="font-bold text-slate-800">엔지니어링 멘토의 피드백</h3>
              <p className="text-xs text-slate-400">AI Generated Response</p>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {feedback}
          </p>
        </div>
      )}
    </div>
  );
};

export default ThinkingTab;