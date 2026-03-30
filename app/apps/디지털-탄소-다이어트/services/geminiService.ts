import { GoogleGenAI } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const generateCampaignIdeas = async (schoolContext: string): Promise<string> => {
  if (!apiKey) {
    return "API 키가 없습니다. 아이디어를 생성할 수 없습니다.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        당신은 학생들을 돕는 '환경 운동가'입니다.
        학교에서 실천할 수 있는 "디지털 탄소 다이어트" 캠페인 아이디어 3가지를 제안해주세요.
        사용자가 제공한 학교 상황은 다음과 같습니다: "${schoolContext}".
        
        결과는 반드시 **한국어**로 작성해주세요.
        각 아이디어는 마크다운 리스트 형식으로, 제목은 굵게 표시하고 실행 가능한 구체적인 행동(예: 이메일 지우는 날, 다크 모드 챌린지)을 포함해주세요.
        말투는 격려하고 에너지가 넘치게 해주세요.
      `,
    });
    return response.text || "아이디어를 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "죄송합니다. 지금은 아이디어를 생성할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateBonusQuiz = async (): Promise<string> => {
   if (!apiKey) return "";
   try {
     const response = await ai.models.generateContent({
       model: 'gemini-3-flash-preview',
       contents: `디지털 지속 가능성에 대한 흥미로운 객관식 퀴즈 하나를 한국어로 생성해주세요 (예: ChatGPT 검색 한 번의 탄소 배출량, 스트리밍 영상의 영향 등). 질문과 4개의 선택지를 일반 텍스트로 명확하게 반환하세요. 정답은 바로 알려주지 마세요.`
     });
     return response.text || "";
   } catch (e) {
     return "";
   }
}