import { QuizQuestion, ThinkProblem } from '../types';

export const generateQuizQuestion = async (difficulty: 'easy' | 'hard'): Promise<QuizQuestion | null> => {
  try {
    const response = await fetch('/api/gemini/sorting-detective/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty }),
    });
    const data = await response.json();
    if (response.ok) {
      return data as QuizQuestion;
    } else {
      console.error("API Error:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Network Error:", error);
    return null;
  }
};

export const generateThinkProblem = async (): Promise<ThinkProblem | null> => {
  try {
    const response = await fetch('/api/gemini/sorting-detective/think', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (response.ok) {
      return data as ThinkProblem;
    } else {
      console.error("API Error:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Network Error:", error);
    return null;
  }
};

export const getAlgorithmHint = async (algo: string, arrayState: number[], sortedIndices: number[]): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/sorting-detective/hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algo, arrayState, sortedIndices }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text;
    } else {
      console.error("API Error:", data.error);
      return data.text || "정렬된 부분을 주의 깊게 살펴보세요.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "이미 정렬된 원소가 무엇인지 자세히 보세요.";
  }
}