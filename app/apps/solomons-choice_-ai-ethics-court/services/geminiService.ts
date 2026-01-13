import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getEthicsChairmanFeedback = async (userThought: string, context: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 위원장의 피드백을 불러올 수 없습니다.";
  }

  const modelId = "gemini-3-flash-preview";
  
  const systemInstruction = `
    당신은 'AI 윤리 위원회의 위원장'입니다. 권위있지만 교육적이고 사려 깊은 어조를 사용하십시오.
    학생(사용자)이 AI 윤리적 딜레마(예: AI 예술 저작권, 자율주행 등)에 대한 자신의 의견을 제출했습니다.
    
    당신의 역할:
    1. 사용자의 의견을 경청하고 핵심 논리를 파악하십시오.
    2. '인간 중심 가치', '책임성', '투명성' 등의 윤리 교과서적 기준을 바탕으로 피드백을 제공하십시오.
    3. 정답을 강요하지 말고, 사용자가 미처 생각하지 못한 다른 관점(사회적 안전 vs 기술 발전의 트레이드오프)을 제시하여 사고를 확장시키십시오.
    4. 한국어로 약 300자 내외로 답변하십시오.
    5. 말투는 정중하게 하십시오 (예: "~합니다", "~라고 생각해보셨군요").
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [
            { text: `주제: ${context}\n\n사용자 의견: ${userThought}` }
          ]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "피드백을 생성하는 도중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "통신 오류로 인해 위원장님의 의견을 전달받지 못했습니다. 잠시 후 다시 시도해주세요.";
  }
};
