import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeDesignAnswer = async (userAnswer: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI 서비스를 사용할 수 없습니다. API 키 설정을 확인해주세요.";

  try {
    const prompt = `
      당신은 고등학생을 위한 컴퓨터 과학 선생님입니다.
      주제는 다차원 배열 (2D vs 3D)입니다.
      
      학생에게 주어진 질문: "5층짜리 학교 건물을 위한 데이터 구조를 설계하세요. 각 층에는 교실이 격자 형태로 배치되어 있습니다. 각 교실의 쓰레기 발생량을 어떻게 저장할지 설명하세요."

      학생의 답변: "${userAnswer}"

      다음 3가지 사항을 포함하여 한국어로 짧게 피드백을 제공하세요:
      1. 구조의 정확성 ([층][행][열] 개념을 이해했는지).
      2. 효율성 및 명확성.
      3. 재미있는 "에코 코딩" 팁.
      
      격려하는 어조로 작성해주세요. 텍스트로만 응답하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "응답을 분석하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.";
  }
};

export const getStrategicCoachTip = async (
  gridSize: {rows: number, cols: number},
  pathLength: number,
  collectedTrash: number,
  totalTrash: number
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "시간과 환경 점수의 균형을 맞춰보세요!";

  try {
    const prompt = `
      당신은 게임 코치 "에코 봇"입니다.
      상황: 학생이 격자 기반 게임에서 쓰레기를 수거하고 있습니다.
      그리드 크기: ${gridSize.rows}x${gridSize.cols}.
      이동한 거리(Steps): ${pathLength}.
      수거한 쓰레기: ${collectedTrash} / ${totalTrash}.
      
      "시간"(적은 이동)과 "환경"(많은 수거) 사이의 균형을 맞추는 방법에 대한 전략적 팁을 한국어로 한 문장으로 주세요.
      너무 기술적이지 않게, 게임 조언처럼 말해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "더 짧은 경로로 많은 쓰레기를 줍는 방법을 찾아보세요!";
  } catch (error) {
    return "이동 거리와 수거량 사이의 균형을 잘 살펴보세요!";
  }
};