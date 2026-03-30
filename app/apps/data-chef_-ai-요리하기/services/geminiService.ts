'use client';

export const askChefAboutEthics = async (scenario: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/data-chef/ethics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scenario }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.text || "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    const data = await response.json();
    return data.text || "죄송해요, 지금은 주방이 너무 바빠서 답변하기 어렵네요.";
  } catch (error) {
    console.error("API Error:", error);
    return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};