import { GoogleGenAI } from "@google/genai";

export const analyzeReflection = async (userInput: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. 하지만 훌륭한 반례를 생각해보셨네요!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using a lightweight model for quick textual feedback
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        사용자(학생)는 "학급 공유 규칙 헌장"을 만들고 있습니다.
        사용자가 생각한 "규칙이 있어도 뚫리는 상황(반례)"에 대해 교육적인 피드백을 주세요.
        
        사용자 입력: "${userInput}"
        
        다음 조건으로 답변하세요:
        1. 3줄 이내로 간결하게.
        2. 친절하고 격려하는 말투.
        3. 이 문제점을 보완할 수 있는 짧은 팁 하나 추가.
      `,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};