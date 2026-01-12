import { GoogleGenAI } from "@google/genai";

const apiKey = typeof window === 'undefined' ? process.env.API_KEY : (process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_API_KEY || '');
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeOpinion = async (opinion: string): Promise<string> => {
  if (!ai) {
    return "API 키가 설정되지 않아 의견을 분석할 수 없습니다. 관리자에게 문의하세요.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 친절하고 전문적인 정보 보안 컨설턴트입니다. 
        학생이 작성한 "생체 인식(지문, 홍채 등)을 비밀번호로 사용하는 것에 대한 의견"을 분석해주세요.
        
        학생의 의견: "${opinion}"
        
        다음 지침에 따라 답변해 주세요:
        1. 학생의 의견에 공감하고 칭찬해 주세요.
        2. 보안 전문가 입장에서 추가적으로 고려해야 할 점이나 흥미로운 사실을 짧게(1~2문장) 덧붙여 주세요.
        3. 전체적으로 격려하는 톤을 유지하세요.
        4. 답변은 한국어로, 300자 이내로 작성하세요.
      `,
    });
    return response.text || "분석에 실패했습니다. 다시 시도해 주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 AI 보안 컨설턴트와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.";
  }
};