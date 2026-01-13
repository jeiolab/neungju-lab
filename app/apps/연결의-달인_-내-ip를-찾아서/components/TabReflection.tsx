import React, { useState } from 'react';
import { generateMentorFeedback } from '../services/geminiService';
import { Bot, Send, Sparkles } from 'lucide-react';

export const TabReflection: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    setHasSubmitted(true);
    
    try {
      const response = await generateMentorFeedback(userInput);
      setAiResponse(response);
    } catch (error) {
      setAiResponse("죄송해요, 지금은 AI 사수와 연결이 어렵네요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">생각해보기</h2>
        <p className="text-slate-600 mt-2">네트워크 관리자로서 상상력을 펼쳐보세요.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="mb-6">
          <label className="block text-lg font-medium text-slate-800 mb-2">
            Q. 만약 세상의 모든 IP 주소가 고갈된다면 어떤 일이 벌어질까요?
          </label>
          <p className="text-sm text-slate-500 mb-4">
            새로운 기기는 인터넷에 연결할 수 없게 될까요? 아니면 획기적인 기술이 등장할까요? 자유롭게 상상해서 적어보세요.
          </p>
          <textarea 
            className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            placeholder="제 생각에는..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={hasSubmitted && isLoading}
          />
        </div>

        {!hasSubmitted || (hasSubmitted && !aiResponse && !isLoading) ? (
          <button 
            onClick={handleSubmit}
            disabled={!userInput.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            AI 사수에게 의견 보내기
          </button>
        ) : null}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 flex flex-col items-center justify-center text-slate-500 py-8 animate-pulse">
            <Bot size={48} className="text-indigo-400 mb-4" />
            <p>AI 사수가 답변을 읽고 있어요...</p>
          </div>
        )}

        {/* AI Response */}
        {aiResponse && !isLoading && (
          <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative animate-fade-in-up">
            <div className="absolute -top-4 left-6 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Bot size={14} /> AI 사수 피드백
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 hidden sm:block">
                 <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700">
                    <Sparkles size={24} />
                 </div>
              </div>
              <div className="prose prose-indigo text-slate-700 text-sm leading-relaxed">
                {aiResponse}
              </div>
            </div>
            
            <button 
              onClick={() => {
                setHasSubmitted(false);
                setAiResponse('');
                setUserInput('');
              }}
              className="mt-4 text-xs text-indigo-500 hover:text-indigo-700 underline"
            >
              다른 의견 보내기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};