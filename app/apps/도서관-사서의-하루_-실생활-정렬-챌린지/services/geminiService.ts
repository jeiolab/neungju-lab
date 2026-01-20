export const getReflectionFeedback = async (userAnswer: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/library-sorting/reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "AI 시스템 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
    }

    const data = await response.json();
    return data.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 시스템 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
};
