import React, { useState } from 'react';
import { getTeacherFeedback } from '../services/geminiService';
import { MessageCircle, Send } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [thought, setThought] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    setLoading(true);
    setFeedback(null);
    
    const response = await getTeacherFeedback(thought);
    
    setFeedback(response);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageCircle className="text-emerald-500" />
          생각해볼 문제
        </h2>
        
        <div className="bg-emerald-50 p-6 rounded-xl mb-6">
          <p className="text-lg font-medium text-emerald-900 mb-2">
            "자동화로 인해 일자리가 사라진다면 우리는 어떻게 대비해야 할까요?"
          </p>
          <p className="text-sm text-emerald-700">
            기술이 발전하면 단순 반복 업무는 사라지지만, 새로운 역할이 생겨납니다. 여러분의 생각을 자유롭게 적어보세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="예: 기계가 할 수 없는 창의적인 일을 찾아야 한다고 생각해요..."
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[120px] text-gray-700 resize-none"
          />
          
          <button
            type="submit"
            disabled={loading || !thought.trim()}
            className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all
              ${loading || !thought.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <>
                <Send size={20} />
                선생님께 의견 보내기
              </>
            )}
          </button>
        </form>

        {feedback && (
          <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-xl animate-fade-in">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              🤖 AI 선생님의 답변
            </h3>
            <p className="text-gray-800 leading-relaxed">
              {feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionTab;