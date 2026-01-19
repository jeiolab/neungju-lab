import { GoogleGenAI } from "@google/genai";
import { ReflectionEntry } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeReflection = async (entry: ReflectionEntry): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. (환경 변수를 확인해주세요)";
  }

  const prompt = `
    당신은 "학교 로봇 실험실"의 친절한 AI 선생님입니다. 
    학생이 작성한 지능 에이전트 설계 내용을 보고 3줄 이내로 피드백을 주세요.
    
    [학생의 설계]
    - 상황: ${entry.scenario}
    - 센서(입력): ${entry.sensor}
    - 판단(결정): ${entry.decision}
    - 행동(액추에이터): ${entry.action}

    [평가 기준]
    1. 센서가 상황에 적절한가?
    2. 판단 논리가 타당한가?
    3. 행동이 구체적인가?

    따뜻하고 격려하는 말투로, 부족한 점이 있다면 하나만 짚어주고, 잘한 점을 칭찬해주세요.
    반드시 한국어로 답변하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "피드백 생성에 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 나중에 다시 시도해주세요.";
  }
};