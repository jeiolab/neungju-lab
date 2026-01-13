import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: process.env.API_KEY is guaranteed to be available by the runtime environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchGalaxyFact = async (galaxyType: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      당신은 '데이터 분류 연구소'의 천문학 전문가입니다.
      ${galaxyType} 은하에 대해 초등학생도 이해할 수 있는 흥미로운 과학적 사실을 하나만 짧고 굵게(100자 이내) 설명해주세요.
      매번 조금씩 다른 내용을 이야기해주면 좋습니다.
      말투는 친절하고 전문적인 연구원 톤을 유지하세요.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "데이터 통신에 실패했습니다. 별빛이 너무 희미하네요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "통신 오류: 은하 데이터를 불러올 수 없습니다.";
  }
};

export const fetchQuizExplanation = async (topic: string, isCorrect: boolean): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const status = isCorrect ? "정답입니다!" : "오답입니다.";
    const prompt = `
      사용자가 머신러닝 퀴즈를 풀었습니다. 주제는 '${topic}'입니다.
      결과: ${status}
      
      이 주제(분류/회귀/군집 등)에 대해 아주 쉽고 비유적인 설명을 한 문장으로 해주세요.
      예: "분류는 강아지와 고양이를 나누는 것이고, 회귀는 내일의 온도를 맞추는 거예요!"
      친절한 연구원 톤으로 작성하세요.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "설명 데이터를 로드할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "설명을 불러오는 중 오류가 발생했습니다.";
  }
};