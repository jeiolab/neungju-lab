import React, { useState } from 'react';
import { THINKING_PROBLEMS } from '../constants';
import { evaluateThinkingAnswer } from '../services/geminiService';
import { Lightbulb, Send, Loader2, MessageSquareQuote } from 'lucide-react';

interface TabThinkingProps {
  thinkingAnswers: Record<string, string>;
  thinkingFeedback: Record<string, string>;
  setThinkingAnswer: (id: string, ans: string) => void;
  setThinkingFeedback: (id: string, feed: string) => void;
  addBadge: (badge: string) => void;
}

const TabThinking: React.FC<TabThinkingProps> = ({ thinkingAnswers, thinkingFeedback, setThinkingAnswer, setThinkingFeedback, addBadge }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubmit = async (id: string, question: string) => {
    const answer = thinkingAnswers[id];
    if (!answer || answer.length < 10) return;

    setLoadingId(id);
    const feedback = await evaluateThinkingAnswer(question, answer);
    setThinkingFeedback(id, feedback);
    setLoadingId(null);
    
    // Check if all answered for badge
    if (Object.keys(thinkingFeedback).length + 1 >= 3) {
      addBadge('비판적 사고가');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-start gap-4">
        <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
           <h2 className="text-lg font-bold text-indigo-900 mb-1">생각 더하기</h2>
           <p className="text-indigo-700">단순한 지식을 넘어, 상황을 바꾸거나 새로운 규칙을 만들어보며 IoT 시대의 시민 역량을 길러봅시다. AI 코치가 피드백을 드립니다.</p>
        </div>
      </div>

      <div className="grid gap-8">
        {THINKING_PROBLEMS.map((problem) => (
          <div key={problem.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                problem.type === 'condition' ? 'bg-pink-100 text-pink-700' : 
                problem.type === 'counter_example' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {problem.type === 'condition' ? '조건 바꾸기' : problem.type === 'counter_example' ? '반례 찾기' : '적용 설계'}
              </span>
              <h3 className="text-xl font-bold text-slate-800">{problem.title}</h3>
            </div>
            
            <p className="text-slate-600 mb-6 text-lg">{problem.prompt}</p>

            <div className="relative">
              <textarea
                value={thinkingAnswers[problem.id] || ''}
                onChange={(e) => setThinkingAnswer(problem.id, e.target.value)}
                placeholder={problem.placeholder}
                disabled={!!thinkingFeedback[problem.id]}
                className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-50 disabled:bg-slate-100 disabled:text-slate-500"
              />
              
              {!thinkingFeedback[problem.id] && (
                <button
                  onClick={() => handleSubmit(problem.id, problem.prompt)}
                  disabled={!thinkingAnswers[problem.id] || thinkingAnswers[problem.id].length < 5 || loadingId === problem.id}
                  className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {loadingId === problem.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                  AI 피드백 받기
                </button>
              )}
            </div>

            {thinkingFeedback[problem.id] && (
              <div className="mt-6 bg-indigo-50 border border-indigo-100 p-5 rounded-xl animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-2 font-bold text-indigo-800">
                  <MessageSquareQuote className="w-5 h-5" />
                  AI 코치의 피드백
                </div>
                <p className="text-indigo-900 leading-relaxed whitespace-pre-wrap">{thinkingFeedback[problem.id]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabThinking;