import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { BrainCircuit, Send, Sparkles, AlertTriangle } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key is missing in environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        사용자는 K-평균 군집화 알고리즘을 배우는 고등학교 1학년 학생입니다.
        학생이 작성한 다음 생각/질문에 대해 친절하고 교육적인 피드백을 제공해주세요.
        
        학생 입력: "${input}"
        
        지침:
        1. 3줄 이내로 간결하게 답변하세요.
        2. K-평균의 한계(예: 원형이 아닌 데이터, K 결정의 어려움, 초기값 민감성)와 관련된 내용이라면 칭찬해주세요.
        3. 실생활 예시(예: 옷 사이즈, 마케팅 고객 분류)를 들어주면 좋습니다.
        4. 말투는 격려하는 선생님처럼 해주세요.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResponse(result.text || "답변을 생성할 수 없습니다.");
    } catch (err: any) {
      console.error(err);
      setError("AI 피드백을 불러오는 중 문제가 발생했습니다. (API 키 확인 필요)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <BrainCircuit className="w-8 h-8" />
          깊게 생각해보기
        </h2>
        <p className="text-indigo-100">
          K-평균이 만능은 아닙니다. 아래 질문 중 하나를 골라 내 생각을 적어보세요. AI 선생님이 피드백을 줄 거예요!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 hover:border-indigo-300">
          <strong>Q1. 반례 찾기</strong><br/>
          도넛 모양처럼 서로 감싸고 있는 데이터는 K-평균으로 잘 묶일까요?
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 hover:border-indigo-300">
          <strong>Q2. 실생활 적용</strong><br/>
          우리 학교 학생들의 키와 몸무게 데이터로 '체육복 사이즈(S/M/L)'를 만든다면 어떻게 해야 할까요?
        </div>
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="여기에 자유롭게 생각을 적어보세요..."
          className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !input.trim()}
          className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:bg-slate-300 transition-colors shadow-md"
        >
          {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Send className="w-5 h-5" />}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {response && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-3 text-indigo-800 font-bold">
            <Sparkles className="w-5 h-5" />
            AI 선생님의 피드백
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {response}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;
