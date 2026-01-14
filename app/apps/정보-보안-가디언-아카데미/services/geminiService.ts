import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  client = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getInstructorFeedback = async (
  context: 'CORRECT' | 'INCORRECT' | 'LEVEL_UP' | 'WELCOME',
  details?: string
): Promise<string> => {
  if (!client) {
    // Fallback messages if API key is missing
    switch (context) {
      case 'CORRECT': return "훌륭하다 훈련병! 정확한 판단이었다. 계속 정진하도록!";
      case 'INCORRECT': return "집중해라! 보안의 세계에 실수는 용납되지 않는다. 다시 학습해!";
      case 'LEVEL_UP': return "축하한다! 너의 계급이 올랐다. 더 막중한 책임감을 가져라.";
      case 'WELCOME': return "주목! 나는 너희를 가디언으로 만들 보안 교관 AI다. 준비됐나?";
      default: return "";
    }
  }

  try {
    const prompt = `
      당신은 엄격하지만 속으로는 훈련병(사용자)을 아끼는 '보안 훈련소 교관'입니다.
      군대 조교 말투(다나까체, 엄격함, 격려)를 사용하세요. 한 문장으로 짧게 말하세요.
      
      상황: ${context}
      세부내용: ${details || ''}
      
      사용자에게 해줄 말:
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "통신 보안 상태 불량. 다시 시도한다.";
  } catch (error) {
    console.error("Gemini API Error", error);
    return "통신 장애 발생. 훈련은 계속된다.";
  }
};