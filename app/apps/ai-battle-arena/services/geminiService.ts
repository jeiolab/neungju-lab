import { GoogleGenAI, Type } from "@google/genai";
import { CardData, LearningType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateChallengeCard = async (currentDifficulty: string): Promise<CardData | null> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning null to use fallback data.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a single machine learning scenario card for a game. 
      The difficulty should be ${currentDifficulty}.
      The scenario should be either a Supervised Learning or Unsupervised Learning problem.
      The output must be a valid JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The scenario description text (Korean)" },
            type: { type: Type.STRING, enum: ["SUPERVISED", "UNSUPERVISED"], description: "The learning type" },
            difficulty: { type: Type.STRING, enum: ["EASY", "MEDIUM", "HARD"] },
            explanation: { type: Type.STRING, description: "Why it is this type (Korean)" }
          },
          required: ["text", "type", "difficulty", "explanation"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    return {
      id: `gen-${Date.now()}`,
      text: data.text,
      type: data.type === 'SUPERVISED' ? LearningType.SUPERVISED : LearningType.UNSUPERVISED,
      difficulty: data.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
      explanation: data.explanation
    };

  } catch (error) {
    console.error("Failed to generate card with Gemini:", error);
    return null;
  }
};

export const getAiExplanation = async (topic: string): Promise<string> => {
  if (!apiKey) return "API 키가 설정되지 않아 AI 설명을 불러올 수 없습니다.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the concept of "${topic}" in machine learning to a beginner in Korean. Keep it under 200 characters and use a friendly, referee-like tone.`
    });
    return response.text || "설명을 생성하는 데 실패했습니다.";
  } catch (error) {
    console.error(error);
    return "오류가 발생했습니다.";
  }
};