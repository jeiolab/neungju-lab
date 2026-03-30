import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";
import { QuizQuestion } from '../types';

// Initialize the API client
const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateQuizQuestion = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<QuizQuestion | null> => {
  if (!ai) {
    console.warn("API Key not found. Using fallback questions.");
    return null;
  }

  const modelId = "gemini-2.5-flash-latest"; 
  const prompt = `
    Create a single multiple-choice quiz question about the Merge Sort algorithm for a high school student.
    Context: Sorting school festival food orders.
    Difficulty: ${difficulty}.
    Language: Korean.
    
    Return a JSON object with:
    - id: unique string
    - question: string
    - options: string array (4 items)
    - correctAnswer: string (must exactly match one option)
    - explanation: string (why the answer is correct)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"],
        },
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as QuizQuestion;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getThinkingFeedback = async (userAnswer: string, scenario: string): Promise<string> => {
    if (!ai) return "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. 하지만 좋은 생각입니다!";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-latest",
            contents: `
                Student is learning Merge Sort.
                Scenario: ${scenario}
                Student's Answer/Idea: ${userAnswer}
                
                Provide a short, encouraging feedback (in Korean) acting as a supportive coach.
                If the answer is technically sound, praise it. If it has flaws, gently point them out and suggest a fix.
                Keep it under 3 sentences.
            `
        });
        return response.text || "피드백을 생성할 수 없습니다.";
    } catch (e) {
        return "AI 연결에 문제가 발생했습니다.";
    }
}
