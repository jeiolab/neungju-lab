'use client';

export const getReflectionFeedback = async (userAnswer: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/yes-no-detective/reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.";
    }

    const data = await response.json();
    return data.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 나중에 다시 시도해주세요.";
  }
};