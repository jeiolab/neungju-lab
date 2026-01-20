import React, { useState } from 'react';
import { evaluateReflection } from '../services/geminiService';
import { Send, Sparkles } from 'lucide-react';

const Reflection: React.FC = () => {
  const [thought, setThought] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    setIsSubmitting(true);
    const response = await evaluateReflection(thought, 1000000);
    setFeedback(response);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-stone-800 mb-2">수석 사서처럼 생각하기</h2>
      <p className="text-stone-600 mb-8">
        책 20권을 관리하는 건 쉽습니다. 하지만 국회도서관처럼 수백만 권의 책이 있다면 어떨까요?
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 bg-stone-50 border-b border-stone-200">
          <h3 className="font-semibold text-stone-700 mb-2">백만 권의 딜레마</h3>
          <p className="text-sm text-stone-600 italic">
            "책이 1,000,000권이라면, 정렬하는 데 드는 노력이 과연 가치가 있을까요? 아니면 그냥 정말 빨리 달리는 사람을 고용해서 순차 탐색을 시키는 게 나을까요?"
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none min-h-[150px] resize-none text-stone-800 placeholder:text-stone-400"
              placeholder="여기에 생각을 적어주세요..."
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              disabled={isSubmitting || !!feedback}
            />
            
            {!feedback && (
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={!thought.trim() || isSubmitting}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">분석 중...</span>
                  ) : (
                    <>생각 제출하기 <Send className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </form>

          {feedback && (
            <div className="mt-6 bg-indigo-50 border border-indigo-100 p-5 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
                <Sparkles className="w-4 h-4" /> 수석 사서의 피드백:
              </div>
              <p className="text-indigo-900 leading-relaxed">{feedback}</p>
              <button 
                onClick={() => { setFeedback(null); setThought(''); }}
                className="text-xs text-indigo-500 mt-4 hover:underline"
              >
                다른 생각 해보기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reflection;