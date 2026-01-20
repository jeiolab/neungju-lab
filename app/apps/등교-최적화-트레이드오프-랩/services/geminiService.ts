export const generateThinkingFeedback = async (
  userScenario: string,
  userSolution: string
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/commute-optimization/thinking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scenario: userScenario, userSolution, type: 'feedback' }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "AI 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    const data = await response.json();
    return data.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateRandomScenario = async (): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/commute-optimization/thinking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scenario: '', userSolution: '', type: 'scenario' }),
    });

    if (!response.ok) {
      return "비가 억수같이 쏟아지는 날, 우산이 부러졌습니다. 어떻게 하시겠습니까?";
    }

    const data = await response.json();
    return data.text || "눈이 너무 많이 와서 대중교통이 마비되었습니다.";
  } catch (error) {
    console.error("Scenario generation error:", error);
    return "눈이 너무 많이 와서 대중교통이 마비되었습니다.";
  }
}
