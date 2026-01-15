import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { CaseFile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyMystery = async (): Promise<CaseFile | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a unique, intriguing scenario for a student to determine if it can be solved by Machine Learning. It should be realistic or slightly mysterious.",
      config: {
        systemInstruction: "You are a Game Master for an educational game about Machine Learning feasibility. Generate a JSON response containing a single case file. The case should test understanding of Data Volume, Pattern Regularity, and Randomness/Creativity.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy, detective-style title for the case" },
            description: { type: Type.STRING, description: "The scenario description, written in a request tone to a detective." },
            isSolvable: { type: Type.BOOLEAN, description: "Is this effectively solvable by current ML technology?" },
            hasBigData: { type: Type.BOOLEAN, description: "Is there potentially enough data?" },
            hasPattern: { type: Type.BOOLEAN, description: "Is there a clear pattern or rule?" },
            isCreativeOrRandom: { type: Type.BOOLEAN, description: "Does it require pure creativity or is it random?" },
            explanation: { type: Type.STRING, description: "Detailed explanation of why it is or isn't solvable in the persona of a Chief Detective." }
          },
          required: ["title", "description", "isSolvable", "hasBigData", "hasPattern", "isCreativeOrRandom", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    return {
      id: `daily_${Date.now()}`,
      category: 'generated',
      difficulty: 2,
      title: data.title,
      description: data.description,
      isSolvable: data.isSolvable,
      correctAttributes: {
        hasBigData: data.hasBigData,
        hasPattern: data.hasPattern,
        isCreativeOrRandom: data.isCreativeOrRandom
      },
      explanation: data.explanation
    };

  } catch (error) {
    console.error("Failed to generate mystery:", error);
    return null;
  }
};