import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiThinking = async (prompt: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a friendly and educational AI assistant for a Social Network Analysis learning app for students.
        Context: ${context}
        
        User Question/Input: ${prompt}
        
        Please provide a helpful, encouraging, and concise response in Korean. 
        Focus on explaining graph theory concepts (nodes, edges, centrality, isolation) simply.
      `,
    });
    return response.text || "죄송합니다. 지금은 답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const evaluateSolution = async (solution: string, scenario: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Scenario: ${scenario}
        Student's Solution: ${solution}
        
        Evaluate the student's solution regarding social network theory (connecting isolated nodes).
        Give constructive feedback in Korean. Compliment them if it makes sense, or suggest a better approach if it's flawed.
      `,
    });
    return response.text || "평가 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "오류가 발생했습니다.";
  }
}
