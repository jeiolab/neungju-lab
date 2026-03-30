import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { Cluster } from "../types";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const analyzeClusterStrategy = async (k: number, clusters: Cluster[]): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Please check environment variables.";
  }

  // Prepare data summary for the prompt
  const summary = clusters.map(c => 
    `- 군집 ${c.name}: 인원 ${c.points.length}명, 평균 키 ${c.centroid.height.toFixed(1)}cm, 평균 몸무게 ${c.centroid.weight.toFixed(1)}kg`
  ).join('\n');

  const prompt = `
    당신은 20년 경력의 의류 브랜드 마케팅 임원입니다. 신입 사원이 티셔츠 사이즈 전략을 가져왔습니다.
    
    [입력 데이터]
    - 총 군집 수(사이즈 단계): ${k}개
    - 군집 분석 결과:
    ${summary}

    [요청 사항]
    위 데이터를 바탕으로 비즈니스 관점에서 피드백을 주세요.
    1. 이 군집 개수가 생산 효율성과 고객 만족도 사이에서 적절한지 평가해주세요. (너무 적으면 불만족, 너무 많으면 재고 부담)
    2. 각 군집의 평균 데이터를 볼 때, 한국인 표준 체형 등을 고려하여 현실적인 조언을 한 문장 더해주세요.
    3. 말투는 친절하지만 예리한 'AI 사수' 톤으로 해주세요. 한국어로 답변하세요.
    4. 300자 이내로 핵심만 요약하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "분석을 완료할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};
