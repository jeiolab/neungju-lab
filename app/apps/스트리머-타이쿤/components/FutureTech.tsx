import React, { useState } from 'react';
import { GoogleGenAI } from '@/lib/genai-browser-shim';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

const FutureTech: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-3-flash-preview'; 
      
      const result = await ai.models.generateContent({
        model,
        contents: `Explain how AI Video Upscaling works (like DLSS or NVIDIA Super Resolution) to a non-technical person who is interested in streaming. Keep it under 200 words. User question context: "${prompt}". Please answer strictly in Korean language.`,
      });

      setResponse(result.text || "답변을 생성하지 못했습니다.");
    } catch (err) {
      console.error(err);
      setError("미래 기술 데이터베이스 연결 실패 (AI API 오류)");
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "AI는 어떻게 저화질 영상을 고화질로 바꾸나요?",
    "AI 업스케일링을 쓰면 인터넷 데이터가 더 드나요?",
    "비트레이트와 해상도의 차이는 무엇인가요?"
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in h-full flex flex-col">
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 rounded-xl shadow-lg text-white">
        <div className="flex items-center gap-4 mb-4">
          <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
          <h2 className="text-3xl font-bold">미래 기술: AI 업스케일링</h2>
        </div>
        <p className="text-violet-100 max-w-2xl">
          최신 기술은 인공지능을 사용하여 누락된 픽셀을 추측합니다.
          이를 통해 스트리머는 낮은 비트레이트로 방송해 인터넷 비용을 아끼고, 시청자는 고화질로 감상할 수 있습니다.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="bg-gray-50 p-6 md:w-1/3 border-r border-gray-200">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5" /> AI 기술자에게 질문하기
          </h3>
          <div className="space-y-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setPrompt(q)}
                className="w-full text-left text-sm p-3 rounded bg-white border border-gray-200 hover:bg-violet-50 hover:border-violet-300 transition-colors text-gray-600"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="p-6 md:w-2/3 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 min-h-[200px]">
            {!response && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Bot className="w-12 h-12 mb-2 opacity-20" />
                <p>질문을 선택하거나 직접 입력하여 AI 영상 기술에 대해 알아보세요.</p>
              </div>
            )}
            
            {loading && (
              <div className="flex items-center justify-center h-full text-violet-600">
                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                <span>신경망 처리 중...</span>
              </div>
            )}

            {response && (
               <div className="bg-violet-50 p-5 rounded-lg border border-violet-100 text-gray-800 leading-relaxed">
                 <h4 className="font-bold text-violet-700 mb-2 flex items-center gap-2">
                   <Sparkles className="w-4 h-4" /> AI 답변:
                 </h4>
                 {response}
               </div>
            )}
            
            {error && (
              <div className="bg-red-50 p-4 rounded text-red-600 border border-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="영상 기술에 대해 물어보세요..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
            />
            <button
              onClick={handleAskAI}
              disabled={loading || !prompt}
              className="px-6 py-3 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              질문
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureTech;