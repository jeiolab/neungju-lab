import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSecurityGuidebook = async (score: number, rank: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      당신은 세계적인 정보 보안 컨설턴트입니다. 
      방금 막 신입 보안 컨설턴트(사용자)가 훈련 시뮬레이션을 마쳤습니다.
      
      사용자의 최종 점수는 100점 만점에 ${score}점이며, 획득한 등급은 '${rank}'입니다.
      
      이 사용자에게 전달할 "나만의 맞춤형 보안 가이드북"을 마크다운(Markdown) 형식으로 작성해주세요.
      
      가이드북 포함 내용:
      1. 등급에 따른 격려나 조언 (유머러스하고 재치있게).
      2. 암호학 핵심 요약 (대칭키, 공개키, 해시 함수의 차이점을 비유를 들어 쉽게 설명).
      3. "현실 세계의 조언": 비밀번호 관리, 2단계 인증, 공공 와이파이 주의 등 일반인이 실천할 수 있는 3가지 보안 수칙.
      
      톤앤매너: 전문적이지만 친절하고, 약간의 게임 NPC 같은 느낌.
      길이: 500자 내외로 간결하게.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "가이드북 생성에 실패했습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "보안 통신망에 일시적인 장애가 발생했습니다. 나중에 다시 시도해주세요.";
  }
};