export const askGemini = async (prompt: string, context?: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/packet-adventure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.text || "네트워크 연결 상태를 확인해주세요. (API 호출 실패)";
    }

    const data = await response.json();
    return data.text || "죄송합니다. 현재 응답을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "네트워크 연결 상태를 확인해주세요. (API 호출 실패)";
  }
};