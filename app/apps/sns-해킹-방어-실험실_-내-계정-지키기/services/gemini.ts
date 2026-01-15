'use client';

import { QuizDifficulty } from "../types";

export const evaluateChallengeAnswer = async (question: string, userAnswer: string) => {
  try {
    const response = await fetch('/api/gemini/sns/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userAnswer }),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    return await response.json();

  } catch (error) {
    console.error("Gemini Evaluation Error", error);
    return {
      isCorrect: false,
      score: 0,
      feedback: "시스템 오류로 채점할 수 없습니다. 잠시 후 다시 시도해주세요."
    };
  }
};

export const generateQuizQuestion = async (difficulty: QuizDifficulty, avoidIds: string[]) => {
    try {
        const response = await fetch('/api/gemini/sns/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty, avoidIds }),
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error("Gemini Gen Error", error);
        return null;
    }
}