import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, MethodType } from "../types";

const apiKey = process.env.API_KEY || ''; // Assumption: managed by environment
const ai = new GoogleGenAI({ apiKey });

// Helper to validate the key exists before calling
const checkApiKey = () => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Using fallback/mock data logic would go here in production.");
    // In this demo, we might fail or return a static fallback if the key is missing, 
    // but the prompt implies we should implement the API logic.
    return false;
  }
  return true;
};

export const generateScenario = async (difficulty: 'easy' | 'hard' = 'easy'): Promise<Scenario | null> => {
  if (!checkApiKey()) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a random realistic scenario where a user needs to transfer data. 
      Difficulty: ${difficulty}. 
      The scenario should strictly relate to choosing between: Wi-Fi, Bluetooth, NFC, Cloud, Mobile, Wired.
      
      Return JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "The scenario description (Korean)" },
            correctMethod: { type: Type.STRING, description: "One of: Wi-Fi, Bluetooth, NFC, Cloud, Mobile, Wired" },
            reasoning: { type: Type.STRING, description: "Why this is the best method (Korean)" },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Relevant tags e.g. distance, security, speed" 
            }
          },
          required: ["description", "correctMethod", "reasoning", "tags"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        id: crypto.randomUUID(),
        description: data.description,
        correctMethod: data.correctMethod as MethodType,
        reasoning: data.reasoning,
        tags: data.tags
      };
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getSimulationFeedback = async (
  distance: string, 
  size: string, 
  internet: string, 
  security: string
): Promise<string> => {
  if (!checkApiKey()) return "API 키가 없어 AI 피드백을 불러올 수 없습니다.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User inputs: Distance=${distance}, FileSize=${size}, Internet=${internet}, Security=${security}.
      Recommend the best data transmission method and explain why in 2-3 sentences in Korean.`
    });
    return response.text || "피드백 생성 실패";
  } catch (e) {
    return "연결 오류";
  }
};
