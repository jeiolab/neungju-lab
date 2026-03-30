import { GoogleGenAI } from "@/lib/genai-browser-shim";

const getClient = () => {
  const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMentorFeedback = async (userInput: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 '연결의 달인'이라는 앱의 친절한 AI 사수(선배 네트워크 관리자)입니다.
        사용자는 신입 관리자입니다.
        사용자가 "만약 세상의 모든 IP가 고갈된다면 어떤 일이 벌어질까?"라는 질문에 대해 다음과 같이 답변했습니다:
        "${userInput}"

        이 답변에 대해 칭찬과 함께, 네트워크 전문가 관점에서 흥미로운 사실(예: NAT, IPv6의 등장 배경 등)을 덧붙여서 격려하는 피드백을 주세요.
        톤앤매너: 친절함, 격려함, 유머러스함. 200자 이내로 짧고 굵게 답변해주세요.
      `,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple feedback
      }
    });
    
    return response.text || "피드백을 생성하는 중에 문제가 발생했어요. 다시 시도해주세요!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};