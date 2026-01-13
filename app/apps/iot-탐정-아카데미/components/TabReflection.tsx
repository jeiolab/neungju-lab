import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Sparkles, Loader2 } from 'lucide-react';

const TabReflection: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      // The API key must be obtained exclusively from the environment variable process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        사용자는 고등학교 1학년 학생이고, 주제는 'IoT 시스템의 안정성'입니다.
        질문: "만약 자율주행 자동차나 스마트 병원의 센서가 갑자기 고장 난다면 어떤 문제가 발생할 수 있고, 이를 막기 위해 어떤 대비책(이중화, 보안 등)이 필요할까요?"
        학생의 답변: "${answer}"
        
        역할: 친절하고 논리적인 IoT 선생님.
        요청사항: 
        1. 학생의 답변에서 좋은 점을 먼저 칭찬해주세요.
        2. 부족한 점이나 추가로 생각해보면 좋을 키워드(예: Fail-safe, 이중화, 보안 프로토콜 등)를 쉽고 구체적으로 설명해주세요.
        3. 답변 길이는 300자 이내로 해주세요.
        4. 말투는 격려하는 톤으로 해주세요.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setFeedback(response.text || "피드백을 생성할 수 없습니다. 다시 시도해주세요.");
    } catch (error) {
      console.error(error);
      setFeedback("AI 선생님 연결에 실패했습니다. (API Key 설정 또는 네트워크를 확인해주세요)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">🤔 생각해볼 문제</h2>
        <p className="text-slate-600">진정한 탐정은 "만약에?"라는 질문을 멈추지 않습니다.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-indigo-900 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
             Q. 만약 자율주행 자동차나 스마트 병원의 센서가 갑자기 고장 난다면 어떤 문제가 발생할 수 있고, 이를 막기 위해 어떤 기술적 대비책이 필요할까요?
          </h3>
        </div>

        <textarea
          className="w-full h-40 p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none mb-4"
          placeholder="여러분의 생각을 자유롭게 적어보세요. (예: 사고가 날 수 있으니 센서를 2개씩 달아야 할 것 같아요...)"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !answer.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            AI 선생님에게 피드백 받기
          </button>
        </div>

        {feedback && (
          <div className="mt-8 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-200 animate-fade-in shadow-inner">
             <h4 className="flex items-center gap-2 font-bold text-indigo-800 mb-3">
               <span className="bg-indigo-600 text-white rounded-full p-1"><Sparkles className="w-3 h-3" /></span>
               AI 선생님의 피드백
             </h4>
             <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabReflection;