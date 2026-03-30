'use client';

export const getReflectionFeedback = async (
  topic: string,
  userAnswer: string
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/tree-builder/reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "API 키가 설정되지 않았습니다.";
    }

    const data = await response.json();
    return data.text || "피드백을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 다시 시도해주세요.";
  }
};

