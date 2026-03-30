export const askGeminiFuture = async (userIdea: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/wireless-detective', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdea }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.text || "보안 채널 접속 실패. 시스템 오류가 발생했습니다.";
    }

    const data = await response.json();
    return data.text || "통신 상태가 불안정하여 본부와 연결할 수 없습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "보안 채널 접속 실패. 시스템 오류가 발생했습니다.";
  }
};
