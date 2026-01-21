import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const analyzeReflection = async (userReflection: string): Promise<string> => {
  if (!apiKey) {
    return "API Key가 없습니다. AI 피드백을 생성할 수 없습니다.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 한국의 저명한 '데이터 윤리학' 교수님입니다. 학생이 다음 주제에 대해 자신의 생각을 제출했습니다: "편리함을 위해 위치 데이터를 제공하는 것은 괜찮은가?"
        
        학생의 답변을 분석하여 다음을 수행하세요:
        1. 학생이 '편의성'과 '프라이버시' 중 어느 쪽에 더 가치를 두는지 파악하세요.
        2. 학생이 미처 생각하지 못한 반대 관점이나 심화된 질문을 하나 던져주세요 (사고 확장을 위해).
        3. 톤은 격려하며 지적인 어조를 유지하세요. (한국어로 작성)
        4. 150자 이내로 짧게 작성하세요.

        학생의 답변: "${userReflection}"
      `,
    });

    return response.text || "분석을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 윤리 자문단과 연결하는 중 오류가 발생했습니다.";
  }
};