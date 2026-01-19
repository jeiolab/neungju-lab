import React, { useState } from 'react';
import { evaluateReflection } from '../services/geminiService';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const TabReflection: React.FC = () => {
  const [userThought, setUserThought] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const scenario = "시험 점수를 예측할 때, 1~100점 점수 그 자체를 예측하는 것(회귀)과 A/B/C 등급을 예측하는 것(분류) 중 어떤 상황에서 무엇이 더 유용할까요?";

  const handleSubmit = async () => {
    if (!userThought.trim()) return;
    setLoading(true);
    setFeedback('');
    
    try {
        const result = await evaluateReflection(userThought, scenario);
        setFeedback(result);
    } catch (e) {
        setFeedback("오류가 발생했습니다.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-500" /> 생각해볼 문제
        </h2>
        <div className="bg-gray-50 p-4 rounded-xl text-gray-700 font-medium mb-6 leading-relaxed">
            {scenario}
        </div>

        <textarea
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-32"
            placeholder="나의 생각을 자유롭게 적어보세요..."
            value={userThought}
            onChange={(e) => setUserThought(e.target.value)}
        />
        
        <div className="mt-4 flex justify-end">
            <button
                onClick={handleSubmit}
                disabled={loading || !userThought.trim()}
                className={`flex items-center px-6 py-2 rounded-lg font-bold text-white transition ${loading || !userThought.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {loading ? 'AI 선생님이 생각 중...' : (
                    <>
                        <Send className="w-4 h-4 mr-2" /> 제출 및 피드백 받기
                    </>
                )}
            </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl animate-in slide-in-from-bottom-2">
            <div className="flex items-center mb-3">
                <div className="bg-indigo-600 p-1.5 rounded-full mr-3">
                    <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-indigo-900">AI 선생님의 피드백</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {feedback}
            </p>
        </div>
      )}
    </div>
  );
};

export default TabReflection;
