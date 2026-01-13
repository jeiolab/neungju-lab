import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getReflectionFeedback = async (
  topic: string,
  userAnswer: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API 키가 설정되지 않았습니다.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        당신은 친절하고 격려를 아끼지 않는 고등학교 1학년 인공지능 선생님입니다.
        학생이 의사결정트리(Decision Tree)와 관련된 주제인 "${topic}"에 대해 다음과 같이 답했습니다.
        
        학생 답변: "${userAnswer}"

        이 답변에 대해 3문장 이내로 피드백을 주세요.
        1. 잘 이해한 점 칭찬
        2. 보완하거나 더 생각해볼 점 제시 (부드럽게)
        3. 말투는 친근하게 (~해요 체)
      `,
    });
    return response.text || "피드백을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 다시 시도해주세요.";
  }
};

export const getConceptExplanation = async (concept: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API 키가 설정되지 않았습니다.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        고등학생에게 의사결정트리의 개념 중 "${concept}"에 대해 아주 쉽고 직관적인 비유를 들어서 2문장으로 설명해주세요.
        이모지를 1개 이상 사용하세요.
      `,
    });
    return response.text || "설명을 불러오지 못했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "설명을 불러오는 중 오류가 발생했습니다.";
  }
};
