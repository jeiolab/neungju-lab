import React, { useState, useRef, useEffect } from 'react';
import { generateCoachResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';

export const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '반갑습니다! 정보샘입니다. 2차원 리스트나 성적 관리 프로그램에 대해 궁금한 점이 있으신가요? 편하게 물어보세요.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => `${m.role === 'user' ? '사용자' : '모델'}: ${m.text}`);
    const response = await generateCoachResponse(userMsg, history);

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-[700px] h-[calc(100vh-200px)]">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 flex items-center space-x-3 shadow-md z-10 shrink-0">
          <div className="bg-blue-500 p-2 rounded-full text-white">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">정보샘과 상담</h3>
            <p className="text-slate-400 text-xs">언제든 물어보세요</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 min-h-0">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center space-x-2">
                <Loader2 className="animate-spin text-blue-500" size={16} />
                <span className="text-xs text-slate-500">답변 작성 중...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="예: 2차원 리스트가 왜 필요한가요?"
              className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};