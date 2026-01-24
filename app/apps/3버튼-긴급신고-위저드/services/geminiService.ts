import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getGeminiFeedback = async (
  prompt: string,
  context: string
): Promise<string> => {
  if (!ai) {
    return "AI 서비스가 설정되지 않았습니다. API 키를 확인해주세요.";
  }

  try {
    const fullPrompt = `
      You are an expert IoT Systems Engineering Coach for students.
      Context: The student is designing a 3-button silent emergency alert system.
      A=Ambulance(Group 10), B=Fire(Group 20), A+B=Police(Group 30).
      
      Task: Provide constructive feedback (max 100 words) in Korean language on the student's input regarding: ${context}.
      Student Input: "${prompt}"
      
      Focus on feasibility, edge cases, and clarity. Be encouraging but technical. Reply in Korean.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "지금은 피드백을 생성할 수 없습니다. 나중에 다시 시도해주세요.";
  }
};
