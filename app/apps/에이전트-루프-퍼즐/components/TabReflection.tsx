import React, { useState } from 'react';
import { getReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const TabReflection: React.FC = () => {
  const [targetStep, setTargetStep] = useState('인식');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    setFeedback('');
    
    const response = await getReflectionFeedback(targetStep, userInput);
    setFeedback(response);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center h-full p-6 overflow-y-auto">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-2 text-slate-800 flex items-center">
          <MessageSquare className="mr-2 text-indigo-500" /> 생각해볼 문제
        </h2>
        <p className="text-slate-500 mb-8">
          만약 에이전트의 한 단계를 바꾼다면 세상은 어떻게 달라질까요?
        </p>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-3">어떤 단계를 바꿔볼까요?</label>
          <div className="flex space-x-2 mb-4">
            {['인식', '학습', '추론', '행동'].map(step => (
              <button
                key={step}
                onClick={() => setTargetStep(step)}
                className={`px-4 py-2 rounded-lg text-sm transition ${targetStep === step ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {step}
              </button>
            ))}
          </div>

          <label className="block text-sm font-bold text-slate-700 mb-2">나만의 아이디어 (반례/개선안)</label>
          <textarea
            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition resize-none h-32"
            placeholder={`예: ${targetStep} 단계에서 ...하면 어떤 문제가 생길까? 또는 어떻게 개선할 수 있을까?`}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !userInput}
            className={`mt-4 w-full py-3 rounded-xl font-bold flex items-center justify-center transition ${isLoading || !userInput ? 'bg-slate-300 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'}`}
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
               <>
                 <Send className="w-4 h-4 mr-2" /> AI 코치에게 물어보기
               </>
            )}
          </button>
        </div>

        {feedback && (
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative animate-fade-in">
            <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" />
            <h3 className="text-sm font-bold text-indigo-800 mb-2 uppercase tracking-wide">AI Coach Feedback</h3>
            <p className="text-indigo-900 leading-relaxed">
              {feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabReflection;
