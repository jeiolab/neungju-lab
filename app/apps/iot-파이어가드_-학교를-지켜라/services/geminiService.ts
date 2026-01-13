import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getExpertFeedback = async (userIdea: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 학교 화재 안전 시스템을 설계하는 20년 경력의 수석 엔지니어입니다.
        학생(사용자)이 화재 감지 센서의 오작동을 줄이기 위한 아이디어를 제출했습니다.
        
        학생의 아이디어: "${userIdea}"
        
        다음 지침에 따라 200자 이내로 피드백을 주세요:
        1. 전문가적인 톤을 유지하되 격려해주세요.
        2. 아이디어의 기술적 타당성을 간단히 평가해주세요.
        3. 보완할 점이 있다면 한 문장으로 조언해주세요.
        4. 답변은 한국어로 해주세요.
      `,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "시스템 오류로 전문가 연결에 실패했습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "네트워크 상태가 불안정하여 엔지니어의 응답을 받을 수 없습니다.";
  }
};
