'use client';

export const analyzeReflection = async (userInput: string) => {
  try {
    const response = await fetch('/api/gemini/smishing/reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "AI 멘토 연결에 실패했어요. (네트워크 상태를 확인해주세요)";
    }

    const data = await response.json();
    return data.text || "AI 멘토 연결에 실패했어요. (네트워크 상태를 확인해주세요)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 멘토 연결에 실패했어요. 하지만 스스로 고민해보는 것만으로도 큰 발전입니다! (네트워크 상태를 확인해주세요)";
  }
};