import { GoogleGenAI } from "@google/genai";

const AI_SYSTEM_INSTRUCTION = `
너는 친절하고 논리적인 컴퓨터 선생님이야. 
학생이 네트워크 공유, 파일 공유, 보안 절차에 대한 생각이나 답변을 제출하면, 
그 답변이 논리적으로 타당한지 분석하고, 보완할 점이나 칭찬할 점을 피드백해줘.
답변은 초중고 학생이 이해하기 쉽게 3~4문장으로 간결하게 작성해.
항상 격려하는 말투("~해요", "~군요")를 사용해.
`;

export const getThinkingFeedback = async (question: string, userAnswer: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
    질문: ${question}
    학생 답변: ${userAnswer}
    
    위 답변에 대해 교육적인 피드백을 제공해줘.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 선생님과 연결하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};