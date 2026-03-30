import { GoogleGenAI } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getGeminiExplanation = async (topic: string, context: string): Promise<string> => {
  if (!ai) {
    return "API 키가 설정되지 않았어요. 환경 변수 GEMINI_API_KEY 또는 NEXT_PUBLIC_GEMINI_API_KEY를 설정해주세요.";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 "열쇠의 미스터리"라는 암호화 교육 앱의 AI 튜터입니다.
        대상 독자는 암호화를 처음 배우는 일반인 또는 학생입니다.
        다음 주제에 대해 쉽고 친절하게, 비유를 사용하여 설명해주세요.
        
        주제: ${topic}
        상황/문맥: ${context}
        
        설명은 3문장 이내로 요약해서 답변해주세요.
      `,
    });
    return response.text || "AI 설명을 불러오지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 통신 상태가 불안정하여 설명을 가져올 수 없습니다.";
  }
};

export const analyzeVulnerability = async (scenario: string, wrongChoice: string): Promise<string> => {
  if (!ai) {
    return "API 키가 설정되지 않았어요. 환경 변수 GEMINI_API_KEY 또는 NEXT_PUBLIC_GEMINI_API_KEY를 설정해주세요.";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        사용자가 암호화 퀴즈에서 오답을 선택했습니다. 취약점 분석 리포트를 작성해주세요.
        
        시나리오: ${scenario}
        사용자의 잘못된 선택: ${wrongChoice}
        
        이 선택이 왜 보안상 위험한지, 해커(이브)가 어떻게 악용할 수 있는지 경고하는 톤으로 설명해주세요.
        텍스트는 150자 이내로 작성하세요.
      `,
    });
    return response.text || "분석 리포트를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "오류가 발생했습니다.";
  }
};
