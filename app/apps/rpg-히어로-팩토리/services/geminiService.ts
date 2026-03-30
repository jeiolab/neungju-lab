export const generateClassExplanation = async (className: string, skills: string[]): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/rpg-hero-factory/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ className, skills }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch AI explanation');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error calling AI Explain API:", error);
    return "멋진 클래스를 정의하셨네요! (AI 설명을 불러올 수 없습니다)";
  }
};

export const getQuizHint = async (question: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/rpg-hero-factory/hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch AI hint');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error calling AI Hint API:", error);
    return "이론 탭을 다시 복습해보세요!";
  }
};