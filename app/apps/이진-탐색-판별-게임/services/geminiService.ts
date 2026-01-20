'use client';

import { Scenario, Difficulty } from "../types";

export const generateScenario = async (category: string, difficulty: Difficulty): Promise<Scenario | null> => {
  try {
    const response = await fetch('/api/gemini/binary-search-game/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, difficulty }),
    });

    if (!response.ok) {
      console.warn("Failed to generate scenario");
      return null;
    }

    const data = await response.json();
    return data.scenario || null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getReflectionFeedback = async (questionType: string, userAnswer: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/binary-search-game/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionType, userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.feedback || "API 키가 없어 피드백을 생성할 수 없습니다. (정렬 조건과 데이터 특성을 다시 생각해보세요!)";
    }

    const data = await response.json();
    return data.feedback || "피드백 생성 중 오류가 발생했습니다.";
  } catch (e) {
    return "피드백 생성 중 오류가 발생했습니다.";
  }
};