'use client';

import { SimulationConfig, GoalType } from "../types";

export const getSimulationFeedback = async (
  config: SimulationConfig,
  score: number
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/festival-ai/simulation-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, score }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.feedback || "API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.";
    }

    const data = await response.json();
    return data.feedback || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const evaluateReflection = async (
  questionType: string,
  userAnswer: string
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/festival-ai/reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionType, userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.text || '평가를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    return data.text || "평가를 생성할 수 없습니다.";
  } catch (error: any) {
    console.error("Error evaluating reflection:", error);
    return error.message || "평가 중 오류가 발생했습니다.";
  }
};