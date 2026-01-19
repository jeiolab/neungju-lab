'use client';

export const getReflectionFeedback = async (userThought: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/linear-regression/reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userThought }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.";
    }

    const data = await response.json();
    return data.text || "답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "죄송합니다. 현재 AI 선생님과 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};