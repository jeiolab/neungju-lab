import { GoogleGenAI, Type } from "@google/genai";
import { Concept, QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateQuiz = async (concepts: Concept[], difficulty: string): Promise<QuizQuestion | null> => {
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  const conceptNames = concepts.map(c => c.term).join(', ');
  
  const prompt = `
    Create a single multiple-choice quiz question about one of these concepts: ${conceptNames}.
    Target audience: High school freshman.
    Difficulty: ${difficulty}.
    Language: Korean.
    Focus:
    - Beginner: Definition based.
    - Intermediate: Real-life scenario based.
    - Advanced: Convergence or tricky distinction.
    
    Output structured JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
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
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
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

export const getReflectionFeedback = async (topic: string, userAnswer: string): Promise<string> => {
    if (!apiKey) return "API Key가 설정되지 않았습니다.";

    const prompt = `
      Role: You are a friendly IT teacher.
      Task: The student wrote a reflection on the "Side effects of ${topic}".
      Student Answer: "${userAnswer}"
      
      Instruction:
      1. Acknowledge their point warmly.
      2. Provide one specific constructive insight or a real-world example they missed.
      3. Keep it under 3 sentences.
      4. Language: Korean.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        return response.text || "피드백을 생성할 수 없습니다.";
    } catch (e) {
        console.error(e);
        return "오류가 발생했습니다.";
    }
};

export const getConceptClarification = async (concept: string, confusedWith: string): Promise<string> => {
    // Used for specific mistake feedback
    if (!apiKey) return "";
    
    const prompt = `
        A student confused ${concept} with ${confusedWith} or gave a wrong answer.
        Explain the difference simply in Korean. One sentence.
    `;

    try {
        const response = await ai.models.generateContent({
             model: MODEL_NAME,
             contents: prompt,
        });
        return response.text || "";
    } catch (e) {
        return "";
    }
}
