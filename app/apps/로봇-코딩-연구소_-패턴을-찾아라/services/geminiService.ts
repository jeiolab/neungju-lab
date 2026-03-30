export const generatePatternExplanation = async (topic: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/robot-coding/pattern-explanation', {
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
      return data.text || "AI 서비스를 사용할 수 없습니다.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "AI 서비스를 사용할 수 없습니다.";
  }
};

export const evaluateReflection = async (userInput: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/robot-coding/reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text;
    } else {
      console.error("API Error:", data.error);
      return data.text || "AI 서비스를 사용할 수 없습니다.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "AI 서비스를 사용할 수 없습니다.";
  }
};

export const getQuizHint = async (question: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/robot-coding/pattern-explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic: `다음 패턴 문제에 대한 힌트를 줘 (정답은 말하지 마): "${question}". 학생이 스스로 규칙을 발견할 수 있도록 유도해줘.` }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text;
    } else {
      console.error("API Error:", data.error);
      return data.text || "AI 서비스를 사용할 수 없습니다.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "AI 서비스를 사용할 수 없습니다.";
  }
};
