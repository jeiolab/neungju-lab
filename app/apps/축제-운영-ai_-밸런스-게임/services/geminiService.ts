import { GoogleGenAI } from "@google/genai";
import { SimulationConfig, GoalType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getSimulationFeedback = async (
  config: SimulationConfig,
  score: number
): Promise<string> => {
  if (!apiKey) return "API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.";

  const prompt = `
    당신은 학교 축제 운영 AI 설계 코치입니다.
    사용자가 설정한 AI 에이전트 값:
    - 자율성(Autonomy): ${config.autonomy}/100
    - 협력성(Cooperation): ${config.cooperation}/100
    - 목표(Goal): ${config.goal}
    
    계산된 운영 점수: ${score}점.

    이 점수가 나온 이유를 지능 에이전트 이론(자율성, 협력성, 목표지향성)에 근거하여 3줄로 피드백해주세요.
    형식:
    1. 분석: [특성과 목표의 연결성 설명]
    2. 개선: [점수를 높이기 위한 조언]
    3. 제안: [다음 실험을 위한 질문 또는 아이디어]
    
    톤앤매너: 친절하고 격려하는 선생님 어조. 한국어로 작성.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const evaluateReflection = async (
  questionType: string,
  userAnswer: string
): Promise<string> => {
  if (!apiKey) return "API 키가 없습니다.";

  const prompt = `
    사용자가 '지능 에이전트' 학습 중 '${questionType}'에 대한 서술형 답변을 제출했습니다.
    답변: "${userAnswer}"

    이 답변에 대해 3가지 관점(이해도, 논리성, 창의성)에서 짧은 평가와 루브릭 점수(A/B/C)를 매겨주세요.
    그리고 보완할 점을 한 문장으로 조언해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "평가를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "평가 중 오류가 발생했습니다.";
  }
};