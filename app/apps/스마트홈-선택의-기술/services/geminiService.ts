import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const evaluateThinkingAnswer = async (question: string, userAnswer: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. (데모 모드: 훌륭한 생각입니다!)";
  }

  try {
    const prompt = `
      당신은 사물인터넷(IoT)과 개인정보보호 교육 전문가입니다.
      학생이 다음 질문에 대해 답변을 작성했습니다.
      
      질문: ${question}
      학생 답변: ${userAnswer}
      
      이 답변에 대해 3줄 이내로 친절하고 구체적인 피드백을 해주세요.
      답변의 창의성이나 논리성을 칭찬하고, 보완할 점이 있다면 부드럽게 제안해주세요.
      존댓말(해요체)을 사용하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서버 연결에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};