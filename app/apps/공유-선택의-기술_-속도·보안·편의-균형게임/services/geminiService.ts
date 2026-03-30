import { GoogleGenAI } from "@/lib/genai-browser-shim";

const getAIClient = () => {
  if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
};

export const getSimulationCoaching = async (
  scenarioTitle: string,
  methodName: string,
  weights: { speed: number; security: number; convenience: number },
  methodStats: { speed: number; security: number; convenience: number }
): Promise<string> => {
  const client = getAIClient();
  if (!client) return "API 키가 설정되지 않아 AI 코치 조언을 불러올 수 없습니다.";

  const prompt = `
    당신은 학생들을 위한 '데이터 공유 의사결정 코치'입니다.
    
    상황: ${scenarioTitle}
    사용자가 선택한 중요도: 속도(${weights.speed}), 보안(${weights.security}), 편의(${weights.convenience})
    추천된 방식: ${methodName} (특성: 속도 ${methodStats.speed}, 보안 ${methodStats.security}, 편의 ${methodStats.convenience})
    
    위 상황에서 왜 이 방식이 추천되었는지, 사용자의 가중치와 연결지어 정확히 3문장으로 설명해주세요.
    1문장은 속도 측면, 1문장은 보안 측면, 1문장은 편의성 측면에서 설명하세요.
    말투는 친절하고 전문적인 코치처럼 해주세요.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "코치 조언 생성 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "네트워크 상태가 좋지 않아 코치 조언을 불러오지 못했습니다.";
  }
};

export const evaluatePolicy = async (policyText: string): Promise<string> => {
  const client = getAIClient();
  if (!client) return "API 키가 설정되지 않았습니다.";

  const prompt = `
    학생들이 작성한 '우리 모둠 데이터 공유 정책'입니다:
    "${policyText}"

    이 정책에 대해 100자 이내로 짧고 굵은 피드백을 주세요. 
    잘한 점 하나와 보완할 점(보안이나 효율성 측면) 하나를 포함해주세요.
    말투는 격려하는 선생님 톤으로 해주세요.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "피드백 생성 실패";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "피드백을 가져오는 중 오류가 발생했습니다.";
  }
};
