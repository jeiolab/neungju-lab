'use client';

export const generateScenario = async (
  problemTitle: string,
  selectedType: string,
  features: string,
  isCorrect: boolean,
  score: number
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/school-ai-solver/scenario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ problemTitle, selectedType, features, isCorrect, score }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "API 키가 설정되지 않아 시나리오를 생성할 수 없습니다.";
    }

    const data = await response.json();
    return data.text || "시나리오 생성 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 바쁜가 봐요! 시나리오를 불러오지 못했습니다.";
  }
};

export const generateOpenEndedFeedback = async (
    question: string,
    userAnswer: string
): Promise<string> => {
    try {
        const response = await fetch('/api/gemini/school-ai-solver/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question, userAnswer }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return errorData.text || "API 키가 없어 피드백을 줄 수 없습니다.";
        }

        const data = await response.json();
        return data.text || "피드백 생성 실패";
    } catch (error) {
        console.error("API Error:", error);
        return "피드백을 생성하는 도중 오류가 발생했습니다.";
    }
}