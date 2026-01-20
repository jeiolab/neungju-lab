import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, Difficulty } from "../types";

// Helper to safely parse JSON from Gemini response
const parseJSON = (text: string) => {
  try {
    // Remove code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini", e);
    return null;
  }
};

export const generateScenario = async (category: string, difficulty: Difficulty): Promise<Scenario | null> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Using static data.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Create a single scenario for a high school student to judge if "Binary Search" is possible.
      
      Context:
      - Category: ${category} (School Life, Daily Life, or Career/System)
      - Difficulty: ${difficulty}
      - Concepts: Sorted vs Unsorted Arrays, Dynamic Data (frequent inserts), Search Efficiency.
      
      Output Rules:
      - JSON format only.
      - "correctAnswer" must be one of: "POSSIBLE", "IMPOSSIBLE", "CONDITIONAL".
      - "POSSIBLE": Data is static and sorted.
      - "IMPOSSIBLE": Data is unsorted and sorting is too expensive or impossible/illogical, or data is small enough for linear.
      - "CONDITIONAL": Data is unsorted currently, but sorting is a viable option before searching.
      - Language: Korean.

      JSON Schema:
      {
        "description": "Scenario description string (1-2 sentences)",
        "dataState": "SORTED" | "UNSORTED" | "DYNAMIC",
        "correctAnswer": "POSSIBLE" | "IMPOSSIBLE" | "CONDITIONAL",
        "explanation": "Why correct (1 sentence)",
        "target": "EXISTENCE"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = parseJSON(response.text);
    if (!data) return null;

    return {
      id: Date.now().toString(),
      category: category as any,
      difficulty,
      target: 'EXISTENCE',
      ...data
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getReflectionFeedback = async (questionType: string, userAnswer: string): Promise<string> => {
  if (!process.env.API_KEY) return "API 키가 없어 피드백을 생성할 수 없습니다. (정렬 조건과 데이터 특성을 다시 생각해보세요!)";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are a Computer Science teacher for high schoolers.
      The student answered a reflection question about Binary Search.
      
      Question Type: ${questionType}
      Student Answer: "${userAnswer}"
      
      Provide a brief, encouraging, and corrective feedback (max 2 sentences) in Korean.
      Focus on concepts: Sorting requirement, Time Complexity (O(log n) vs O(n)), Data structure fit.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    });

    return response.text;
  } catch (e) {
    return "피드백 생성 중 오류가 발생했습니다.";
  }
};