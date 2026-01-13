import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize specific model as per instructions
const ai = new GoogleGenAI({ apiKey });

export const analyzeFutureDiary = async (diaryContent: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 AI 분석을 사용할 수 없습니다.";
  }

  try {
    const prompt = `
    당신은 2045년에서 온 미래학자입니다. 
    사용자가 20년 후(2045년)의 자신의 하루를 상상하며 쓴 일기를 분석해주세요.
    
    일기 내용: "${diaryContent}"
    
    다음 기준에 따라 3문장 이내로 친절하게 피드백해주세요:
    1. 묘사된 기술이 2045년에 실현 가능성이 있는지.
    2. 초연결, 초지능, 초융합 관점에서 어떤 점이 잘 반영되었는지.
    3. 흥미로운 상상력에 대한 칭찬.
    
    반말 말고 부드러운 존댓말을 써주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "분석을 완료하지 못했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 연결 상태가 불안정하여 미래 분석에 실패했습니다. (가상의 분석: 당신의 상상력은 매우 놀랍습니다!)";
  }
};
