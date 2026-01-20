export const evaluateThinkingAnswer = async (
  userAnswer: string, 
  scenario: string
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/smart-farm-logic-lab/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAnswer, scenario }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error calling AI Evaluate API:", error);
    return "통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};