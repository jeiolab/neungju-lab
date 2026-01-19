'use client';

export const analyzeOpinion = async (opinion: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ opinion }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    const data = await response.json();
    return data.text || "분석에 실패했습니다. 다시 시도해 주세요.";
  } catch (error) {
    console.error("API Request Error:", error);
    return "현재 AI 보안 컨설턴트와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.";
  }
};