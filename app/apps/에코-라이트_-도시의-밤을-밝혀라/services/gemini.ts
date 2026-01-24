import { GoogleGenAI } from "@google/genai";
import { SensorType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getSimulationFeedback = async (
  avgSafety: number,
  avgEnergy: number,
  config: { luxThreshold: number; sensorType: SensorType }
): Promise<string> => {
  try {
    const prompt = `
      당신은 스마트 시티 수석 엔지니어입니다.
      사용자가 설정한 가로등 시스템의 시뮬레이션 결과에 대해 피드백을 주세요.
      
      [설정값]
      - 점등 기준 조도: ${config.luxThreshold} Lux (높을수록 일찍 켜짐)
      - 센서 타입: ${config.sensorType === SensorType.PHOTO_ONLY ? '조도 센서 단독' : '조도 + 모션 복합 센서'}
      
      [결과]
      - 시민 안전 점수: ${avgSafety.toFixed(0)}/100
      - 에너지 절약 점수: ${avgEnergy.toFixed(0)}/100
      
      [요청사항]
      1. 결과에 대한 짧은 평가는 한 문장으로.
      2. 개선을 위한 구체적인 팁을 한 문장으로 주세요. (예: "새벽 시간에는 유동인구가 적으니 모션 센서를 활용해보세요.")
      3. 존댓말로 친절하게 작성해주세요.
      4. 총 100자 이내로 작성하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "통신 상태가 원활하지 않아 AI 피드백을 불러올 수 없습니다.";
  }
};

export const getReflectionFeedback = async (userAnswer: string): Promise<string> => {
  try {
    const prompt = `
      사용자는 "가로등 고장을 중앙 센터에서 어떻게 알 수 있을까?"라는 질문에 대해 다음과 같이 답했습니다:
      "${userAnswer}"
      
      이 답변에 대해 스마트 시티 네트워크 관점에서 교육적인 피드백을 제공해주세요.
      IoT, 센서 네트워크, 게이트웨이 등의 키워드를 언급하며 설명하면 좋습니다.
      긍정적인 톤으로 격려하며 200자 이내로 답변해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 피드백을 불러오는 중 오류가 발생했습니다.";
  }
};
