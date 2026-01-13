import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getReflectionFeedback = async (userText: string) => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      너는 고등학생의 멘토 선생님이야. 
      학생이 자신의 일상 생활 속 활동을 'AI가 할 일', '인간이 할 일', '조건부' 등으로 나누어 보았어.
      
      학생의 글: "${userText}"
      
      이 글을 읽고 다음 두 가지를 피드백해줘:
      1. 학생이 역할을 논리적으로 잘 나누었는지 칭찬해줘.
      2. 놓친 부분(예: 윤리적 문제, 데이터 편향, 감정의 중요성)이 있다면 부드럽게 질문을 던져줘.
      
      말투는 친절하고 격려하는 말투로 3문장 이내로 짧게 부탁해.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 하지만 스스로 고민한 내용은 아주 훌륭해요!";
  }
};
