import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const checkProjectDesign = async (designText: string): Promise<string> => {
  try {
    const prompt = `
      당신은 고등학교 정보 교과 선생님이자 개인정보보호 전문가입니다.
      학생이 제출한 다음 "데이터 공유 프로젝트 계획"을 평가해주세요.
      
      학생의 계획: "${designText}"
      
      다음 기준에 따라 300자 이내로 피드백을 주세요:
      1. 개인정보 침해 위험이 없는지.
      2. 데이터의 유용성(활용 가치)이 충분한지.
      3. 가명화/익명화 조치가 적절한지.
      
      어투는 친절하고 격려하는 선생님처럼 해주세요. 구체적인 개선점 1가지를 포함하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 나중에 다시 시도해주세요.";
  }
};

export const getContextualQuizFeedback = async (question: string, userAnswer: string, correctAnswer: string): Promise<string> => {
  try {
    const prompt = `
      학생이 퀴즈를 틀렸습니다. 
      문제: "${question}"
      학생 답: "${userAnswer}"
      정답: "${correctAnswer}"
      
      왜 틀렸는지, 그리고 정답이 왜 정답인지 고등학생 눈높이에서 2문장으로 설명해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "해설을 불러올 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "해설 로딩 중 오류가 발생했습니다.";
  }
};