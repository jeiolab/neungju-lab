import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-3-flash-preview';

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const prompt = `
      Create 10 multiple-choice questions about the Quick Sort algorithm and Divide & Conquer strategy for high school students.
      The output MUST be in Korean (한국어).
      
      Focus on:
      - Pivot selection importance
      - Partitioning logic
      - Time complexity (Best case O(n log n) vs Worst case O(n^2))
      - The recursive nature of the algorithm.
      
      Vary the difficulty: 3 Easy, 4 Medium, 3 Hard.
      Return the response as a JSON array.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation", "difficulty"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return [];
  }
};

export const evaluateReflection = async (userAnswer: string): Promise<string> => {
  try {
    const prompt = `
      The user is a high school student learning Quick Sort.
      The discussion question is: "If we were to Quick Sort our class by height, who should be the pivot to make it most efficient, and why?"
      
      User's Answer: "${userAnswer}"
      
      Provide a friendly, encouraging, and educational feedback in Korean (한국어). Max 3 sentences.
      If they mentioned choosing a 'median' or 'average' height person, praise them heavily. 
      If they chose shortest/tallest, explain why that leads to O(n^2) behavior in a simple way.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Failed to evaluate reflection:", error);
    return "지금은 피드백을 생성할 수 없습니다.";
  }
};