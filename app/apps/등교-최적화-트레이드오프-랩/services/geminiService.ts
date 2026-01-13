import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateThinkingFeedback = async (
  userScenario: string,
  userSolution: string
): Promise<string> => {
  if (!ai) {
    return "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. (데모 모드)";
  }

  try {
    const prompt = `
      당신은 '등교 최적화 실험실'의 수석 연구원입니다.
      학생이 다음과 같은 상황에서 등교 문제를 해결하려고 합니다.
      
      상황: ${userScenario}
      학생의 해결책: ${userSolution}
      
      이 해결책에 대해 다음 구조로 짧고 명확하게 3줄 피드백을 주세요:
      1. 분석: 학생이 고려한 핵심 변수 (시간, 비용, 환경 등)
      2. 트레이드오프 평가: 무엇을 얻고 무엇을 희생했는지
      3. 추가 질문: 더 깊이 생각해볼 만한 '만약에' 질문 하나
      
      존댓말로 친절하고 논리적으로 답변해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateRandomScenario = async (): Promise<string> => {
    if (!ai) return "비가 억수같이 쏟아지는 날, 우산이 부러졌습니다. 어떻게 하시겠습니까?";

    try {
        const prompt = "등교 시간에 발생할 수 있는 예상치 못한 딜레마 상황을 한 문장으로 만들어주세요. (예: 버스 파업, 엘리베이터 고장 등)";
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "예상치 못한 상황 생성 실패";
    } catch (e) {
        return "눈이 너무 많이 와서 대중교통이 마비되었습니다.";
    }
}
