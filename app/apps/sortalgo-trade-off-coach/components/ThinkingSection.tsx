import React, { useState } from 'react';
import { evaluateThinkingQuestion } from '../services/geminiService';
import { MessageSquare, Send } from 'lucide-react';

export const ThinkingSection: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const question = "만약 '최악의 상황이 자주 발생하는 데이터'에서 굳이 퀵 정렬을 써야 한다면, 어떻게 개선할 수 있을까요?";

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setIsLoading(true);
    const result = await evaluateThinkingQuestion(question, answer);
    setAiFeedback(result.feedback);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-900">생각해볼 문제</h2>
      </div>
      
      <p className="text-slate-700 mb-4 font-medium leading-relaxed">
        Q. {question}
      </p>

      <div className="space-y-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="자유롭게 생각을 적어보세요..."
          className="w-full p-4 rounded-lg bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 min-h-[80px]"
        />
        
        <div className="flex justify-end">
           <button
            onClick={handleSubmit}
            disabled={isLoading || !answer}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? '생각하는 중...' : '제출하기'}
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {aiFeedback && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200 animate-fadeIn">
          <h4 className="font-bold text-indigo-700 mb-2">AI 피드백</h4>
          <p className="text-sm text-slate-700 leading-relaxed">{aiFeedback}</p>
        </div>
      )}
    </div>
  );
};