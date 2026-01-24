export const getReflectionFeedback = async (userResponse: string) => {
  try {
    const response = await fetch('/api/gemini/share-king/reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userResponse }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.text || "AI 조교가 연결되지 않았어요. 잠시 후 다시 시도해주세요.";
    }

    const data = await response.json();
    return data.text || "AI 조교가 연결되지 않았어요. 잠시 후 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 조교가 연결되지 않았어요. 잠시 후 다시 시도해주세요.";
  }
};
