
export const generateExplanation = async (topic: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an AI teacher explaining Machine Learning concepts to a beginner. 
      Topic: ${topic}
      Context: ${context}
      
      Provide a concise, easy-to-understand explanation (max 2-3 sentences) in Korean. Be encouraging and friendly.`,
    });
    return response.text || "설명을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 다시 시도해주세요.";
  }
};

export const generateBiasScenario = async (): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/ai-teacher/bias-scenario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.text || '시나리오를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    return data.text || "시나리오 생성 실패.";
  } catch (error: any) {
    console.error("Error generating bias scenario:", error);
    return error.message || "시나리오를 불러올 수 없습니다.";
  }
}
