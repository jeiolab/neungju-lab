export const generateReflectionFeedback = async (
  scenario: string,
  userAnswer: string,
  questionContext: string
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/mydata-dilemma', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'generateReflectionFeedback',
        scenario,
        userAnswer,
        questionContext,
      }),
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

export const analyzeSimulation = async (
  scenario: string,
  dataShared: string[],
  protections: string[],
  scores: { risk: number, convenience: number, publicGood?: number }
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/mydata-dilemma', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'analyzeSimulation',
        appType: scenario,
        dataShared,
        protections,
        scores,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analysis');
    }

    const data = await response.json();
    return data.text || "분석 결과를 불러오지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "심층 분석을 이용할 수 없습니다.";
  }
}