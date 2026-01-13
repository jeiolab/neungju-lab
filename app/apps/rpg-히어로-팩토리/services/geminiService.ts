import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateClassExplanation = async (className: string, skills: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `당신은 판타지 RPG 세계관의 친절한 코딩 선생님입니다.
      사용자가 방금 "${className}"라는 클래스를 정의했고, 스킬로는 ${skills.join(', ')}을(를) 가지고 있습니다.
      이 클래스가 어떻게 미래의 객체들을 만들기 위한 "설계도(붕어빵 틀)" 역할을 하는지 한국어로 2문장 이내로 쉽고 재미있게 설명해주세요.
      초보자에게 용기를 주는 말투를 사용하세요.`,
    });
    return response.text || "클래스 정의가 업데이트되었습니다!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "멋진 클래스를 정의하셨네요! (AI 설명을 불러올 수 없습니다)";
  }
};

export const getQuizHint = async (question: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `당신은 코딩 튜터입니다. 다음 파이썬 OOP 질문에 대해 아주 짧고 미묘한 힌트를 한국어로 제공해주세요. 정답을 직접 말하지 마세요.
      질문: ${question}`,
    });
    return response.text || "문법을 자세히 확인해보세요!";
  } catch (error) {
    return "이론 탭을 다시 복습해보세요!";
  }
};