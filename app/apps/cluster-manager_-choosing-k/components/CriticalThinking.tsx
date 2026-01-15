import React, { useState } from 'react';
import { checkCriticalThinking } from '../services/geminiService';
import { MessageSquare, Send, Award } from 'lucide-react';

const CriticalThinking: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const question = "우리 반 학생들을 '2개' 속성(키, 몸무게)이 아니라 '3개' 속성(키, 몸무게, 성적)으로 군집화한다면, 결과는 어떻게 달라질까요? K값을 결정할 때 더 어려워질까요?";

  const handleSubmit = async () => {
    if (answer.trim().length < 10) {
      alert("답변을 조금 더 구체적으로 적어주세요!");
      return;
    }
    setLoading(true);
    const result = await checkCriticalThinking(question, answer);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Award className="text-yellow-300" /> 생각해볼 문제
        </h2>
        <p className="text-indigo-100 text-lg leading-relaxed mb-6">
          {question}
        </p>
        
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="여기에 생각을 적어보세요..."
            className="w-full h-32 rounded-xl p-4 text-gray-800 focus:ring-4 focus:ring-yellow-300 outline-none resize-none"
            disabled={loading || !!feedback}
          />
          {!feedback && (
             <button
             onClick={handleSubmit}
             disabled={loading}
             className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
           >
             {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
           </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg animate-fade-in">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <MessageSquare className="text-indigo-500" /> 선생님 피드백
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {feedback}
          </p>
          <button 
            onClick={() => { setFeedback(''); setAnswer(''); }}
            className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
          >
            다른 답변 써보기
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-bold text-gray-700 mb-2">💡 힌트 1</h4>
          <p className="text-sm text-gray-500">속성(차원)이 늘어나면 데이터 간의 거리를 계산하는 것이 더 복잡해집니다.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-bold text-gray-700 mb-2">💡 힌트 2</h4>
          <p className="text-sm text-gray-500">K를 정할 때 고려해야 할 변수가 많아지면 '해석 가능성'은 어떻게 될까요?</p>
        </div>
      </div>
    </div>
  );
};

export default CriticalThinking;