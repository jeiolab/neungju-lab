import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const evaluateThinkingAnswer = async (question: string, userAnswer: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      당신은 친절하고 전문적인 고등학교 정보 교사입니다.
      학생이 다음의 '생각해볼 문제'에 대해 답을 작성했습니다.
      
      질문: "${question}"
      학생 답안: "${userAnswer}"
      
      이 답안에 대해 3줄 이내로 피드백을 주세요.
      1. 잘한 점을 칭찬해주세요.
      2. 부족하거나 보완할 점이 있다면 부드럽게 지적해주세요.
      3. 정답 여부보다는 논리적인 사고 과정을 평가해주세요.
      말투는 친근하게 해요체(~해요)를 사용하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 나중에 다시 시도해주세요.";
  }
};

export const generateNetworkStory = async (protagonist: string, destination: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      사용자가 입력한 주인공과 목적지를 바탕으로 짧고 재미있는 네트워크 전송 동화를 만들어주세요.
      
      주인공 이름: ${protagonist} (이 주인공이 데이터 패킷이 됩니다)
      목적지: ${destination}
      
      필수 포함 요소: DNS 조회, 라우터(길 안내), 패킷 쪼개짐, 재조립.
      대상 독자: 고등학교 1학년.
      길이: 200자 내외.
      분위기: 모험 영화 예고편처럼 박진감 넘치게.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "이야기를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "이야기 생성 중 오류가 발생했습니다.";
  }
};
