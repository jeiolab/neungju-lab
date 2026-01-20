import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure this is set in your environment
const ai = new GoogleGenAI({ apiKey });

export const evaluateThinkingAnswer = async (question: string, userAnswer: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. (환경 변수 확인 필요)";
  }

  try {
    const prompt = `
      당신은 친절하고 격려하는 컴퓨터 과학 선생님입니다.
      학생이 객체지향 프로그래밍(OOP) 관련 질문에 대해 답변을 제출했습니다.
      
      질문: "${question}"
      학생 답변: "${userAnswer}"
      
      다음 형식으로 피드백을 제공해주세요:
      1. 잘한 점 (칭찬)
      2. 보완할 점 또는 더 깊게 생각해볼 점 (개념적 오류 수정 포함)
      3. 총평 (짧게)
      
      전문 용어를 너무 어렵게 쓰지 말고, 중고등학생이 이해하기 쉽게 설명해주세요.
      답변은 300자 이내로 요약해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "일시적인 오류로 AI 선생님이 답변을 확인하지 못했어요. 잠시 후 다시 시도해주세요.";
  }
};
