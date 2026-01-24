import React, { useState } from 'react';
import { ArgumentStructure } from '../types';
import { gradeArgument, isGeminiConfigured } from '../services/geminiService';
import { PenTool, CheckCircle, AlertCircle } from 'lucide-react';

interface ThinkingTabProps {
  onComplete: () => void;
}

const ThinkingTab: React.FC<ThinkingTabProps> = ({ onComplete }) => {
  const [argument, setArgument] = useState<ArgumentStructure>({
    claim: '',
    evidence: '',
    condition: '',
    counterExample: '',
    alternative: ''
  });
  const [result, setResult] = useState<{score: number, feedback: string, tags: string[]} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ArgumentStructure, value: string) => {
    setArgument(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!argument.claim || !argument.evidence) {
      alert("최소한 주장과 근거는 작성해야 합니다.");
      return;
    }

    setLoading(true);
    const grade = await gradeArgument(argument);
    setResult(grade);
    setLoading(false);
    
    if (grade.score >= 60) {
        onComplete();
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <PenTool className="w-5 h-5 text-purple-600" />
          나의 주장 템플릿
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          오늘의 IoT 미션 주제에 대해 당신의 생각을 정리해보세요. 논리적인 구조를 갖출수록 높은 점수를 받습니다.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1. 주장 (Claim)</label>
            <input 
              type="text"
              placeholder="예: 자율주행차의 도입은 도심에서 전면 의무화되어야 한다."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={argument.claim}
              onChange={(e) => handleChange('claim', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. 근거 (Evidence)</label>
            <textarea 
              placeholder="왜냐하면..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-20"
              value={argument.evidence}
              onChange={(e) => handleChange('evidence', e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">3. 조건/단서 (Condition)</label>
              <input 
                type="text"
                placeholder="단, ~한 경우에는..."
                className="w-full p-3 bg-purple-50 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={argument.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">과장된 주장을 피하기 위한 안전장치입니다.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">4. 반례 (Counter-Example)</label>
              <input 
                type="text"
                placeholder="물론 ~한 문제도 있을 수 있다."
                className="w-full p-3 bg-orange-50 border border-orange-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={argument.counterExample}
                onChange={(e) => handleChange('counterExample', e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">반대 의견을 미리 예상해봅니다.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">5. 대안 (Alternative)</label>
            <input 
              type="text"
              placeholder="따라서 ~한 해결책이 필요하다."
              className="w-full p-3 bg-green-50 border border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={argument.alternative}
              onChange={(e) => handleChange('alternative', e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-lg disabled:opacity-50"
        >
          {loading ? 'AI 코치가 채점 중입니다...' : '제출하고 평가받기'}
        </button>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-slide-up">
          <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-bold text-gray-800">평가 결과</h3>
                <div className="flex gap-2 mt-2">
                    {result.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className={`text-2xl font-black ${result.score >= 80 ? 'text-blue-600' : 'text-orange-500'}`}>
                {result.score}점
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-gray-700 text-sm leading-relaxed">
                {result.feedback}
            </p>
          </div>
          
          {result.score >= 60 && (
             <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold text-sm">미션 완료! 오늘의 경험치가 지급되었습니다.</span>
             </div>
          )}
          
          {!isGeminiConfigured() && (
             <div className="mt-2 flex items-center gap-2 text-orange-500 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>API 키가 설정되지 않아 데모 점수가 표시되었습니다.</span>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThinkingTab;
