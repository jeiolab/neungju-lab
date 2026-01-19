import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const evaluateCriticalThinking = async (
  scenarioTitle: string,
  userReflection: string,
  currentType: string
): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 AI 선생님의 피드백을 받을 수 없습니다.";
  }

  try {
    const prompt = `
      상황: 학생이 '${scenarioTitle}'라는 에이전트에 대해 생각하고 있습니다.
      이 에이전트는 원래 '${currentType}'로 분류됩니다.
      학생이 이 에이전트가 다른 유형으로 바뀌거나, 분류가 틀릴 수 있는 조건(반례)에 대해 다음과 같이 적었습니다:
      "${userReflection}"

      당신은 친절하고 통찰력 있는 "에이전트 감별사 선생님"입니다. 
      학생의 생각이 타당한지, 어떤 부분이 창의적인지, 혹은 어떤 개념을 보충하면 좋을지 3문장 이내로 피드백을 주세요.
      이모지를 적절히 사용하여 격려해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 바빠서 피드백을 줄 수 없어요. 잠시 후 다시 시도해주세요.";
  }
};