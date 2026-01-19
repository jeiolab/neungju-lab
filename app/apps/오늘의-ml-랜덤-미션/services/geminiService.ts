'use client';

import { MissionType, MissionData, QuizQuestion, Concept } from "../types";
import { ML_TOPICS } from "../utils";

export const generateDailyMission = async (dateStr: string, type: MissionType): Promise<MissionData> => {
  try {
    const randomTopicIndex = Math.floor(Math.random() * ML_TOPICS.length);
    const topic = ML_TOPICS[randomTopicIndex];

    const response = await fetch('/api/gemini/ml-random-mission/mission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dateStr, type, topic }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.text || '미션을 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    return data as MissionData;
  } catch (error) {
    console.error("Mission generation error:", error);
    throw error;
  }
};

export const generateConcepts = async (tags: string[]): Promise<Concept[]> => {
  try {
    const response = await fetch('/api/gemini/ml-random-mission/concepts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.concepts || [];
    }

    const data = await response.json();
    return data.concepts || [];
  } catch (error) {
    console.error("Concepts generation error:", error);
    return [];
  }
};

export const generateQuiz = async (difficulty: string, weakTags: string[]): Promise<QuizQuestion[]> => {
  try {
    const response = await fetch('/api/gemini/ml-random-mission/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ difficulty, weakTags }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.questions || [];
    }

    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error("Quiz generation error:", error);
    return [];
  }
};

export const evaluateThinking = async (promptText: string, userAnswer: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/ml-random-mission/thinking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ promptText, userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "좋은 시도입니다! 계속 학습해보세요.";
    }

    const data = await response.json();
    return data.text || "좋은 시도입니다! 계속 학습해보세요.";
  } catch (error) {
    console.error("Thinking evaluation error:", error);
    return "좋은 시도입니다! 계속 학습해보세요.";
  }
};
