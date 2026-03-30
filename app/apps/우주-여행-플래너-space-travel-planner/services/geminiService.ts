export const askMissionControl = async (prompt: string, context: string = ""): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/space-travel-planner/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error calling AI Mission Control API:", error);
    return "휴스턴, 문제가 발생했습니다. 통신 시스템을 확인해주세요. (API 키 오류일 수 있습니다)";
  }
};