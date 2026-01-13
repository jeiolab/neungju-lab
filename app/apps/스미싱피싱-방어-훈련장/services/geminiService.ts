import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeReflection = async (userInput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 고등학생을 위한 친절한 정보보안 멘토입니다.
        학생이 자신의 보안 취약점이나 고민을 입력했습니다: "${userInput}"

        다음 형식으로 짧고(200자 이내) 격려가 담긴 보안 조언을 해주세요:
        1. 공감하기 (그럴 수 있어!)
        2. 구체적인 행동 팁 (하나만 딱 정해서)
        3. 격려 (너도 보안 캡틴이 될 수 있어!)
        
        말투는 고등학생에게 말하듯 친근하게 해요.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 멘토 연결에 실패했어요. 하지만 스스로 고민해보는 것만으로도 큰 발전입니다! (네트워크 상태를 확인해주세요)";
  }
};