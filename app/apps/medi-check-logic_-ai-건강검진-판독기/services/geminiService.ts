import { LogicBlock, SimulationResult } from "../types";

export const analyzeLogicError = async (
  logic: LogicBlock[],
  failedResults: SimulationResult[]
): Promise<string> => {
  if (failedResults.length === 0) return "모든 환자를 정확하게 진단했습니다! 훌륭한 논리 구조입니다.";

  try {
    const response = await fetch('/api/gemini/medi-check-logic/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logic,
        failedResults,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.text || "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    const data = await response.json();
    return data.text || "분석 결과를 생성하지 못했습니다.";
  } catch (error) {
    console.error("API Error:", error);
    return "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const getThinkChallengeHint = async (question: string): Promise<string> => {
    if (!ai) return "API 키가 필요합니다.";

    const prompt = `
      초등학생/중학생 대상 코딩 교육 앱입니다.
      다음 질문에 대해 창의적인 사고를 돕는 짧은 힌트를 2-3문장으로 주세요. 답을 바로 알려주지 마세요.
      
      질문: "${question}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) {
        return "힌트를 불러오는 데 실패했습니다.";
    }
}
