import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateExplanation = async (topic: string, context: string) => {
  try {
    // Correct way to use generateContent based on instructions
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the concept of "${topic}" in the context of Reinforcement Learning for a beginner. 
      Context: ${context}. 
      Keep it short (max 3 sentences), encouraging, and easy to understand.`,
    });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 설명을 불러오는데 실패했습니다. (API Key를 확인해주세요)";
  }
};

export const generateQuizQuestion = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a simple multiple-choice quiz question about Reinforcement Learning (Reward, Punishment, Agent, Environment).
      Return ONLY raw JSON with this format:
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctIndex": number,
        "explanation": "string"
      }
      Do not include markdown backticks.`,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return null;
  }
};

export const generateDiscussionInsight = async (scenario: string) => {
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Pro for better reasoning
      contents: `You are an expert AI Ethicist and Engineer. Discuss the following scenario regarding Reinforcement Learning simulation vs reality:
      "${scenario}"
      Provide a balanced view considering safety, efficiency, and ethical implications. Keep it under 150 words.`,
    });
    return result.text;
  } catch (error) {
    return "인사이트를 생성할 수 없습니다.";
  }
};
