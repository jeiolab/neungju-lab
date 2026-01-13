import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getReflectionFeedback = async (
  competencyName: string,
  userPlan: string,
  userMasteryScore: number
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      당신은 학생의 진로 성장을 돕는 친절하고 통찰력 있는 "성장형 코치"입니다.
      
      [상황]
      학생이 "${competencyName}" 역량을 키우기 위해 학교 생활 적용 계획을 세웠습니다.
      현재 이 학생의 해당 역량 마스터리 점수는 ${userMasteryScore}점입니다.
      
      [학생의 계획]
      "${userPlan}"
      
      [요청사항]
      1. 학생의 계획을 칭찬하고, 이 계획이 왜 디지털 사회에서 중요한지 짧게 설명해주세요.
      2. 이 계획을 더 구체화하거나 발전시킬 수 있는 "작은 팁" 하나를 제안해주세요.
      3. 전체 길이는 3-4문장으로 간결하게 작성해주세요. 말투는 격려하는 존댓말(~해요)을 사용하세요.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 코치와 연결이 어렵습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generatePersuasiveText = async (
  masteryScores: Record<string, number>,
  jobName: string
): Promise<string> => {
    try {
        const model = 'gemini-3-flash-preview';
        const scoresText = Object.entries(masteryScores)
            .map(([k, v]) => `${k}: ${v}점`)
            .join(', ');

        const prompt = `
            당신은 학생의 포트폴리오 작성을 돕는 코치입니다.
            학생이 희망하는 직업: ${jobName}
            학생의 역량 점수: ${scoresText}
            
            이 점수를 바탕으로, 학생이 왜 이 직업에 적합한지 어필하는 "설득 글 3문장"을 작성해주세요.
            높은 점수의 역량을 강조하여 작성해주세요.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });

        return response.text || "글을 생성할 수 없습니다.";
    } catch (error) {
        return "자동 생성 서비스 연결 실패.";
    }
}