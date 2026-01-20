import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getReflectionFeedback = async (algorithm: string, question: string, userAnswer: string) => {
  if (!process.env.API_KEY) {
    return "API Key가 설정되지 않았습니다. .env 파일을 확인해주세요.";
  }

  const prompt = `
    당신은 친절하고 전문적인 알고리즘 코치입니다.
    사용자가 '${algorithm}' 알고리즘에 대한 다음 질문에 답했습니다.
    
    질문: ${question}
    사용자 답변: "${userAnswer}"
    
    이 답변에 대해 3줄 이내로 피드백을 제공해주세요.
    1. 정답 여부 또는 답변의 논리적 타당성
    2. 보완할 점이나 칭찬할 점
    3. 격려의 말
    
    톤앤매너: 친절함, 교육적, 이모지 사용.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "AI 선생님이 잠시 생각에 잠겼어요. 다시 시도해주세요! (오류 발생)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 생각에 잠겼어요. 다시 시도해주세요! (오류 발생)";
  }
};

export const generateScenario = async (algorithm: string) => {
    if (!process.env.API_KEY) return "API Key가 없습니다. 기본 시나리오: 도서관에서 책 찾기를 상상해보세요!";

    const prompt = `
      '${algorithm}' 알고리즘을 실생활에서 활용할 수 있는 재미있는 시나리오를 하나 만들어주세요.
      예: "학교 축제에서 보물찾기", "지하철 최단 환승 경로 찾기" 등.
      
      형식:
      상황: [상황 설명 1문장]
      문제: [해결해야 할 문제 1문장]
      생각해보기: [이 알고리즘을 어떻게 적용할지 묻는 질문]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "시나리오 생성 중 오류가 발생했습니다.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "시나리오 생성 중 오류가 발생했습니다.";
    }
}