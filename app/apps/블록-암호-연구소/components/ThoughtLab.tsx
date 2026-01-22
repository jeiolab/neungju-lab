import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { askSeniorStudent } from '../services/geminiService';
import { MessageSquare, Send, Bot, User } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "컴퓨터는 왜 10진수 대신 2진수를 쓰나요?",
  "암호 키를 잃어버리면 어떻게 되나요?",
  "XOR 암호화는 무조건 안전한가요?",
  "양자 컴퓨터가 나오면 AES도 뚫리나요?",
];

export const ThoughtLab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "안녕! 컴퓨터공학과 선배야. 방금 배운 내용 중에 궁금한 거 있어? 2진수, XOR, 암호학 뭐든지 물어봐!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const answer = await askSeniorStudent(text);
    
    setMessages(prev => [...prev, { role: 'model', text: answer }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'model' ? 'bg-indigo-600 text-white' : 'bg-slate-600 text-white'}
            `}>
              {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={`
              max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'model' 
                ? 'bg-indigo-50 text-slate-800 rounded-tl-none border border-indigo-200' 
                : 'bg-indigo-600 text-white rounded-tr-none font-medium'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot size={18} className="text-white animate-pulse" />
             </div>
             <div className="bg-indigo-50 p-3 rounded-2xl rounded-tl-none border border-indigo-200 text-slate-600 text-sm">
               생각 중...
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-3 py-1 bg-white border border-slate-300 text-slate-700 text-xs rounded-full hover:bg-slate-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="선배에게 질문하기..."
            className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={loading || !input.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};