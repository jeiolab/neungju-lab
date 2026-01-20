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
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold">생각해볼 문제</h2>
      </div>
      
      <p className="text-slate-300 mb-4 font-medium leading-relaxed">
        Q. {question}
      </p>

      <div className="space-y-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="자유롭게 생각을 적어보세요..."
          className="w-full p-4 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white placeholder-slate-400 min-h-[80px]"
        />
        
        <div className="flex justify-end">
           <button
            onClick={handleSubmit}
            disabled={isLoading || !answer}
            className="px-6 py-2 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? '생각하는 중...' : '제출하기'}
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {aiFeedback && (
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600 animate-fadeIn">
          <h4 className="font-bold text-yellow-400 mb-2">AI 피드백</h4>
          <p className="text-sm text-slate-200 leading-relaxed">{aiFeedback}</p>
        </div>
      )}
    </div>
  );
};