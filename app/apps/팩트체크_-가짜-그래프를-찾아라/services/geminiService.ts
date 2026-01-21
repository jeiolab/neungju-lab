import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const evaluateReflection = async (userResponse: string): Promise<{ score: number; feedback: string }> => {
  const ai = getClient();
  if (!ai) {
    return {
      score: 85,
      feedback: "API 키가 누락되었습니다. 시뮬레이션 피드백: 시각적 조작이 여론에 미치는 영향에 대한 훌륭한 통찰력입니다!",
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Answer: "${userResponse}"
      
      Task: 당신은 "데이터 리터러시 탐정" 멘토입니다. "통계 그래프로 사람들을 속이는 것이 왜 위험할까?"라는 질문에 대한 사용자의 답변을 평가하세요.
      
      Output Requirements:
      1. Provide a score out of 100 based on depth of critical thinking.
      2. Provide a 1-sentence witty but educational feedback comment in Korean (한국어).
      3. Return ONLY a JSON object: { "score": number, "feedback": "string" }`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      score: 0,
      feedback: "탐정 사무소가 현재 오프라인 상태입니다 (API 오류). 나중에 다시 시도해주세요.",
    };
  }
};