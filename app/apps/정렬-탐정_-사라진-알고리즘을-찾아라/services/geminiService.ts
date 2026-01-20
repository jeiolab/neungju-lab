import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, ThinkProblem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-3-flash-preview';

export const generateQuizQuestion = async (difficulty: 'easy' | 'hard'): Promise<QuizQuestion | null> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate a multiple-choice quiz question about sorting algorithms (Bubble, Selection, Insertion, Quick Sort) in Korean. 
      Difficulty: ${difficulty}. 
      Focus on logic, time complexity, or recognizing intermediate states.
      Provide 4 options.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              maxItems: 4,
              minItems: 4
            },
            answer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "answer", "explanation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion;
    }
    return null;
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return null;
  }
};

export const generateThinkProblem = async (): Promise<ThinkProblem | null> => {
  try {
    const response = await ai.models.generateContent({
        model: modelName,
        contents: "Create a 'Think About It' logic puzzle related to sorting algorithms in Korean. It should present a scenario (e.g., 'If the array is reverse sorted...') and ask for a prediction or analysis. Do not make it a multiple choice.",
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    scenario: { type: Type.STRING },
                    question: { type: Type.STRING },
                    hint: { type: Type.STRING },
                    answerKey: { type: Type.STRING, description: "The correct reasoning/answer" }
                }
            }
        }
    });
    
    if (response.text) {
        return JSON.parse(response.text) as ThinkProblem;
    }
    return null;
  } catch (error) {
    console.error("Gemini Think Error:", error);
    return null;
  }
};

export const getAlgorithmHint = async (algo: string, arrayState: number[], sortedIndices: number[]): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `I am looking at a sorting visualization for ${algo}. 
            The array currently looks like: [${arrayState.join(', ')}]. 
            Indices marked as sorted: [${sortedIndices.join(', ')}].
            Give me a subtle detective hint about what characteristic feature of ${algo} is visible right now.
            Respond in Korean. Do not name the algorithm directly. Max 1 sentence.`,
        });
        return response.text || "정렬된 부분을 주의 깊게 살펴보세요.";
    } catch (e) {
        return "이미 정렬된 원소가 무엇인지 자세히 보세요.";
    }
}