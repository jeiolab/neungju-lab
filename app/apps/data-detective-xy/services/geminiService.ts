import { GoogleGenAI } from "@google/genai";

export const evaluateDeduction = async (userText: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key가 누락되었습니다. 설정을 확인해주세요.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
      당신은 수석 데이터 탐정 멘토(Senior Data Detective Mentor)입니다. 주니어 탐정이 데이터를 분류할 때 1차원보다 2차원(X축과 Y축)을 사용하는 것이 왜 더 좋은지에 대한 추리를 작성했습니다.
      
      주니어 탐정의 추리: "${userText}"
      
      짧고 격려하며 교육적인 피드백을 제공하세요 (최대 3문장). 한국어로 답변하세요.
      그들이 "겹치는 데이터 분리"나 "정보의 결합"에 대해 언급했다면 칭찬해주세요.
      핵심을 놓쳤다면 부드럽게 지도해주세요.
      "셜록 홈즈"나 "느와르 탐정" 페르소나를 유지하세요.
      `,
    });
    
    return response.text || "통신 상태가 좋지 않습니다... 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "본부(HQ)와의 연결이 실패했습니다. (API Key 또는 네트워크를 확인하세요)";
  }
};
