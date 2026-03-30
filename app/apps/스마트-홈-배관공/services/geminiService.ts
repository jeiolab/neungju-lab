import { GoogleGenAI } from "@/lib/genai-browser-shim";

const getAiClient = () => {
  const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDiscussionFeedback = async (userThought: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API 키 설정을 확인해주세요.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 친절한 컴퓨터 과학 선생님입니다. 
        학생이 '엣지 컴퓨팅(Edge Computing)'과 '클라우드 컴퓨팅'의 차이, 
        그리고 "인터넷이 끊기면 스마트 홈이 마비되는가?"라는 주제에 대해 자신의 생각을 적었습니다.
        
        학생의 생각: "${userThought}"
        
        학생의 생각에 대해 칭찬하고, 엣지 컴퓨팅이 왜 필요한지(인터넷 없이도 로컬에서 처리 가능함)를 쉽고 재미있게 설명해주세요.
        3문장 이내로 요약해서 답변하세요.
      `,
    });
    return response.text || "답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님과 연결하는 도중 문제가 발생했습니다.";
  }
};