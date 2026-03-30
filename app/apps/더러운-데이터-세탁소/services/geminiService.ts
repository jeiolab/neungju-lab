import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";
import { QuizQuestion } from '../types';

const getAiClient = () => {
  const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuizQuestion = async (topic: string): Promise<QuizQuestion | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a single multiple-choice quiz question about data preprocessing, specifically focusing on ${topic}. 
      The language must be Korean.
      The difficulty should be intermediate.
      Format the output as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswer: { 
              type: Type.INTEGER, 
              description: "The index of the correct answer (0-3)" 
            },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion;
    }
    return null;
  } catch (error) {
    console.error("Failed to generate quiz question:", error);
    return null;
  }
};

export const evaluateDiscussionAnswer = async (question: string, userAnswer: string) => {
  const ai = getAiClient();
  if (!ai) return { feedback: "AI 서비스를 사용할 수 없습니다.", score: 0 };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are a senior data scientist teaching a Korean student.
        Context: Data Preprocessing / Unit Standardization.
        Question: "${question}"
        Student Answer: "${userAnswer}"
        
        Evaluate the answer. If they mention converting to a common unit (like cm or m) and consistency, give a high score.
        Provide a short, constructive feedback message in Korean (max 2 sentences).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Score out of 100" },
            feedback: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { feedback: "평가할 수 없습니다.", score: 0 };
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return { feedback: "AI 튜터 연결 오류.", score: 0 };
  }
};