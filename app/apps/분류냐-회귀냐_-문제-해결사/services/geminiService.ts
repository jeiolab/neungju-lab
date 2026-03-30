import { GoogleGenAI } from "@/lib/genai-browser-shim";

const getAiClient = () => {
  if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) {
    throw new Error("API Key is missing. Set OPENROUTER_API_KEY and NEXT_PUBLIC_LLM_READY in .env.local.");
  }
  return new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
};

export const evaluateReflection = async (
  userThought: string,
  scenario: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      당신은 고등학교 1학년 학생들에게 인공지능 기초(분류 vs 회귀)를 가르치는 친절하고 통찰력 있는 선생님입니다.
      
      학생에게 주어진 생각할 문제: "${scenario}"
      학생의 답변: "${userThought}"

      이 학생의 답변을 평가해주세요.
      1. 분류와 회귀의 개념을 올바르게 적용했는지 확인해주세요.
      2. 학생의 답변에 대한 칭찬과 함께, 더 깊게 생각해볼 만한 점을 3문장 이내로 짧고 쉽게 조언해주세요.
      3. 말투는 친근하게 해요체(~해요)를 사용하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "죄송합니다. 선생님이 잠시 다른 생각을 하느라 답변을 놓쳤어요. 다시 시도해 주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님과 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.";
  }
};
