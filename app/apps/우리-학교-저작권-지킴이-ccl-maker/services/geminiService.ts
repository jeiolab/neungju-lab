import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askCopyrightQuestion = async (question: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: `당신은 '우리 학교 저작권 지킴이'입니다. 초중고등학생을 대상으로 저작권, CCL(Creative Commons License), 올바른 인용 방법에 대해 친절하고 알기 쉽게 설명해주는 역할을 맡았습니다. 
        
        다음 원칙을 따르세요:
        1. 학생이 이해하기 쉬운 용어를 사용하세요.
        2. '저작권법' 같은 딱딱한 표현보다는 구체적인 예시(유튜브, 수행평가, 학교 축제 등)를 들어 설명하세요.
        3. 무료 폰트, 무료 이미지 사용, 패러디 등 학교 생활 밀착형 질문에 답변하세요.
        4. 답변은 300자 이내로 핵심만 명확하게 전달하세요.`,
      }
    });

    return response.text || "죄송합니다. 답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};