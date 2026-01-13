import { GoogleGenAI } from "@google/genai";
import { Level, IoTComponent } from "../types";

// Helper to get explanation when user makes a mistake
export const getAiFeedback = async (
  level: Level,
  userChoices: Record<string, string>,
  allComponents: IoTComponent[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct a prompt context
  const mission = level.mission;
  const userSetup = Object.entries(userChoices).map(([slotId, compId]) => {
    const comp = allComponents.find(c => c.id === compId);
    const slotLabel = level.slots.find(s => s.id === slotId)?.label || slotId;
    return `${slotLabel}: ${comp ? comp.name : "비어있음"}`;
  }).join(", ");

  const prompt = `
    당신은 학생들을 위한 친절하고 격려하는 IoT 튜터입니다.
    현재 미션은 다음과 같습니다: "${mission}".
    학생이 구성한 시스템:
    ${userSetup}

    학생의 시스템은 미션을 수행하기에 적절하지 않거나 불완전합니다.
    가장 결정적인 실수를 찾아 1~2문장으로 쉽게 설명해주세요 (예: "화재를 감지하려면 조도 센서보다는 열을 감지하는 센서가 필요하지 않을까요?").
    그리고 어떤 종류의 부품을 사용해야 하는지 힌트를 주세요.
    말투는 친절하고 교육적이어야 하며, 존댓말을 사용해주세요. 정답을 바로 알려주기보다 스스로 생각할 수 있도록 유도해주세요.
    반드시 한국어로 답변해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "AI 튜터의 응답을 가져오지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 튜터가 오프라인 상태입니다. 네트워크 연결을 확인해주세요.";
  }
};