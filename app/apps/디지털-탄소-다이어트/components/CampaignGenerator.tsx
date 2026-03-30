import React, { useState } from 'react';
import { generateCampaignIdeas } from '../services/geminiService';
import { Lightbulb, Send, Loader2 } from 'lucide-react';

const CampaignGenerator: React.FC = () => {
  const [schoolContext, setSchoolContext] = useState('');
  const [ideas, setIdeas] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!schoolContext.trim()) return;
    setLoading(true);
    setIdeas(null);
    
    const result = await generateCampaignIdeas(schoolContext);
    setIdeas(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Lightbulb className="text-yellow-500" />
          캠페인 아이디어
        </h2>
        <p className="text-gray-600">AI와 함께 학교의 디지털 탄소 발자국을 줄일 아이디어를 구상해보세요.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          학교 상황을 알려주세요:
        </label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all h-32 resize-none"
          placeholder="예: 학생 수는 500명이고, 모두 태블릿을 사용하며 인스타그램을 좋아합니다..."
          value={schoolContext}
          onChange={(e) => setSchoolContext(e.target.value)}
        />
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !schoolContext.trim()}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition-all ${
              loading || !schoolContext.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {loading ? '생각 중...' : '아이디어 생성'}
          </button>
        </div>
      </div>

      {ideas && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl border border-green-100 animate-fadeIn">
          <h3 className="text-xl font-bold text-green-900 mb-4">제안된 캠페인 아이디어:</h3>
          <div className="prose prose-green text-gray-800 whitespace-pre-line leading-relaxed">
            {/* Simple rendering for generated text which usually comes as markdown */}
            {ideas.split('\n').map((line, idx) => (
                <p key={idx} className={line.startsWith('**') || line.startsWith('#') ? "font-bold mt-4" : "mb-1"}>
                    {line.replace(/\*\*/g, '')}
                </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignGenerator;