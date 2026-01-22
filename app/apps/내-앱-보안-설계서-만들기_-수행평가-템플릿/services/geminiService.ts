import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Warning: The AI Feedback feature is currently marked as optional/inactive in the UI
// unless an API Key is explicitly provided in the build environment.

export const getAIFeedback = async (designContext: string): Promise<string> => {
  if (!API_KEY) {
    return "AI 피드백 기능이 활성화되지 않았습니다. (API Key Missing)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = 'gemini-3-flash-preview'; 

    const prompt = `
      너는 고등학교 정보 보안 동아리 멘토야. 
      학생이 작성한 앱 보안 설계 내용을 보고 피드백을 해줘.
      
      [학생의 설계]
      ${designContext}

      [요청 사항]
      1. 잘한 점 1가지
      2. 보안 취약점이 될 수 있는 부분 1가지
      3. 추가로 고려하면 좋을 기술 1가지
      
      말투는 친절하고 격려하는 투로 300자 이내로 요약해줘.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결 중 오류가 발생했습니다.";
  }
};
