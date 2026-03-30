export const evaluateIdea = async (problemTitle: string, userIdea: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/social-problem/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemTitle, userIdea }),
    });

    if (!response.ok) {
      throw new Error('API response not ok');
    }

    const data = await response.json();
    return data.text || "죄송합니다. AI가 답변을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};