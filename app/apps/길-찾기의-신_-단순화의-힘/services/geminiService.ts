import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";
import { QuizQuestion } from '../types';

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
// Initialize conditionally to prevent crashes if key is missing during dev, 
// though prompts say assume it's valid.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateQuizQuestion = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<QuizQuestion | null> => {
  if (!ai) return null;

  try {
    const prompt = `
      Create a multiple-choice quiz question about "Abstraction in Computer Science" and "Graph Theory (Modeling)".
      Difficulty: ${difficulty}.
      Language: Korean.
      The question should focus on how we simplify complex reality into nodes and edges, or why we remove unnecessary details (abstraction).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    return JSON.parse(jsonText) as QuizQuestion;

  } catch (error) {
    console.error("Error generating quiz:", error);
    return null;
  }
};

export const getAIHint = async (nodesCount: number, noiseCount: number): Promise<string> => {
  if (!ai) return "핵심 지점만 남기고 나머지는 지워보세요.";

  try {
    const prompt = `
      The user is playing a game where they map a city into a graph.
      They have selected ${nodesCount} correct nodes and clicked ${noiseCount} irrelevant noise objects (like trees or decorative buildings).
      Give a short, 1-sentence hint in Korean.
      If noiseCount is high, tell them to focus on abstraction and ignoring details.
      If nodesCount is low, encourage them to find major intersections.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "핵심만 남기세요!";
  } catch (error) {
    return "불필요한 정보는 과감히 버리세요.";
  }
};