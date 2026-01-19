import React, { useState } from 'react';
import { REFLECTION_PROMPTS } from '../constants';
import { getReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Sparkles, Send } from 'lucide-react';

const Reflection: React.FC = () => {
  const [activePromptId, setActivePromptId] = useState(REFLECTION_PROMPTS[0].id);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activePrompt = REFLECTION_PROMPTS.find(p => p.id === activePromptId);

  const handleSubmit = async () => {
    if (!userAnswer.trim() || !activePrompt) return;

    setIsLoading(true);
    const response = await getReflectionFeedback(activePrompt.prompt, userAnswer);
    setFeedback(response || null);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Sidebar: Prompts */}
      <div className="md:col-span-1 space-y-3">
        <h3 className="font-bold text-gray-700 mb-2">생각해볼 문제</h3>
        {REFLECTION_PROMPTS.map((p) => (
            <button
                key={p.id}
                onClick={() => {
                    setActivePromptId(p.id);
                    setFeedback(null);
                    setUserAnswer("");
                }}
                className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-colors ${
                    activePromptId === p.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
            >
                {p.id === 'condition_change' && "데이터가 부족하다면?"}
                {p.id === 'counter_example' && "정확도의 함정"}
                {p.id === 'design_application' && "예측기 설계하기"}
            </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="text-indigo-600" />
                깊이 생각하기
            </h2>
            <p className="text-gray-600 mt-2 text-lg leading-relaxed">{activePrompt?.prompt}</p>
        </div>

        <div className="mb-4">
            <textarea 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={activePrompt?.placeholder}
                className="w-full h-32 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
        </div>

        <button 
            onClick={handleSubmit}
            disabled={isLoading || !userAnswer.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
            {isLoading ? (
                <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    코치가 생각 중입니다...
                </>
            ) : (
                <>
                    <Send size={18} />
                    코치에게 물어보기
                </>
            )}
        </button>

        {feedback && (
            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 animate-fade-in relative">
                <Sparkles className="absolute top-4 right-4 text-yellow-500" size={20} />
                <h4 className="font-bold text-indigo-900 mb-2">코치의 피드백</h4>
                <p className="text-indigo-800 leading-relaxed text-sm">
                    {feedback}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reflection;