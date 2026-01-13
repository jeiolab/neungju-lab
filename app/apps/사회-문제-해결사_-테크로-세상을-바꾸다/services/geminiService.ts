import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluateIdea = async (problemTitle: string, userIdea: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      당신은 친절하고 전문적인 '소셜 벤처 멘토'입니다.
      사용자가 "${problemTitle}" 문제에 대해 다음과 같은 아이디어를 냈습니다:
      "${userIdea}"
      
      이 아이디어에 대해 다음 구조로 피드백을 주세요:
      1. 칭찬 (아이디어의 좋은 점)
      2. 보완점 (기술적으로나 현실적으로 고려할 점)
      3. 기대 효과 (이 아이디어가 실현되면 세상이 어떻게 변할지)
      
      말투는 격려하듯이 부드럽게 해주세요. 200자 이내로 요약해주세요.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "죄송합니다. AI가 답변을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};