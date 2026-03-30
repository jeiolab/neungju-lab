export const checkProjectDesign = async (designText: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/anonymization-pipeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'checkProjectDesign', designText }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    const data = await response.json();
    return data.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 나중에 다시 시도해주세요.";
  }
};

export const getContextualQuizFeedback = async (question: string, userAnswer: string, correctAnswer: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/anonymization-pipeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'getContextualQuizFeedback', question, userAnswer, correctAnswer }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    const data = await response.json();
    return data.text || "해설을 불러올 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "해설 로딩 중 오류가 발생했습니다.";
  }
};