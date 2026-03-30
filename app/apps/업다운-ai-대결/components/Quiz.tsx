import React, { useState } from 'react';
import { checkAnswer } from '../services/geminiService';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

const QUESTIONS = [
    "왜 1~100 사이의 숫자를 7번 만에 무조건 맞힐 수 있을까요?",
    "범위가 1~32라면 최대 몇 번의 추측이 필요할까요?",
    "정렬되지 않은 리스트에서도 이진 탐색을 사용할 수 있을까요? 그 이유는 무엇인가요?"
];

const Quiz: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsLoading(true);
    setFeedback(null);
    const result = await checkAnswer(QUESTIONS[activeQuestion], answer);
    setFeedback(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">퀴즈 / 확인</h2>
        <p className="text-slate-600">이진 탐색 이해도 테스트</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
            <span className="font-semibold text-slate-700">문제 {activeQuestion + 1} / {QUESTIONS.length}</span>
            <div className="flex gap-2">
                <button 
                    disabled={activeQuestion === 0}
                    onClick={() => { setActiveQuestion(p => p - 1); setFeedback(null); setAnswer(''); }}
                    className="text-xs px-2 py-1 rounded bg-white border border-slate-300 disabled:opacity-50"
                >이전</button>
                <button 
                    disabled={activeQuestion === QUESTIONS.length - 1}
                    onClick={() => { setActiveQuestion(p => p + 1); setFeedback(null); setAnswer(''); }}
                    className="text-xs px-2 py-1 rounded bg-white border border-slate-300 disabled:opacity-50"
                >다음</button>
            </div>
        </div>

        <div className="p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-6">{QUESTIONS[activeQuestion]}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-32"
                    placeholder="답변을 입력하세요..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
                
                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isLoading || !answer.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18}/> : <Send size={18} />}
                        제출하기
                    </button>
                </div>
            </form>

            {feedback && (
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="text-indigo-600 mt-1 shrink-0" size={20} />
                        <div>
                            <h4 className="font-bold text-indigo-900 mb-1">AI 튜터 피드백</h4>
                            <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-line">{feedback}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;