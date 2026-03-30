import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { FarmState, ScenarioType } from "../types";

const createClient = () => {
    const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

export const getFarmConsultation = async (
  currentStats: FarmState,
  scenario: ScenarioType
): Promise<string> => {
  const client = createClient();
  if (!client) {
    return "API 키가 설정되지 않아 AI 컨설턴트를 연결할 수 없습니다.";
  }

  const prompt = `
    당신은 전문적인 '스마트팜 컨설턴트'입니다.
    현재 양돈 농장의 상태는 다음과 같습니다:
    - 온도: ${currentStats.temperature}°C
    - 습도: ${currentStats.humidity}%
    - 사료 공급량: ${currentStats.feedAmount}kg
    - 센서 민감도: ${currentStats.sensorSensitivity}%
    - 현재 돼지 건강도: ${Math.round(currentStats.pigHealth)}점
    - 현재 생산성 지수: ${Math.round(currentStats.productivity)}점
    - 현재 발생 상황: ${scenario === ScenarioType.NONE ? '특이사항 없음' : scenario === ScenarioType.HEATWAVE ? '폭염 경보 발령' : '질병 징후 포착'}

    위 데이터를 바탕으로 농장주에게 3줄 이내로 간결하고 구체적인 조언을 해주세요. 
    특히 온습도가 적정 범위(온도 18~24도, 습도 50~70%)를 벗어났거나 위기 상황일 경우 긴급 조치를 제안하세요.
    말투는 친절하고 전문적으로 하세요.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "현재 통신 상태가 원활하지 않아 조언을 불러올 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 시스템 연결 중 오류가 발생했습니다.";
  }
};
