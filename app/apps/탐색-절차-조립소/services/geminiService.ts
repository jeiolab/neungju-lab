'use client';

export const getReflectionFeedback = async (algorithm: string, question: string, userAnswer: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/gemini/search-procedure-lab/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algorithm, question, userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "AI 선생님이 잠시 생각에 잠겼어요. 다시 시도해주세요! (오류 발생)";
    }

    const data = await response.json();
    return data.text || null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 생각에 잠겼어요. 다시 시도해주세요! (오류 발생)";
  }
};

export const generateScenario = async (algorithm: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/gemini/search-procedure-lab/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algorithm }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "API Key가 없습니다. 기본 시나리오: 도서관에서 책 찾기를 상상해보세요!";
    }

    const data = await response.json();
    return data.text || null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "시나리오 생성 중 오류가 발생했습니다.";
  }
}