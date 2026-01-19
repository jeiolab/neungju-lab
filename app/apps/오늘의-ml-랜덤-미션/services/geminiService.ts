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
  const ai = getClient();
  const prompt = `Explain these ML concepts simply for a beginner in Korean: ${tags.join(", ")}.
  Return a JSON array of objects with keys: "title", "description" (max 100 chars), "example".
  Max 3 concepts.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text || "[]");
};

export const generateQuiz = async (difficulty: string, weakTags: string[]): Promise<QuizQuestion[]> => {
  const ai = getClient();
  const focus = weakTags.length > 0 ? `Focus specifically on these weak topics: ${weakTags.join(', ')}` : "General ML topics";
  
  const prompt = `Generate 10 Machine Learning quiz questions in Korean.
  Difficulty: ${difficulty}
  ${focus}
  
  Return a JSON array of objects:
  {
    "id": string (unique),
    "question": string,
    "options": string[] (4 choices),
    "correctIndex": number (0-3),
    "explanation": string,
    "tag": string (topic category),
    "difficulty": "${difficulty}"
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text || "[]");
};

export const evaluateThinking = async (promptText: string, userAnswer: string): Promise<string> => {
  const ai = getClient();
  const prompt = `
  Context: ML Learning App.
  Problem: ${promptText}
  User Answer: ${userAnswer}
  
  Provide a concise, encouraging feedback (in Korean, max 3 sentences) evaluating the user's answer. 
  Point out one good thing and one thing to consider.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  
  return response.text || "좋은 시도입니다! 계속 학습해보세요.";
};
