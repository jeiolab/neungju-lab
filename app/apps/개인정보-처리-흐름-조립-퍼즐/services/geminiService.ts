import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const evaluateSubjectiveAnswer = async (question: string, userAnswer: string, modelAnswer: string): Promise<{ score: number; feedback: string }> => {
  if (!apiKey) {
    return {
      score: 0,
      feedback: "API 키가 설정되지 않아 AI 채점을 진행할 수 없습니다."
    };
  }

  try {
    const prompt = `
      당신은 고등학교 정보 교과 선생님입니다. 
      학생이 개인정보 보호와 관련된 서술형 문제에 답을 했습니다.
      
      문제: "${question}"
      모범 답안의 핵심: "${modelAnswer}"
      학생의 답안: "${userAnswer}"

      다음 형식의 JSON으로만 응답해 주세요:
      {
        "score": (0~100 사이의 점수, 정수),
        "feedback": (학생에게 주는 친절하고 구체적인 피드백, 2~3문장, 한국어)
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    return {
      score: result.score,
      feedback: result.feedback
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      score: 0,
      feedback: "채점 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    };
  }
};
