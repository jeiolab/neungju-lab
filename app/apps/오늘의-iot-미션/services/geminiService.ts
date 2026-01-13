import { GoogleGenAI } from "@google/genai";
import { ArgumentStructure } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present (for UI states)
export const isGeminiConfigured = () => !!apiKey;

export const evaluateExperiment = async (automation: number, sharing: number): Promise<string> => {
  if (!isGeminiConfigured()) {
    return "API 키가 설정되지 않아 상세 피드백을 제공할 수 없습니다. (데모 모드: 자동화와 공유 수준이 균형을 이룰 때 사회 수용도가 가장 높습니다.)";
  }

  try {
    const prompt = `
      당신은 미래 사회학자이자 IoT 전문가입니다.
      사용자가 "사물인터넷 사회 수용도 실험"을 진행했습니다.
      
      설정 값:
      - 자동화 수준: ${automation}% (높을수록 기기가 알아서 판단)
      - 데이터 공유 범위: ${sharing}% (높을수록 더 많은 개인정보를 공공/기업과 공유)
      
      이 조합이 가져올 사회적 결과와 시민들의 반응(수용도)을 3줄 이내로 분석해주세요.
      과장하지 말고, "만약 ~한다면"의 조건부 화법을 사용하세요.
      반드시 한국어로 답변하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "피드백 생성에 실패했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const gradeArgument = async (arg: ArgumentStructure): Promise<{score: number, feedback: string, tags: string[]}> => {
  if (!isGeminiConfigured()) {
    return {
      score: 80,
      feedback: "API 키가 없어 기본 피드백을 제공합니다. 논리적 구조가 잘 갖춰져 있습니다. 하지만 실제 상황에서의 변수를 더 고려해보세요.",
      tags: ["조건 부족(데모)", "반례 검토 필요(데모)"]
    };
  }

  try {
    const prompt = `
      당신은 논리적 사고를 가르치는 IoT 코치입니다. 학생이 IoT 주제에 대해 쓴 글을 평가해주세요.
      
      [학생의 글]
      주장: ${arg.claim}
      근거: ${arg.evidence}
      조건(단서): ${arg.condition}
      반례(예상 반박): ${arg.counterExample}
      대안(해결책): ${arg.alternative}
      
      [평가 기준]
      1. 주장이 명확하고 근거가 타당한가?
      2. '조건'을 통해 과장된 예측을 피했는가?
      3. 반례를 고려하여 균형 잡힌 시각을 가졌는가?
      
      [출력 형식]
      JSON 형식으로만 출력하세요.
      {
        "score": 0~100 사이 정수,
        "feedback": "구체적인 피드백 (200자 이내, 친절한 어조)",
        "tags": ["논리적", "근거 부족", "조건 누락", "반례 없음", "대안 구체적" 중 해당하는 것 1~3개 선택]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return {
        score: result.score || 70,
        feedback: result.feedback || "피드백을 불러올 수 없습니다.",
        tags: result.tags || ["분석 실패"]
    };

  } catch (error) {
    console.error("Gemini grading error:", error);
    return {
      score: 0,
      feedback: "AI 평가 중 오류가 발생했습니다.",
      tags: ["오류"]
    };
  }
};
