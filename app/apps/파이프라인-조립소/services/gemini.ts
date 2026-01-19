export interface ReflectionData {
  perception: string;
  learning: string;
  reasoning: string;
  action: string;
}

export const analyzeReflection = async (data: ReflectionData): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/pipeline-assembly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    const result = await response.json();
    return result.text || "피드백을 생성할 수 없습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 나중에 다시 시도해주세요.";
  }
};
