import { GoogleGenAI } from "@/lib/genai-browser-shim";

// Initialize Gemini API
// NOTE: Process.env.API_KEY is assumed to be available
const getAiClient = () => {
  if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
};

export const evaluateThinkingAnswer = async (question: string, userAnswer: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API 키 설정 오류로 AI 선생님을 연결할 수 없어요.";

  try {
    const prompt = `
      당신은 고등학교 1학년 학생에게 네트워크 기술을 가르치는 친절한 선생님입니다.
      학생에게 다음과 같은 심화 질문을 던졌습니다: "${question}"
      학생의 답변: "${userAnswer}"
      
      학생의 답변에 대해 3~4문장으로 피드백을 주세요.
      1. 학생의 생각이 창의적이거나 논리적인지 칭찬해주세요.
      2. 네트워크 관점(유선망의 중요성, 백본망 등)에서 보충 설명을 덧붙여주세요.
      3. 말투는 친절하고 격려하는 말투(~해요, ~했군요)를 사용하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "선생님이 잠시 생각에 잠겼어요. 다시 시도해볼까요?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "통신 상태가 좋지 않아 선생님의 답변을 불러오지 못했어요. 잠시 후 다시 시도해주세요.";
  }
};