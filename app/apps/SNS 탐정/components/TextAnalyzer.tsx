import React, { useState } from 'react';
import { analyzeTextWithGemini } from '../services/geminiService';
import { TextAnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TextAnalyzerProps {
  onAnalyze: (content: string) => void;
}

export const TextAnalyzer: React.FC<TextAnalyzerProps> = ({ onAnalyze }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TextAnalysisResult | null>(null);

  const handleExampleClick = () => {
    setInputText("이 식당 음식은 차갑고 서비스가 엉망이야 ㅠㅠ");
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      const data = await analyzeTextWithGemini(inputText);
      setResult(data);
      onAnalyze(inputText);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Score', value: result.sentimentScore },
    { name: 'Remaining', value: 100 - result.sentimentScore },
  ] : [];
  
  const COLORS = result && result.sentimentScore > 60 ? ['#4ade80', '#e2e8f0'] : ['#f87171', '#e2e8f0'];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Input Panel */}
      <div className="flex-1 glass-panel p-6 rounded-2xl flex flex-col">
        <h3 className="text-xl font-bold mb-4 text-slate-700">📝 텍스트 마이닝 (Text Mining)</h3>
        <p className="text-sm text-slate-500 mb-4">
          SNS 댓글이나 리뷰 같은 비정형 텍스트를 입력해보세요. AI가 형태소를 분석하고 감정을 추출합니다.
        </p>
        
        <textarea
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none h-40 bg-white/50"
          placeholder="여기에 텍스트를 입력하거나 아래 예시를 클릭하세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        <div className="mt-3 flex gap-2">
          <button 
            onClick={handleExampleClick}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-full transition-colors"
          >
            "이 식당 음식은 차갑고..." 입력하기
          </button>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !inputText}
          className={`mt-auto w-full py-3 rounded-xl font-bold text-white transition-all shadow-md
            ${loading || !inputText 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:scale-[1.02]'
            }`}
        >
          {loading ? 'AI 분석 중...' : '분석 시작 (Analyze)'}
        </button>
      </div>

      {/* Right Output Panel */}
      <div className="flex-1 glass-panel p-6 rounded-2xl relative overflow-hidden">
        {!result && !loading && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <p>분석 결과가 여기에 표시됩니다.</p>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-600 font-medium animate-pulse">형태소 쪼개는 중...</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">감정 분석 결과</span>
                <h2 className={`text-2xl font-bold ${result.sentimentLabel === 'Positive' ? 'text-green-600' : result.sentimentLabel === 'Negative' ? 'text-red-500' : 'text-slate-600'}`}>
                  {result.sentimentLabel} ({result.sentimentScore}%)
                </h2>
              </div>
              <div className="w-16 h-16">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={15}
                        outerRadius={25}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-bold block mb-2">TOKENIZATION (형태소 분리)</span>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-100 rounded-lg">
                {result.tokens.map((token, i) => (
                  <span 
                    key={i} 
                    className={`px-2 py-1 rounded text-sm font-medium border
                      ${result.keywords.some(k => token.includes(k)) 
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm' 
                        : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    {token}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-800 text-sm mb-1">💡 AI Insight</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                {result.explanation}
              </p>
              <p className="mt-2 text-xs text-blue-500">
                * 컴퓨터는 이 텍스트를 단순한 글자가 아닌, 의미 벡터(Vector)로 변환하여 이해합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
