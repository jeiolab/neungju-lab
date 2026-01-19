import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send } from 'lucide-react';
import { getReflectionFeedback } from '../services/geminiService';

const ReflectionTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setFeedback('');
    
    // Simulate thinking if no API key for demo purposes, or actual call
    const result = await getReflectionFeedback(input);
    
    setFeedback(result || "");
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-full">
                <Sparkles className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">생각해볼 문제 🤔</h2>
        </div>

        <p className="text-lg text-slate-700 mb-8 leading-relaxed">
            "여러분이 의사 선생님이 되어 환자를 진료한다고 상상해봅시다.<br/>
            수백 가지 병명 중에서 환자의 병을 빠르게 찾아내려면, <strong>어떤 순서로 질문하는 것</strong>이 가장 중요할까요?<br/>
            의사결정트리의 원리를 생각하며 자유롭게 적어보세요."
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-0 outline-none transition-all resize-none h-32 text-slate-700"
            placeholder="예: 가장 흔한 증상부터 물어볼 것 같아요. 왜냐하면..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex justify-end">
            <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'AI 선생님이 읽고 있어요...' : (
                    <>
                        제출하고 피드백 받기 <Send size={18} />
                    </>
                )}
            </button>
          </div>
        </form>
      </div>

      {feedback && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-3xl border border-purple-100 animate-fade-in-up">
            <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                    <MessageSquare className="text-purple-500" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-purple-900 mb-2">AI 선생님의 피드백</h3>
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {feedback}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;