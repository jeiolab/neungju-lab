import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateExplanation = async (topic: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an AI teacher explaining Machine Learning concepts to a beginner. 
      Topic: ${topic}
      Context: ${context}
      
      Provide a concise, easy-to-understand explanation (max 2-3 sentences) in Korean. Be encouraging and friendly.`,
    });
    return response.text || "설명을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 다시 시도해주세요.";
  }
};

export const generateBiasScenario = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a short thought-provoking scenario about AI Bias in Supervised Learning for a student.
        Ask: "What happens if we only teach an AI that [Biased Data]?"
        Then explain the consequence briefly.
        Language: Korean.
        Format:
        Q: [Question]
        A: [Consequence]`
    });
    return response.text || "시나리오 생성 실패.";
  } catch (error) {
      return "시나리오를 불러올 수 없습니다.";
  }
}
