import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const explainConcept = async (concept: string, context: string): Promise<string> => {
  if (!apiKey) {
    return "API Key가 설정되지 않았습니다. 데모 모드로 작동 중입니다.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 친절한 암호학 선생님입니다.
        다음 개념에 대해 5세 아이도 이해할 수 있게 아주 간단하고 재미있는 비유를 들어 2문장 이내로 설명해주세요.
        
        개념: ${concept}
        현재 상황: ${context}
      `,
    });
    return response.text || "설명을 불러오는데 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 나중에 다시 시도해주세요.";
  }
};
