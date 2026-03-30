export const generateCoachResponse = async (userMessage: string, history: string[] = []): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/classmanager/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        history,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.text || "통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    const data = await response.json();
    return data.text || "죄송합니다. 답변을 생성하는 데 문제가 발생했습니다.";
  } catch (error) {
    console.error("API Error:", error);
    return "통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const analyzeDataInsight = async (dataSummary: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/classmanager/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataSummary,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.text || "분석 실패";
    }

    const data = await response.json();
    return data.text || "분석 실패";
  } catch (error) {
    console.error("API Error:", error);
    return "분석 서비스를 사용할 수 없습니다.";
  }
};