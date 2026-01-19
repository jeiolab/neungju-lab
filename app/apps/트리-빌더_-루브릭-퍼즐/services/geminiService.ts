'use client';

export const getReflectionFeedback = async (
  topic: string,
  userAnswer: string
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/tree-builder/reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "API 키가 설정되지 않았습니다.";
    }

    const data = await response.json();
    return data.text || "피드백을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 다시 시도해주세요.";
  }
};

export const getConceptExplanation = async (concept: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API 키가 설정되지 않았습니다.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        고등학생에게 의사결정트리의 개념 중 "${concept}"에 대해 아주 쉽고 직관적인 비유를 들어서 2문장으로 설명해주세요.
        이모지를 1개 이상 사용하세요.
      `,
    });
    return response.text || "설명을 불러오지 못했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "설명을 불러오는 중 오류가 발생했습니다.";
  }
};
