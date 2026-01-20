export const getReflectionFeedback = async (algorithm: string, question: string, userAnswer: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/search-procedure/reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algorithm, question, userAnswer }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text || "AI 선생님이 잠시 생각에 잠겼어요. 다시 시도해주세요! (오류 발생)";
    } else {
      console.error("API Error:", data.error);
      return data.text || "AI 선생님이 잠시 생각에 잠겼어요. 다시 시도해주세요! (오류 발생)";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "AI 선생님이 잠시 생각에 잠겼어요. 다시 시도해주세요! (오류 발생)";
  }
};

export const generateScenario = async (algorithm: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/search-procedure/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algorithm }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text || "시나리오 생성 중 오류가 발생했습니다.";
    } else {
      console.error("API Error:", data.error);
      return data.text || "시나리오 생성 중 오류가 발생했습니다.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "시나리오 생성 중 오류가 발생했습니다.";
  }
}