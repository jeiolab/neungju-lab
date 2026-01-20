export const getHintForProblem = async (problemType: string, userContent: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/search-mastery/hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemType, userContent }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text;
    } else {
      console.error("API Error:", data.error);
      return data.text || "힌트를 불러오는 중 문제가 발생했습니다.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "현재 AI 코치를 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};
