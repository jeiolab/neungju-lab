import React, { useState } from 'react';
import { evaluateThinkingAnswer } from '../services/geminiService';
import { Brain, Send, User, Bot } from 'lucide-react';

const ThinkingTab: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const QUESTION = "만약 세상의 모든 유선 케이블(해저 케이블 포함)이 하루아침에 사라진다면, 우리 생활에는 어떤 문제가 발생할까요?";

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    setIsLoading(true);
    setFeedback(null);
    
    const result = await evaluateThinkingAnswer(QUESTION, answer);
    
    setFeedback(result);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 pb-4 border-b border-gray-100">
                <Brain className="w-8 h-8 text-pink-500" />
                AI 선생님과 토론하기
            </h2>

            {/* Tutor Message */}
            <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Bot className="w-7 h-7 text-blue-600" />
            </div>
            <div className="bg-white p-6 rounded-2xl rounded-tl-none shadow-sm border border-gray-200 text-gray-800 leading-relaxed max-w-2xl">
                <p className="font-bold text-blue-600 mb-3 text-sm tracking-wide uppercase">오늘의 주제</p>
                <p className="text-lg font-medium mb-4">{QUESTION}</p>
                <p className="text-gray-500 text-sm">
                인터넷 속도, 국제 전화, 금융 거래, 혹은 넷플릭스 시청 등 구체적인 예시를 들어 설명해주면 더 좋아요!
                </p>
            </div>
            </div>

            {/* User Answer Display (if submitted) */}
            {feedback && (
            <div className="flex gap-4 flex-row-reverse animate-fade-in-up">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                <User className="w-7 h-7 text-gray-500" />
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl rounded-tr-none border border-gray-200 text-gray-800 max-w-2xl">
                {answer}
                </div>
            </div>
            )}

            {/* AI Feedback */}
            {feedback && (
            <div className="flex gap-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Bot className="w-7 h-7 text-blue-600" />
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl rounded-tl-none shadow-sm border border-blue-100 text-gray-800 leading-relaxed max-w-2xl">
                <p className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    선생님의 피드백
                </p>
                <div className="prose prose-blue max-w-none text-sm">
                    {feedback}
                </div>
                </div>
            </div>
            )}
        </div>
      </div>

      {/* Input Area (Fixed at bottom of this tab) */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto">
            {!feedback ? (
                <div className="relative">
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="여기에 자유롭게 생각을 적어보세요..."
                    className="w-full resize-none p-4 pr-16 outline-none text-base rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all h-32"
                />
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading || !answer.trim()}
                    className={`absolute bottom-3 right-3 p-3 rounded-xl transition-all duration-200
                    ${isLoading || !answer.trim() 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md'}`}
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Send size={20} />}
                </button>
                </div>
            ) : (
                <button 
                onClick={() => { setFeedback(null); setAnswer(''); }}
                className="w-full py-4 text-blue-700 font-bold bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2 group"
                >
                <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
                다른 생각으로 다시 도전하기
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ThinkingTab;