import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchMazeInsight = async (topic: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: `Explain the concept of "${topic}" in the context of finding a treasure on a map.
      Keep it simple, fun, and educational for a student.
      Use an analogy. Max 150 words.
      Write in Korean.`,
    });
    return response.text || "AI 응답을 불러올 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "네트워크 오류로 설명을 불러올 수 없습니다.";
  }
};

export const fetchDynamicQuiz = async (): Promise<{ question: string; options: string[]; answer: number; explanation: string } | null> => {
  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a multiple-choice quiz question about Graph Theory (BFS vs DFS).
      Return JSON format: { "question": "string", "options": ["string", "string", "string", "string"], "answer": int (0-3 index), "explanation": "string" }.
      The tone should be adventurous and fun.
      Write in Korean.`,
       config: {
         responseMimeType: "application/json"
       }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return null;
  }
};