import { GoogleGenAI } from "@/lib/genai-browser-shim";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
};

export const getTutorResponse = async (userQuery: string, context: string): Promise<string> => {
  const client = getAiClient();
  if (!client) return "API 키가 설정되지 않았습니다.";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Role: 당신은 친절하고 전문적인 '시니어 데이터 엔지니어' 멘토입니다.
        Context: 학생은 빅데이터 전처리(ETL) 과정을 배우고 있습니다.
        Specific Context: ${context}
        User Query: ${userQuery}
        
        Instruction: 
        1. 한국어로 답변하세요.
        2. 명확하고 간결하게(최대 3문장) 설명하세요.
        3. 학생을 격려하는 말투를 사용하고, 데이터 품질과 구조의 중요성을 강조하세요.
      `,
    });
    return response.text || "죄송합니다. 현재 답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "데이터 센터 연결에 문제가 발생했습니다 (API 오류).";
  }
};