import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in process.env");
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getDiscussionFeedback = async (userOpinion: string): Promise<string> => {
  try {
    const client = getClient();
    const model = "gemini-3-flash-preview"; 
    
    const prompt = `
    당신은 고등학교 코딩 멘토입니다. 
    주제: "법을 판결하는 판사를 AI로 대체한다면, 규칙 기반(Rule-based)과 기계학습(Machine Learning) 중 무엇이 더 공정할까?"
    
    학생 의견: "${userOpinion}"

    이 학생의 의견에 대해 다음 구조로 짧고 명쾌한 피드백을 주세요 (200자 내외):
    1. 학생 의견의 핵심 요약
    2. 반대 관점이나 생각해보지 못한 점 제시 (규칙 기반의 경직성 vs 기계학습의 데이터 편향성)
    3. 격려의 멘트
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 멘토 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
};
