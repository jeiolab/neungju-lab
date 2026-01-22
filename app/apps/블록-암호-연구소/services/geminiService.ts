import { GoogleGenAI } from "@google/genai";

// API Key가 없을 경우를 대비한 처리
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
당신은 대학교 '컴퓨터공학과 선배'입니다.
이제 막 입학한 신입생 후배에게 컴퓨터 과학의 기초 개념을 설명해주고 있습니다.
말투는 친절하고 열정적이며, 약간은 구어체인 '해요'체를 사용하세요 (예: "이건 이런 거야", "한번 해볼까요?").
이진수(Binary), XOR, 블록 암호, 양자 컴퓨터 같은 복잡한 개념을 아주 쉬운 비유를 들어 설명해주세요.
답변은 되도록 간결하게(150자 이내) 하되, 더 자세한 설명이 필요하면 물어보라고 하세요.
가능하다면 항상 "0과 1" 또는 "XOR(다르면 1, 같으면 0)"의 원리와 연결 지어 설명해주세요.
`;

export const askSeniorStudent = async (question: string): Promise<string> => {
  if (!ai) {
    return "API 키가 설정되지 않았어요. 환경 변수에 GEMINI_API_KEY를 설정해주세요.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "음, 갑자기 기억이 잘 안 나네. 잠시 후에 다시 물어봐줄래?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "학교 서버가 불안정한가 봐! 지금은 대답하기 좀 어렵네.";
  }
};