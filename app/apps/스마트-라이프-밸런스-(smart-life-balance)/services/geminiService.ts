import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getDebateFeedback = async (topic: string, opinion: string): Promise<string> => {
  if (!ai) {
    return "AI 피드백 기능을 사용하려면 API 키가 필요합니다. 하지만 스스로 생각해보는 과정이 훌륭해요!";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 디지털 윤리 선생님입니다.
        토론 주제: "${topic}"
        학생의 의견: "${opinion}"
        
        학생의 의견에 대해 칭찬 한 마디와, 균형 잡힌 시각을 위해 생각해볼 만한 반대 측면이나 보완점을 2-3문장으로 친절하게 답변해주세요. 한국어로 작성하세요.
      `,
    });
    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 연결 중 오류가 발생했습니다.";
  }
};

export const getScenarioConsequence = async (title: string, choice: string): Promise<string> => {
  if (!ai) {
    return "AI 분석 기능을 사용하려면 API 키가 필요합니다. 하지만 스스로 결과를 생각해보는 과정이 중요해요!";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        상황: ${title}
        사용자의 선택: ${choice}
        
        이 선택이 가져올 수 있는 긍정적인 면(편리함 등)과 부정적인 면(프라이버시 침해 등)을 종합하여 
        1문장으로 짧고 강렬한 결과를 묘사해주세요. 한국어로 작성하세요.
        예시: "CCTV 설치로 범죄율은 줄었지만, 주민들은 누군가 지켜본다는 불안감을 느낍니다."
      `,
    });
    return response.text || "결과를 불러오는 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "결과를 분석하는 중입니다...";
  }
};
