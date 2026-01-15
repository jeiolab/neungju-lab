import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const getReflectionFeedback = async (question: string, userAnswer: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      You are an encouraging and knowledgeable Machine Learning tutor for high school students.
      The student is using an app called "ML Trade-off Decision Coach".
      
      The student answered a reflection question.
      
      Question: "${question}"
      Student Answer: "${userAnswer}"
      
      Please provide brief, constructive feedback in KOREAN (max 3 sentences). 
      1. Acknowledge a good point in their answer.
      2. Correct any major misconceptions if present.
      3. Suggest one deeper angle to think about.
      
      Keep the tone friendly and coaching-like.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "좋은 시도입니다! 현재 두뇌 연결이 원활하지 않아 구체적인 피드백을 드리기 어렵지만, 데이터의 품질이 결과에 미치는 영향을 계속 고민해보세요.";
  }
};