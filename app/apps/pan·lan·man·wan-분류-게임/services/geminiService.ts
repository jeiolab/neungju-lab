import { GoogleGenAI } from "@google/genai";
import { DailyActivity, NetworkType } from '../types';

// Ensure API key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const evaluateEssay = async (prompt: string, answer: string): Promise<string> => {
  if (!apiKey) return "API 키가 설정되지 않았습니다. 메타데이터 설정을 확인해주세요.";

  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `
      당신은 고등학교 정보 교과 선생님입니다.
      학생이 네트워크(PAN, LAN, MAN, WAN) 관련 질문에 대한 답을 작성했습니다.
      학생의 답이 논리적인지, 개념을 잘 이해하고 있는지 3줄 이내로 피드백해주세요.
      정답 여부보다는 사고 과정을 칭찬하고, 보완할 점이 있다면 부드럽게 조언해주세요.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: `질문: ${prompt}\n학생 답안: ${answer}`,
      config: {
        systemInstruction,
      }
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const analyzeDailyActivities = async (activities: string[]): Promise<DailyActivity[]> => {
  if (!apiKey) {
    // Mock response if no API key
    return activities.map(act => ({
        activity: act,
        classification: NetworkType.LAN,
        reason: "API 키가 없어 임의로 LAN으로 분류했습니다."
    }));
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      다음은 학생의 하루 활동입니다. 각 활동이 어떤 네트워크(PAN, LAN, MAN, WAN)를 주로 사용하는지 분류하고, 그 이유를 짧게 설명해주세요.
      JSON 형식으로 응답해주세요.
      형식: [{ "activity": "원문", "classification": "PAN|LAN|MAN|WAN", "reason": "이유" }]
      활동 목록:
      ${activities.map(a => `- ${a}`).join('\n')}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as DailyActivity[];
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("분석 중 오류가 발생했습니다.");
  }
};
