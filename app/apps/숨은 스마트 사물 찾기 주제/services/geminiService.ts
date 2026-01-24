import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const fetchDetailedExplanation = async (objectName: string, context: string): Promise<string> => {
  if (!ai) {
    return "AI 설명 기능을 사용하려면 API 키가 필요합니다. 하지만 스스로 탐구하는 과정이 훌륭해요!";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 고등학생에게 친절하게 설명해주는 사물인터넷(IoT) 선생님입니다.
        다음 사물에 대해 IoT 관점에서 3문장 이내로 흥미롭게 설명해주세요.
        
        사물 이름: ${objectName}
        상황: ${context}
        
        전문 용어를 사용하되, 고등학생이 이해하기 쉽게 풀어서 설명해주세요.
        말투는 "~해요" 체로 친근하게 부탁합니다.
      `,
    });
    return response.text || "설명을 불러오는 데 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 AI 선생님과 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.";
  }
};
