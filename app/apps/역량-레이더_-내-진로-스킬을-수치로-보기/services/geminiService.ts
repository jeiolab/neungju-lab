export const getReflectionFeedback = async (
  competencyName: string,
  userPlan: string,
  userMasteryScore: number
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/skill-radar/reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competencyName, userPlan, userMasteryScore }),
    });

    if (!response.ok) {
      throw new Error('API response not ok');
    }

    const data = await response.json();
    return data.text || "피드백을 생성할 수 없습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 코치와 연결이 어렵습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generatePersuasiveText = async (
  masteryScores: Record<string, number>,
  jobName: string
): Promise<string> => {
    try {
        const response = await fetch('/api/gemini/skill-radar/persuasive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ masteryScores, jobName }),
        });

        if (!response.ok) {
          throw new Error('API response not ok');
        }

        const data = await response.json();
        return data.text || "글을 생성할 수 없습니다.";
    } catch (error) {
        return "자동 생성 서비스 연결 실패.";
    }
}