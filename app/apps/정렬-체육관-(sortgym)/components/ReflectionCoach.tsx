import React, { useState } from 'react';
import { getReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const TOPIC = "데이터의 양이 적을 때와 많을 때, 각각 어떤 정렬을 선택해야 효율적일까요?";

const ReflectionCoach: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const result = await getReflectionFeedback(TOPIC, answer);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 h-full pb-20">
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
        <h2 className="text-2xl font-bold mb-2 flex items-center">
           <MessageSquare className="mr-2" /> 오늘의 생각할 거리
        </h2>
        <p className="text-indigo-100 text-lg">{TOPIC}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">나의 답변 작성하기</label>
          <textarea
            className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="자신의 생각을 자유롭게 적어보세요..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !answer}
              className={`flex items-center px-6 py-3 rounded-lg font-bold transition-all
                ${loading || !answer 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                }
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  코치 분석 중...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="mr-2" />
                  AI 코치에게 피드백 받기
                </>
              )}
            </button>
          </div>
        </div>

        {feedback && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-indigo-100 p-8 animate-fade-in relative">
            <div className="absolute top-0 left-8 -mt-3 bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded">
              Coach Feedback
            </div>
            <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {feedback}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionCoach;
