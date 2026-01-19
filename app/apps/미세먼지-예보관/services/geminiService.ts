import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEnvironmentalAdvice = async (
  pm25: number,
  simulationState: { humidity: number; windSpeed: number; traffic: number }
): Promise<string> => {
  try {
    const modelId = 'gemini-3-flash-preview';
    
    const prompt = `
      당신은 '미세먼지 예보관' 앱의 AI 보조입니다.
      현재 환경 데이터:
      - 미세먼지(PM2.5) 예측값: ${pm25.toFixed(1)}
      - 습도: ${simulationState.humidity}%
      - 풍속: ${simulationState.windSpeed} m/s
      - 교통량: ${simulationState.traffic}/100

      이 데이터를 바탕으로 시민들에게 건강 수칙이나 환경 보호 행동 요령을 한 문장으로 조언해주세요. (최대 20자 내외, 한국어)
      - 미세먼지가 높으면 마스크 착용이나 외출 자제를 권고하세요.
      - 미세먼지가 낮으면 환기나 야외 활동을 권장하세요.
      - 수식이나 계산 과정은 설명하지 말고, 시민을 위한 따뜻한 조언만 해주세요.
      - 존댓말(해요체)을 사용하세요.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "공기 질이 나쁠 땐 마스크를 꼭 착용하세요!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "안전을 위해 지역 대기질 정보를 확인하세요.";
  }
};