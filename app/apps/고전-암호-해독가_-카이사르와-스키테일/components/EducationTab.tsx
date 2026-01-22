import React, { useState } from 'react';
import { getDetectiveAnalysis, getFrequencyHint } from '../services/geminiService';
import { Bot, BookOpen, BarChart3, Search } from 'lucide-react';

export const EducationTab: React.FC = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'general' | 'frequency'>('general');

  const handleAnalysis = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAnalysis(null);
    
    let result;
    if (activeMode === 'general') {
       result = await getDetectiveAnalysis(text, 'caesar'); // Defaulting to asking about substitution context
    } else {
       result = await getFrequencyHint(text);
    }
    
    setAnalysis(result || "분석에 실패했습니다.");
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Static Education */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow border border-stone-200">
              <h3 className="flex items-center text-xl font-serif font-bold text-stone-800 mb-4">
                 <BookOpen className="mr-2 text-amber-600" /> 치환(Substitution) 암호란?
              </h3>
              <p className="text-stone-600 leading-relaxed mb-4">
                 어떤 글자를 다른 글자로 <strong>바꾸는</strong> 방식입니다. 카이사르 암호가 대표적입니다.
                 규칙만 알면 쉽지만, 문자의 <strong>빈도수(Frequency)</strong>가 변하지 않는다는 치명적인 단점이 있습니다.
              </p>
              <div className="bg-stone-100 p-3 rounded text-sm text-stone-500">
                 예: 영어에서 'E'는 가장 많이 쓰입니다. 암호문에서 'X'가 가장 많이 나온다면, X는 E일 확률이 높습니다.
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow border border-stone-200">
              <h3 className="flex items-center text-xl font-serif font-bold text-stone-800 mb-4">
                 <ColumnsIcon className="mr-2 text-amber-600" /> 전치(Transposition) 암호란?
              </h3>
              <p className="text-stone-600 leading-relaxed">
                 글자의 모양은 그대로 두고 <strong>위치만 섞는</strong> 방식입니다. 스키테일 암호가 대표적입니다.
                 빈도수는 그대로 유지되지만(애너그램 상태), 글자들의 배열 규칙을 찾아내야 해독할 수 있습니다.
              </p>
           </div>
        </div>

        {/* Right Col: AI Interactive Area */}
        <div className="bg-stone-800 text-stone-100 p-6 rounded-xl shadow-xl flex flex-col h-full">
            <div className="flex items-center mb-6">
               <Bot className="text-amber-400 mr-2" size={28} />
               <div>
                  <h3 className="text-xl font-bold">AI 탐정의 분석실</h3>
                  <p className="text-xs text-stone-400">Google Gemini 기반 역사 탐정</p>
               </div>
            </div>

            <div className="flex-1 space-y-4">
               <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-24 bg-stone-700 border border-stone-600 rounded-lg p-3 text-sm focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                  placeholder="분석하고 싶은 암호문이나 평문을 입력하세요..."
               />
               
               <div className="flex space-x-2">
                  <button 
                    onClick={() => { setActiveMode('general'); handleAnalysis(); }}
                    disabled={loading || !text}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center transition-colors"
                  >
                     <Search size={16} className="mr-1"/> 탐정에게 묻기
                  </button>
                  <button 
                    onClick={() => { setActiveMode('frequency'); handleAnalysis(); }}
                    disabled={loading || !text}
                    className="flex-1 bg-stone-600 hover:bg-stone-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center transition-colors"
                  >
                     <BarChart3 size={16} className="mr-1"/> 빈도수 분석
                  </button>
               </div>
               
               <div className="min-h-[200px] bg-stone-900/50 rounded-lg p-4 border border-stone-700 text-sm leading-relaxed overflow-y-auto max-h-[300px]">
                  {loading ? (
                      <div className="flex items-center justify-center h-full text-stone-500 animate-pulse">
                         탐정이 고문서를 뒤지고 있습니다...
                      </div>
                  ) : analysis ? (
                      <div className="whitespace-pre-wrap">{analysis}</div>
                  ) : (
                      <div className="text-stone-500 text-center mt-10">
                         텍스트를 입력하고 버튼을 눌러보세요.
                      </div>
                  )}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ColumnsIcon = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="1" ry="1" />
      <line x1="12" x2="12" y1="3" y2="21" />
    </svg>
);
