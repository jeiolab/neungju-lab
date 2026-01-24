import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askGemini = async (prompt: string, context?: string): Promise<string> => {
  try {
    const fullPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${prompt}\n\nPlease provide a clear, educational answer suitable for a student learning about computer networks.`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: "You are a friendly and knowledgeable network router teaching students about the internet, data packets, and network infrastructure. Use simple analogies.",
      }
    });

    return response.text || "죄송합니다. 현재 응답을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "네트워크 연결 상태를 확인해주세요. (API 호출 실패)";
  }
};