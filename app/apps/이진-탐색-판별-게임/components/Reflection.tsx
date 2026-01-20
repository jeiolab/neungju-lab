import React, { useState } from 'react';
import { getReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const Reflection: React.FC = () => {
  const [question] = useState("만약 학교 급식 순서가 '학년-반-번호' 순이 아니라 도착한 순서대로 무작위라면, 특정 학생을 빨리 찾기 위해 어떤 방법을 써야 할까요?");
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsTyping(true);
    const result = await getReflectionFeedback('UNSORTED_SCENARIO', input);
    setFeedback(result);
    setIsTyping(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-yellow-300" />
            <h2 className="text-2xl font-bold">생각해볼 문제</h2>
        </div>
        <p className="text-indigo-100 text-lg leading-relaxed">
          {question}
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">나의 생각 적어보기</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32 resize-none"
            placeholder="예: 정렬이 안 되어 있으니까 이진 탐색은 못 쓰고..."
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isTyping || !input}
          className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
           {isTyping ? 'AI 선생님이 읽고 있습니다...' : <>피드백 받기 <Send size={18} /></>}
        </button>

        {feedback && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-3 text-indigo-700 font-bold">
              <MessageSquare size={20} /> AI 선생님의 피드백
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflection;