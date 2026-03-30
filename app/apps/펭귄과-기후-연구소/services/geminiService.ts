'use client';

export const getDrPenguinInsight = async (context: string, userAction: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/penguin-climate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context, userAction }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || '펭귄 박사님과 연결이 끊겼습니다. (API Key 확인 필요)';
    }

    const data = await response.json();
    return data.text || "흥미로운 데이터군요! 계속 분석해봅시다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "무전기 신호가 잡음으로 가득합니다... (AI 응답 오류)";
  }
};