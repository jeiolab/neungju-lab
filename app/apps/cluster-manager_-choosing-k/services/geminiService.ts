import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { FeedbackResult, ScenarioType } from "../types";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const getSimulationFeedback = async (
  k: number,
  weights: { interpretability: number; cohesion: number; efficiency: number },
  scenario: ScenarioType,
  metrics: { interpretability: number; cohesion: number; efficiency: number }
): Promise<FeedbackResult> => {
  
  if (!apiKey) {
    return {
      winner: "API 키가 설정되지 않았습니다.",
      loser: "기본 피드백을 표시합니다.",
      suggestion: "K값을 조정하여 변화를 관찰해보세요.",
      score: 50
    };
  }

  const scenarioText = scenario === 'streaming' 
    ? "스트리밍 시청 습관 분석 (사용자 군집화)" 
    : "학교 배정 문제 (교직원 수 vs 학생 수)";

  const prompt = `
    당신은 고등학교 1학년 학생들에게 '비지도 학습의 군집화(Clustering)'에서 K(군집 수) 결정의 트레이드오프를 가르치는 코치입니다.
    
    상황:
    - 시나리오: ${scenarioText}
    - 학생이 선택한 K: ${k}
    - 학생이 설정한 가중치(0~10): 해석가능성(${weights.interpretability}), 응집도(${weights.cohesion}), 운영효율(${weights.efficiency})
    - 계산된 지표 결과(0~10): 해석가능성(${metrics.interpretability.toFixed(1)}), 응집도(${metrics.cohesion.toFixed(1)}), 운영효율(${metrics.efficiency.toFixed(1)})

    다음 3가지 항목으로 구성된 피드백을 JSON 형식으로 작성해주세요. 말투는 친절하고 격려하는 코치 톤으로 해주세요.
    1. winner: 현재 선택에서 가장 이득을 본 측면 (한 문장)
    2. loser: 현재 선택에서 희생된(포기한) 측면 (한 문장)
    3. suggestion: 다음 실험에서 시도해볼 만한 변화 (한 문장)
    
    JSON 스키마:
    {
      "winner": "string",
      "loser": "string",
      "suggestion": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const json = JSON.parse(text);

    return {
      winner: json.winner || "분석 완료",
      loser: json.loser || "트레이드오프 발생",
      suggestion: json.suggestion || "다른 K값을 시도해보세요.",
      score: 0 // Score is calculated locally in clusteringService, strictly UI feedback here
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      winner: "AI 연결 실패",
      loser: "네트워크 상태를 확인해주세요.",
      suggestion: "잠시 후 다시 시도해주세요.",
      score: 0
    };
  }
};

export const checkCriticalThinking = async (question: string, answer: string): Promise<string> => {
    if (!apiKey) return "API 키가 없어 채점할 수 없습니다. (데모 모드)";

    const prompt = `
      당신은 고등학교 1학년을 위한 데이터 과학 선생님입니다.
      학생의 서술형 답안을 평가하고 짧은 피드백(2~3문장)을 주세요.
      
      문제: ${question}
      학생 답안: ${answer}
      
      핵심 평가 기준: 정답이 명확하지 않은 문제이므로 논리적인 근거가 있는지, 군집화의 개념(K의 의미, 트레이드오프)을 잘 이해하고 있는지 확인하세요.
      피드백만 텍스트로 출력하세요.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text || "피드백을 생성할 수 없습니다.";
    } catch (e) {
      return "채점 중 오류가 발생했습니다.";
    }
}