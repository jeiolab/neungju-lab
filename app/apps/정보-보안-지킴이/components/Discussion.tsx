import React, { useState } from 'react';
import { Fingerprint, ScanEye, Brain, MessageSquare, Sparkles } from 'lucide-react';
import { analyzeOpinion } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const Discussion: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [opinion, setOpinion] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!opinion.trim()) return;
    
    setIsLoading(true);
    setAiFeedback(null);
    const feedback = await analyzeOpinion(opinion);
    setAiFeedback(feedback);
    setIsLoading(false);
  };

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-purple-600" />
          생각해볼 문제
        </h2>
        <p className="text-slate-600">
          "지문이나 홍채 같은 생체 정보를 비밀번호로 쓰는 건 완벽하게 안전할까요?"<br/>
          카드를 뒤집어 장단점을 확인하고, 여러분의 의견을 적어보세요.<br/>
          <span className="text-sm text-purple-600 font-medium">AI 보안 컨설턴트가 피드백을 해드립니다!</span>
        </p>
      </div>

      {/* Flip Card Section */}
      <div className="flex justify-center perspective-1000 my-8">
        <div 
          className={`relative w-80 h-96 transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white p-6 border-4 border-blue-400/30">
            <Fingerprint size={80} className="mb-6 opacity-90" />
            <h3 className="text-2xl font-bold mb-2">생체 인식 보안</h3>
            <p className="text-center text-blue-100">
              지문, 얼굴, 홍채...<br/>
              편리하지만 과연 안전하기만 할까요?
            </p>
            <div className="mt-8 text-sm bg-white/20 px-4 py-2 rounded-full animate-bounce">
              카드를 눌러보세요
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl shadow-xl p-6 border border-slate-200 flex flex-col overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ScanEye className="text-purple-600" /> 장점과 단점
            </h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <strong className="text-emerald-600 block mb-1">장점 (Pros)</strong>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  <li>기억할 필요가 없다.</li>
                  <li>분실할 위험이 적다.</li>
                  <li>입력이 매우 빠르다.</li>
                </ul>
              </div>
              <div className="border-t pt-4">
                <strong className="text-red-500 block mb-1">단점 (Cons)</strong>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  <li>변경할 수 없다 (평생 1개).</li>
                  <li>유출되면 복구가 불가능하다.</li>
                  <li>잠이나 기절 상태에서 도용될 수 있다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opinion Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          나의 의견 적어보기
        </h3>
        
        <textarea
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          placeholder="예: 생체 인식은 편리하지만 유출되면 바꿀 수 없어서 2단계 인증으로만 쓰는 게 좋을 것 같아요."
          className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none mb-4 text-slate-700"
        />
        
        <div className="flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !opinion.trim()}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                AI 분석 중...
              </>
            ) : (
              <>
                <Sparkles size={18} /> AI 피드백 받기
              </>
            )}
          </button>
        </div>

        {aiFeedback && (
          <div className="mt-6 p-6 bg-purple-50 rounded-xl border border-purple-100 animate-fade-in">
            <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> AI 보안 컨설턴트의 답변
            </h4>
            <div className="prose prose-sm prose-purple text-slate-700">
               <ReactMarkdown>{aiFeedback}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;