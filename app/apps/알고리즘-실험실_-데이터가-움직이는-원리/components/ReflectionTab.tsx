import React, { useState } from 'react';
import { generateReflectionResponse } from '../services/geminiService';
import { Sparkles, MessageCircle, Send, Loader2 } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "왜 정렬이 중요한가요?",
  "데이터가 100만 개라면 어떤 정렬을 써야 하나요?",
  "실생활에서 정렬이 쓰이는 예시는?",
  "가장 빠른 정렬 알고리즘은 무엇인가요?"
];

const ReflectionTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    {
      role: 'ai',
      text: "안녕! 나는 알고리즘 튜터야. 정렬에 대해 궁금한 점이 있니? '왜 정렬을 해야 해?' 같은 근본적인 질문도 좋아!"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user' as const, text };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Provide some context about what user has seen
    const context = "사용자는 버블 정렬, 선택 정렬, 삽입 정렬의 시각화 도구를 체험했습니다.";
    
    const response = await generateReflectionResponse(text, context);
    
    setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-4 text-white flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-300"/>
            <h3 className="font-bold">생각해볼 문제 (AI 튜터)</h3>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                        <Loader2 className="animate-spin" size={16}/>
                        답변을 생각하는 중...
                    </div>
                 </div>
            )}
        </div>

        {/* Suggestions */}
        <div className="p-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, i) => (
                <button 
                    key={i} 
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="flex-shrink-0 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 rounded-full transition-colors whitespace-nowrap"
                >
                    {q}
                </button>
            ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="궁금한 점을 물어보세요..."
                className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
            />
            <button 
                onClick={() => handleSend(input)}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
                <Send size={18} />
            </button>
        </div>
    </div>
  );
};

export default ReflectionTab;