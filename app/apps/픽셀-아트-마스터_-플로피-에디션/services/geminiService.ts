import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const evaluateEssay = async (essay: string) => {
  if (!ai) {
    return { feedback: "API 키가 설정되지 않았어요. 환경 변수를 확인해주세요.", stars: 0 };
  }
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      당신은 시니어 이미지 압축 엔지니어이자 레트로 게임 개발자입니다. 주니어 개발자가 쓴 에세이를 검토하고 있습니다.
      주제: "왜 인스타그램은 사진을 압축하는가?"
      
      학생의 에세이: "${essay}"
      
      레트로 게임 개발자 페르소나로 짧고 건설적인 피드백(최대 3문장)을 한국어로 제공해주세요. 
      정확도를 1~5점 별점으로 평가해주세요.
      응답은 반드시 다음 JSON 형식을 따라야 합니다: { "feedback": string, "stars": number }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Essay Error", error);
    return { feedback: "시스템 오류: AI 모듈 응답 없음.", stars: 0 };
  }
};

export const generateQuizQuestion = async () => {
    if (!ai) return null;
    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
            이미지 압축(BMP, RLE, JPEG, 손실 vs 무손실)에 관한 객관식 퀴즈 1개를 한국어로 생성하세요.
            대상: 초보 프로그래머.
            형식(JSON): 
            {
                "question": "string (질문)",
                "options": ["string", "string", "string", "string"],
                "correctIndex": number (정답 인덱스 0-3),
                "explanation": "string (해설)"
            }
        `;
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Gemini Quiz Error", error);
        return null;
    }
}