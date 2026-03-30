import { GoogleGenAI } from "@/lib/genai-browser-shim";

const getClient = () => {
  const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const evaluateThought = async (userAnswer: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      당신은 파이썬 프로그래밍 튜터입니다.
      학생에게 "전화번호(01012345678)는 숫자로 저장해야 할까, 문자로 저장해야 할까? 그 이유는?"이라는 질문을 했습니다.
      학생의 답변: "${userAnswer}"
      
      학생의 답변에 대해 다음 기준으로 피드백을 제공해주세요:
      1. 정답 여부 (문자열이 권장됨)
      2. 이유 설명 (맨 앞 0이 사라지는 문제, 연산이 필요 없는 데이터, 하이픈 등 서식 포함 가능성 등)
      3. 친절하고 격려하는 톤으로 300자 이내로 답변하세요.
      4. 한국어로 답변하세요.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님과 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.";
  }
};
