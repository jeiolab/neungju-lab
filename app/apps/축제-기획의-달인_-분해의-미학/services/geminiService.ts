import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateReflectionFeedback = async (
  scenario: string,
  userPlan: string,
  constraint: string
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API 키가 설정되지 않았습니다. 기능을 사용할 수 없습니다.";

  const prompt = `
    당신은 베테랑 프로젝트 매니저이자 학교 선생님입니다. 
    학생이 '${scenario}' 프로젝트를 진행하던 중, '${constraint}'라는 제약 조건이 발생했을 때의 대처 계획을 작성했습니다.
    
    학생의 계획: "${userPlan}"

    이 계획에 대해 다음 형식으로 피드백을 주세요:
    1. 칭찬할 점 (논리적 타당성)
    2. 보완할 점 (실현 가능성, 놓친 부분)
    3. 총평 (따뜻하고 격려하는 어조로 100자 이내)
    
    서식은 마크다운을 사용하지 말고 일반 텍스트로 줄바꿈을 명확히 해서 주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
};