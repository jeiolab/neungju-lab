import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send } from 'lucide-react';
import { getTutorResponse } from '../services/geminiService';

const ReflectionTab: React.FC = () => {
  const [thought, setThought] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!thought.trim()) return;
    setIsLoading(true);
    setAiResponse(null);
    
    // Call Gemini Service
    const response = await getTutorResponse(thought, "사용자는 다음 주제에 대해 생각하고 있습니다: '데이터의 화폐 단위(원화, 달러)가 섞여 있을 때 통일하지 않고 분석하면 어떤 일이 벌어질까?'");
    
    setAiResponse(response);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 h-full p-4">
       {/* Problem Statement */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold inline-block mb-4">
             생각해볼 문제
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            화폐 단위의 함정
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            여러분이 글로벌 매출 데이터를 분석하고 있다고 가정해 봅시다. 
            어떤 지점은 매출을 <strong>한국 원화(KRW)</strong>로 보고하고, 
            다른 지점은 <strong>미국 달러(USD)</strong>로 보고했습니다.
            <br/><br/>
            이 데이터를 단위를 통일하지 않고 그대로 AI 모델에 넣어 미래 매출을 예측하려 합니다.
            <br/><br/>
            <strong>어떤 문제가 발생할까요?</strong> 이것이 비즈니스에 왜 위험할까요?
          </p>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-2">고려해야 할 핵심 개념:</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>값의 크기 차이 (1달러 ≈ 1,400원)</li>
              <li>모델의 편향성(Bias)</li>
              <li>단위 표준화(Standardization)의 필요성</li>
            </ul>
          </div>
       </div>

       {/* User Input & AI Feedback */}
       <div className="flex flex-col gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-500" /> 당신의 생각
            </h3>
            <textarea 
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="예: 제 생각에는 1000원이 10달러보다 훨씬 큰 숫자로 인식되어서 모델이 원화 매출이 더 높다고 착각할 것 같습니다..."
              className="flex-1 w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none mb-4 text-slate-700"
            />
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !thought.trim()}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-300 flex items-center justify-center gap-2"
            >
               {isLoading ? (
                 <span>분석 중...</span>
               ) : (
                 <>
                   <Sparkles className="w-4 h-4" /> AI 튜터에게 물어보기
                 </>
               )}
            </button>
          </div>

          {aiResponse && (
            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl animate-fade-in">
               <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                 <Sparkles className="w-4 h-4" /> 시니어 엔지니어의 피드백
               </h4>
               <p className="text-indigo-800 text-sm leading-relaxed">
                 {aiResponse}
               </p>
            </div>
          )}
       </div>
    </div>
  );
};

export default ReflectionTab;