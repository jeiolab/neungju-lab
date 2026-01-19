import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzeUserOpinion = async (userOpinion: string): Promise<string> => {
  if (!apiKey) {
    return "API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.";
  }

  try {
    const prompt = `
      당신은 '미래 직업 연구소의 수석 분석가'입니다. 
      학생이 "AI가 감정을 흉내내는 것과 실제로 느끼는 것의 차이"에 대해 다음과 같은 의견을 냈습니다.
      
      학생 의견: "${userOpinion}"
      
      이 의견에 대해 다음 구조로 피드백을 주세요:
      1. [분석]: 학생의 논리에서 훌륭한 점 (칭찬).
      2. [심화]: 감성 컴퓨팅(Affective Computing) 또는 철학적 관점(중국어 방 논증 등)을 들어 더 깊게 생각해볼 질문 하나 던지기.
      3. [결론]: 인간만이 가질 수 있는 고유한 가치에 대한 격려.
      
      어조는 정중하고 분석적이며, 교육적이어야 합니다. 500자 이내로 요약해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "분석 결과를 가져올 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 AI 분석 서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.";
  }
};