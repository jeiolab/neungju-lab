import { QuizQuestion } from '../types';

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await fetch('/api/gemini/quick-sort/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (response.ok) {
      return data as QuizQuestion[];
    } else {
      console.error("API Error:", data.error);
      return [];
    }
  } catch (error) {
    console.error("Network Error:", error);
    return [];
  }
};

export const evaluateReflection = async (userAnswer: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/quick-sort/reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAnswer }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text;
    } else {
      console.error("API Error:", data.error);
      return data.text || "지금은 피드백을 생성할 수 없습니다.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "지금은 피드백을 생성할 수 없습니다.";
  }
};