import { GoogleGenAI } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const generateExplanation = async (topic: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain "${topic}" in the context of computer networking and data transmission (TCP/IP). 
      Use a simple analogy related to a logistics or courier delivery system. 
      Keep it under 150 words. Be educational and friendly. Language: Korean.`,
    });
    return response.text || "설명을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 서비스 연결에 실패했습니다.";
  }
};

export const checkQuizAnswer = async (question: string, userAnswer: string): Promise<string> => {
    if (!apiKey) return "API Key not configured.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `The user was asked to order the steps of data transmission: "${question}".
            The user provided this order: "${userAnswer}".
            Analyze if this is correct. If correct, praise them. If incorrect, explain the correct order and why, using the packet delivery analogy.
            Keep it under 100 words. Language: Korean.`,
        });
        return response.text || "결과를 분석할 수 없습니다.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "AI 서비스 연결에 실패했습니다.";
    }
}
