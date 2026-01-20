export const fetchMazeInsight = async (topic: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/treasure-island/insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text;
    } else {
      console.error("API Error:", data.error);
      return data.text || "네트워크 오류로 설명을 불러올 수 없습니다.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "네트워크 오류로 설명을 불러올 수 없습니다.";
  }
};

export const fetchDynamicQuiz = async (): Promise<{ question: string; options: string[]; answer: number; explanation: string } | null> => {
  try {
    const response = await fetch('/api/gemini/treasure-island/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("API Error:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Network Error:", error);
    return null;
  }
};