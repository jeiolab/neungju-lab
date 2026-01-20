export const askGeminiCoach = async (userQuery: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/school-lunch-bot/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userQuery }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error calling AI Coach API:", error);
    return "AI 코치에게 물어보는 중 문제가 발생했습니다. 나중에 다시 시도해주세요.";
  }
};