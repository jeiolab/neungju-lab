import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ReflectionTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `
        당신은 AI 역사 박물관의 지적인 큐레이터입니다. 
        사용자(학생)가 AI 역사에 대한 '만약에(What if)' 질문을 던지면, 
        역사적 사실과 기술적 맥락에 기반하여 흥미롭고 교육적인 답변을 해주세요.
        답변은 300자 이내로 간결하게, 존댓말을 사용하세요.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction,
        }
      });
      
      setResponse(result.text || "답변을 생성할 수 없습니다.");
    } catch (err: any) {
      setError("AI 큐레이터와 연결하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "만약 1970년대에 현재의 GPU가 있었다면 AI 암흑기가 오지 않았을까요?",
    "튜링 테스트를 통과한 AI를 인간으로 인정해야 할까요?",
    "미래의 AI는 인간의 역할을 완전히 대체하게 될까요?"
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">생각해볼 문제: 대체 역사</h2>
            <p className="text-slate-600">
                역사에 '만약'은 없지만, 상상은 혁신의 시작입니다. AI 큐레이터에게 질문해보세요.
            </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">질문 입력</label>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 만약 조선시대에 AI가 있었다면 어떤 역할을 했을까요?"
                    className="w-full h-32 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                ></textarea>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.map((s, i) => (
                    <button 
                        key={i}
                        onClick={() => setPrompt(s)}
                        className="text-xs bg-white text-indigo-600 border border-indigo-200 px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors"
                    >
                        {s}
                    </button>
                ))}
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 flex justify-center items-center"
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        큐레이터가 생각 중입니다...
                    </span>
                ) : '질문하기'}
            </button>
        </div>

        {(response || error) && (
            <div className={`p-6 rounded-xl border ${error ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                {error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div>
                        <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3 font-serif italic">C</div>
                            <span className="font-bold text-slate-800">AI 큐레이터의 답변</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{response}</p>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default ReflectionTab;
