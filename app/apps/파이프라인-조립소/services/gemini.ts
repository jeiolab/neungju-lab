import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ReflectionData {
  perception: string;
  learning: string;
  reasoning: string;
  action: string;
}

export const analyzeReflection = async (data: ReflectionData): Promise<string> => {
  try {
    const prompt = `
      당신은 지능 에이전트(Intelligent Agent) 교육 전문가입니다.
      학생이 자신의 일상 생활 문제를 "인식-학습-추론-행동" 4단계 파이프라인으로 분석했습니다.
      
      학생의 입력:
      1. 인식(Perception): ${data.perception}
      2. 학습(Learning): ${data.learning}
      3. 추론(Reasoning): ${data.reasoning}
      4. 행동(Action): ${data.action}

      이 분석이 개념적으로 타당한지 평가하고, 격려와 함께 짧은 피드백(3문장 이내)을 한국어로 제공해주세요.
      각 단계가 적절하게 연결되었는지 확인해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 나중에 다시 시도해주세요.";
  }
};
