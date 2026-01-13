import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDeepDiveExplanation = async (scenario: string): Promise<string> => {
  if (!apiKey) {
    return "API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        너는 고등학생에게 정보 보호와 정보 공유의 중요성을 가르치는 친절한 선생님 AI야.
        다음 상황에 대해 왜 이것을 공유해야 하는지(SHARE), 또는 왜 보호해야 하는지(SHIELD) 법적/윤리적 근거를 들어 3문장 이내로 쉽게 설명해줘.
        
        상황: ${scenario}
      `,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response
      }
    });

    return response.text || "설명을 불러오는 데 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "일시적인 오류로 설명을 가져올 수 없습니다.";
  }
};
