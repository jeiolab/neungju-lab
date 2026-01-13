import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const evaluateReasoning = async (
  scenario: string,
  algorithm: string,
  userReasoning: string
): Promise<{ score: number; feedback: string }> => {
  try {
    const ai = getClient();
    const prompt = `
      상황: ${scenario}
      학생이 선택한 알고리즘: ${algorithm}
      학생의 이유: "${userReasoning}"

      너는 정렬 알고리즘 교육 코치야. 학생의 선택과 이유가 논리적인지 평가해줘.
      1. 점수 (0~100)
      2. 피드백 (2문장 이내, 칭찬과 보완점).
      
      응답 형식(JSON):
      {
        "score": number,
        "feedback": "string"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback if API fails
    return {
      score: 50,
      feedback: "API 연결에 문제가 있어 상세 피드백을 불러올 수 없지만, 스스로 고민한 흔적이 보입니다!"
    };
  }
};

export const evaluateThinkingQuestion = async (
  question: string,
  answer: string
): Promise<{ feedback: string }> => {
  try {
    const ai = getClient();
    const prompt = `
      질문: ${question}
      학생의 답변: "${answer}"
      
      이 답변에 대해 교육적인 피드백을 3문장 이내로 제공해줘. 정답 여부보다는 사고 과정을 칭찬해줘.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return { feedback: response.text || "답변 감사합니다." };
  } catch (error) {
    return { feedback: "답변이 잘 기록되었습니다. (AI 피드백 일시 불가)" };
  }
};
