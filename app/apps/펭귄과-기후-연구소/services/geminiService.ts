import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getDrPenguinInsight = async (context: string, userAction: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "펭귄 박사님과 연결이 끊겼습니다. (API Key 확인 필요)";

  try {
    const prompt = `
      당신은 남극의 친절하고 지혜로운 데이터 생태학자 '펭귄 박사'입니다.
      당신의 학생(사용자)이 방금 데이터 분석 작업을 수행했습니다.
      
      상황(Context): ${context}
      사용자 행동(User Action): ${userAction}
      
      짧고 격려하는 피드백을 한국어로(Korean) 2문장 이내로 해주세요.
      만약 사용자가 예측을 수행했다면, 중학생이 이해하기 쉬운 용어로 과학적 개념(추세선, 군집화 등)을 간단히 언급해주세요.
      추운 날씨, 과학, 또는 펭귄과 관련된 이모지를 사용하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "흥미로운 데이터군요! 계속 분석해봅시다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "무전기 신호가 잡음으로 가득합니다... (AI 응답 오류)";
  }
};