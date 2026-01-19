'use client';

import { SimulationResult, SimulationState } from "../types";

export const getCoachFeedback = async (state: SimulationState, result: SimulationResult): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/model-debugging/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state, result }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.text || "AI 코치가 연결되지 않았지만, 차트를 보고 훈련 점수와 테스트 점수의 균형을 맞춰보세요!";
    }

    const data = await response.json();
    return data.text || "코치가 생각 중입니다... 설정을 조절해보세요!";
  } catch (error) {
    console.error("API Error:", error);
    return "AI 코치가 연결되지 않았지만, 차트를 보고 훈련 점수와 테스트 점수의 균형을 맞춰보세요!";
  }
};

export const getConceptExplanation = async (concept: string): Promise<string> => {
  // This function is not currently used, but if needed, create an API route for it
  return "개념 설명을 가져올 수 없습니다.";
}