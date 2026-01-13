import React, { useState } from 'react';
import { getReflectionFeedback } from '../services/geminiService';
import { PenTool, Sparkles } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const result = await getReflectionFeedback(text);
      setFeedback(result);
    } catch (e) {
      setFeedback("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
          <PenTool className="mr-2 text-indigo-500" /> 생각해볼 문제
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          나의 일상(공부, 동아리, 친구관계 등)에서 하나를 골라, 
          어떤 부분을 <span className="text-blue-600 font-bold">AI</span>에게 맡기고 
          어떤 부분을 <span className="text-orange-600 font-bold">내</span>가 할지 적어보세요.
        </p>
        
        <textarea
          className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-gray-700 bg-gray-50"
          placeholder="예: 영어 단어 암기는 AI가 만든 퀴즈로 하고, 친구에게 생일 편지를 쓸 때는 내가 직접 진심을 담아 쓸 거야. 왜냐하면..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI 선생님 분석 중...
                </span>
            ) : (
                <>
                    <Sparkles size={18} className="mr-2" />
                    AI 피드백 받기
                </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-md animate-pop">
          <h3 className="font-bold text-indigo-800 mb-3 flex items-center">
             <img src="https://api.iconify.design/noto:robot.svg" className="w-6 h-6 mr-2" alt="AI"/> 
             AI 선생님의 피드백
          </h3>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;
