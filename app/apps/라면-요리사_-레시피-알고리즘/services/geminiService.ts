import { GoogleGenAI } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const getElevatorFeedback = async (userIdea: string): Promise<string> => {
  if (!apiKey) return "API Key가 설정되지 않았습니다.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 친절한 알고리즘 선생님입니다. 
        사용자가 "엘리베이터가 작동하는 알고리즘"에 대한 아이디어를 제출했습니다.
        
        사용자의 입력: "${userIdea}"
        
        다음 지침에 따라 피드백을 주세요:
        1. 사용자가 고려한 좋은 점을 칭찬해주세요.
        2. 놓치기 쉬운 예외 상황(예: 문이 닫히는데 사람이 낄 때, 만원일 때, 여러 층에서 동시에 눌렀을 때 등)을 1~2가지 질문 형식으로 던져주세요.
        3. 말투는 초등학생~중학생에게 설명하듯 쉽고 친절하게(존댓말) 해주세요.
        4. 답변은 300자 이내로 핵심만 말해주세요.
      `,
    });
    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "죄송해요, 지금은 선생님과 연결이 원활하지 않아요. 잠시 후 다시 시도해주세요.";
  }
};
