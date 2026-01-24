import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const evaluateReflection = async (userThought: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 누락되었습니다. 피드백을 받을 수 없습니다.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 친절한 컴퓨터 과학 선생님입니다. 한국어로 답변해주세요.
        학생이 다음 주제에 대해 자신의 생각을 적었습니다:
        "모든 사물이 인터넷에 연결된 스마트홈의 장점과 단점은 무엇일까요?"

        학생의 답변: "${userThought}"

        짧고 격려하는 피드백을 제공해주세요 (최대 3문장).
        학생이 잘 지적한 점 하나를 칭찬하고, 추가로 생각해볼 만한 점(예: 보안, 프라이버시, 의존성 등)을 하나 제안해주세요.
      `,
    });
    return response.text || "생각해보기 주제에 대해 아주 잘 작성했습니다!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "죄송합니다. 현재 AI 선생님과 연결할 수 없습니다. 하지만 훌륭한 생각입니다!";
  }
};