'use client';

export const getEnvironmentalAdvice = async (
  pm25: number,
  simulationState: { humidity: number; windSpeed: number; traffic: number }
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/dust-forecaster/advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pm25, simulationState }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.text || "안전을 위해 지역 대기질 정보를 확인하세요.";
    }

    const data = await response.json();
    return data.text || "공기 질이 나쁠 땐 마스크를 꼭 착용하세요!";
  } catch (error) {
    console.error("API Error:", error);
    return "안전을 위해 지역 대기질 정보를 확인하세요.";
  }
};