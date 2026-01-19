export interface FeedbackResponse {
  score: number;
  feedback: string;
  badgeEarned: boolean;
}

export const analyzeReflection = async (
  situation: string,
  selection: string,
  userText: string
): Promise<FeedbackResponse> => {
  try {
    const response = await fetch('/api/gemini/career-balance-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ situation, selection, userText }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    const data = await response.json();
    return {
      score: data.score,
      feedback: data.feedback,
      badgeEarned: data.badgeEarned
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      score: 70,
      feedback: "AI 분석 중 오류가 발생했습니다. 글의 내용이 충분히 구체적인지 확인해보세요.",
      badgeEarned: false
    };
  }
};