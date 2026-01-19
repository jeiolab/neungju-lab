import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists (handled gracefully in caller if missing)
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export interface FeedbackResponse {
  score: number;
  feedback: string;
  badgeEarned: boolean;
}

export const analyzeReflection = async (
  situation: string,
  selection: string,
  userText: string
): Promise<FeedbackResponse> => {
  if (!ai) {
    // Fallback if no API Key
    return {
      score: 80,
      feedback: "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. 하지만 훌륭한 생각입니다! 논리적인 근거를 더 보강해보세요.",
      badgeEarned: userText.length > 50
    };
  }

  try {
    const prompt = `
      학생이 자신의 진로 선택에 대해 쓴 글이다.
      상황: ${situation}
      선택한 직업: ${selection}
      학생의 글: "${userText}"

      역할: 진로 코치
      평가 기준:
      1. 근거가 명확한가?
      2. 예시가 있는가?
      3. 대안이나 보완점이 있는가?

      출력 형식(JSON):
      {
        "score": 0~100 사이 정수,
        "feedback": "3문장 이내의 구체적인 피드백 (친절하게)",
        "badgeEarned": true/false (점수가 85점 이상이고 3가지 기준을 잘 충족했을 때)
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest', // Using latest flash for speed
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    const result = JSON.parse(text);
    return {
      score: result.score,
      feedback: result.feedback,
      badgeEarned: result.badgeEarned
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      score: 70,
      feedback: "AI 분석 중 오류가 발생했습니다. 글의 내용이 충분히 구체적인지 확인해보세요.",
      badgeEarned: false
    };
  }
};