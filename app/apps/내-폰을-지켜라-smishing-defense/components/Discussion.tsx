import React, { useState, useRef, useEffect } from 'react';
import { chatWithConsultant } from '../services/geminiService';
import { Send, User, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const Discussion: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: '안녕하세요! 화이트 해커 보안 컨설턴트입니다. "내 폰이 털렸다면 가장 먼저 무엇을 해야 할까요?" 또는 기타 보안 관련 궁금한 점을 물어보세요.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => `${m.role}: ${m.content}`);
    const botReply = await chatWithConsultant(history, userMsg);

    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
      <div className="bg-slate-900 p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-orange-400">보안 컨설턴트 챗봇</h2>
        <p className="text-xs text-slate-400">무엇이든 물어보세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <Bot size={18} className="text-white" />
                    </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-700 text-slate-200 rounded-tl-none'
                }`}>
                    {msg.content}
                </div>
                {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-white" />
                    </div>
                )}
            </div>
        ))}
        {isTyping && (
             <div className="flex gap-3 justify-start animate-pulse">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                     <Bot size={18} className="text-white" />
                </div>
                <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none text-slate-400 text-xs flex items-center">
                    입력 중...
                </div>
             </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-700 flex gap-2">
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: '스미싱 문자를 받았을 때 대처법은?'"
            className="flex-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
        />
        <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
            <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Discussion;