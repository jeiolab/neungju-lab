export const fetchGalaxyFact = async (galaxyType: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/sweetness-galaxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'galaxyFact',
        galaxyType,
      }),
    });

    if (!response.ok) {
      console.error("API request failed:", response.statusText);
      return "통신 오류: 은하 데이터를 불러올 수 없습니다.";
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("API error:", data.error);
      return "통신 오류: 은하 데이터를 불러올 수 없습니다.";
    }

    return data.text || "데이터 통신에 실패했습니다. 별빛이 너무 희미하네요.";
  } catch (error) {
    console.error("Failed to fetch galaxy fact:", error);
    return "통신 오류: 은하 데이터를 불러올 수 없습니다.";
  }
};

export const fetchQuizExplanation = async (topic: string, isCorrect: boolean): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/sweetness-galaxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'quizExplanation',
        topic,
        isCorrect,
      }),
    });

    if (!response.ok) {
      console.error("API request failed:", response.statusText);
      return "설명을 불러오는 중 오류가 발생했습니다.";
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("API error:", data.error);
      return "설명을 불러오는 중 오류가 발생했습니다.";
    }

    return data.text || "설명 데이터를 로드할 수 없습니다.";
  } catch (error) {
    console.error("Failed to fetch quiz explanation:", error);
    return "설명을 불러오는 중 오류가 발생했습니다.";
  }
};