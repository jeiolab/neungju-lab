import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send } from 'lucide-react';
import { getReflectionFeedback } from '../services/geminiService';

const ReflectionTab: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const predefinedQuestion = "아이스크림 판매량은 온도에만 영향을 받을까? 다른 변수는 없을까?";

  const handlePredefinedClick = () => {
    setUserInput(predefinedQuestion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    setResponse(null);
    
    const result = await getReflectionFeedback(userInput);
    
    setResponse(result || null);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-300" />
          생각해볼 문제
        </h2>
        <p className="text-indigo-100 leading-relaxed mb-6">
          선형 회귀는 강력하지만 만능은 아닙니다. 
          데이터 뒤에 숨겨진 진짜 이야기를 찾기 위해서는 질문을 던져야 합니다.
          여러분의 생각을 적어주시면 AI 선생님이 피드백을 드립니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-4">
           <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">추천 질문</span>
           <button 
             onClick={handlePredefinedClick}
             className="block mt-2 text-left text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition"
           >
             "{predefinedQuestion}"
           </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="예: 온도 말고도 휴일 여부나 가격 할인 행사도 중요할 것 같아요."
            className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition resize-none text-gray-700"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition ${
                loading || !userInput.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   생각하는 중...
                 </>
              ) : (
                 <>
                   <Send className="w-4 h-4" /> 질문하기
                 </>
              )}
            </button>
          </div>
        </form>
      </div>

      {response && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 animate-fade-in-up">
          <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
             </div>
             <div className="prose prose-indigo max-w-none text-gray-700">
                <h3 className="font-bold text-gray-900 text-lg mb-2">AI 튜터의 답변</h3>
                <div className="whitespace-pre-wrap leading-relaxed">{response}</div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;