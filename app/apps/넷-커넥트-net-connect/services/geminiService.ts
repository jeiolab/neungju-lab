import { GoogleGenAI } from "@/lib/genai-browser-shim";

const getClient = () => {
  const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const askNetworkExpert = async (question: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: `
          당신은 '네트워크 연결왕' 앱의 친절하고 박식한 네트워크 컨설턴트 선생님입니다.
          초등학생, 중학생 수준의 눈높이에 맞춰서 설명해주세요.
          어려운 전문 용어는 쉽게 풀어서 설명하고, 적절한 비유를 사용하세요.
          답변은 한국어로 작성하며, 너무 길지 않게 3-4문단 이내로 요약해주세요.
          마지막에는 학생에게 생각할 거리를 주는 질문을 하나 던져주세요.
        `,
      },
    });
    return response.text || "죄송합니다. 답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "네트워크 연결 상태가 좋지 않아 답변을 가져올 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};
