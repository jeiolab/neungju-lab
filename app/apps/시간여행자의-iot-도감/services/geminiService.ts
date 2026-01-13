import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateReflectionContent = async (topic: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 AI 답변을 불러올 수 없습니다. (개발 모드)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `당신은 미래 기술 교육 전문가입니다. 학생들에게 '${topic}'에 대해 균형 잡힌 시각을 갖도록 짧은 에세이를 써주세요.
      
      조건:
      1. 초등학생~중학생 수준의 쉬운 언어 사용.
      2. 긍정적인 면(편리함 등)과 부정적인 면(디지털 피로, 보안 등)을 모두 언급.
      3. 마지막에는 학생들이 토론해볼 만한 질문 하나를 던질 것.
      4. 300자 이내로 요약.`,
    });
    return response.text || "내용을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const checkScenarioWithAI = async (scenario: string): Promise<string> => {
    if (!apiKey) return "API 키 없음";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `사용자가 다음 상황이 IoT인지 아닌지 헷갈려합니다: "${scenario}". 
            이것이 IoT인지 아닌지 명확하게 판별하고, 그 이유를 '연결성'과 '데이터' 관점에서 2문장으로 설명해주세요.`
        });
        return response.text || "분석 실패";
    } catch (e) {
        return "AI 분석 중 오류 발생";
    }
}
