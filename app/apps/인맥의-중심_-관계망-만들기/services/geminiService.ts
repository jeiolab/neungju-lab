export const evaluateSolution = async (solution: string, scenario: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/social-network/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solution, scenario }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text;
    } else {
      console.error("API Error:", data.error);
      return data.text || data.error || "오류가 발생했습니다.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}
