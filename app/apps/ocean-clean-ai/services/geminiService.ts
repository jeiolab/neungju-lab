import { GoogleGenAI } from "@google/genai";
import { TrashClass } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSimulationFeedback = async (
  classes: TrashClass[],
  accuracy: number,
  actualType: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) {
    return "데이터 분포에 따라 모델이 이미지를 분석했습니다.";
  }

  const classSummary = classes.map(c => `${c.name} (${c.sampleCount}개 샘플)`).join(', ');
  const prompt = `
    당신은 '티처블 머신' 시뮬레이션 게임의 AI 보조 교사입니다.
    사용자가 다음 클래스로 해양 쓰레기 감지 AI 모델을 학습시켰습니다: [${classSummary}].
    현재 모델의 예상 정확도는 ${accuracy}%입니다.
    
    시스템이 "${actualType}" 이미지를 테스트하고 있습니다.
    샘플 수의 많고 적음, 그리고 정확도를 바탕으로 모델이 성공하거나 실패한 이유를 1문장의 재미있거나 통찰력 있는 한국어 문장으로 설명해주세요.
    정확도가 낮으면(<50%), 엉뚱한 실수를 설명하세요 (예: "찌그러진 캔을 돌멩이로 착각했습니다!").
    정확도가 높으면(>80%), 데이터 수집 노력을 칭찬하세요.
    30단어 이내로 작성해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "분석 완료.";
  } catch (error) {
    console.error("Gemini feedback error", error);
    return "사용 가능한 샘플을 기반으로 분석을 완료했습니다.";
  }
};

export const summarizeDebate = async (
  topic: string,
  proComments: string[],
  conComments: string[]
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) {
    return "API 키 없이는 AI 요약을 사용할 수 없습니다.";
  }

  const prompt = `
    주제: "${topic}"
    찬성 의견 (Pro): ${proComments.join('; ')}
    반대 의견 (Con): ${conComments.join('; ')}
    
    현재 토론의 흐름을 중립적으로 요약하는 2문장의 한국어 요약을 제공하세요.
    그 후, 더 깊은 사고를 유도하는 도발적인 질문 하나를 던져주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "토론 분석을 사용할 수 없습니다.";
  } catch (error) {
    console.error("Gemini debate error", error);
    return "지금은 토론을 분석할 수 없습니다.";
  }
};