import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getReflectionFeedback = async (
  originalStep: string, 
  userProposal: string
): Promise<string> => {
  try {
    const prompt = `
      너는 고등학교 1학년 학생에게 '지능형 에이전트 루프(인식-학습-추론-행동)'를 가르치는 친절하고 논리적인 '퍼즐 코치'야.
      학생이 '${originalStep}' 단계를 다르게 바꾸거나 개선하는 아이디어를 냈어.
      
      학생의 아이디어: "${userProposal}"
      
      이 아이디어가 에이전트의 루프에 어떤 영향을 미칠지, 어떤 장점이나 예상되는 문제가 있을지 3문장 이내로 쉽고 격려하는 톤으로 피드백해줘.
      전문 용어보다는 쉬운 비유를 사용해.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성하는 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 연결 상태가 좋지 않습니다. 잠시 후 다시 시도해주세요.";
  }
};