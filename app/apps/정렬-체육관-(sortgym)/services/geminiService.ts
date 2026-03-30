import { GoogleGenAI } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const getReflectionFeedback = async (topic: string, userAnswer: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 AI 코치의 피드백을 받을 수 없습니다. (데모 모드: 정답은 상황에 따라 다르지만, 일반적으로 데이터 크기가 작으면 삽입/버블이, 크면 퀵/병합이 유리합니다.)";
  }

  try {
    const prompt = `
    당신은 알고리즘 교육 전문가입니다. 학생이 정렬 알고리즘의 트레이드오프에 대해 다음과 같이 답했습니다.
    
    질문 주제: ${topic}
    학생 답변: ${userAnswer}

    학생의 답변을 평가하고, 부족한 점이 있다면 보충 설명을 해주세요. 
    1. 답변이 논리적인지 (상/중/하) 평가.
    2. 구체적인 상황(데이터 크기, 정렬 상태 등)을 들어 올바른 선택 기준을 설명.
    3. 친절하고 격려하는 어조로 300자 이내로 답변.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateQuizHint = async (question: string): Promise<string> => {
  if (!apiKey) return "힌트를 가져올 수 없습니다.";
  
  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음 알고리즘 문제에 대한 짧고 결정적인 힌트를 한 문장으로 주세요. 정답을 직접 말하지 마세요.\n문제: ${question}`,
    });
    return response.text || "힌트 생성 실패";
  } catch (e) {
    return "힌트 로딩 실패";
  }
}
