import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getRefinementFeedback = async (
  originalProblem: string,
  userRefinement: string
): Promise<{ success: boolean; feedback: string; suggestion?: string }> => {
  if (!apiKey) {
    return {
      success: true,
      feedback: "API 키가 설정되지 않아 오프라인 모드로 통과 처리되었습니다. 실제 환경에서는 AI가 피드백을 제공합니다.",
      suggestion: "예시: 입력 데이터(취향, 예산)와 출력(메뉴명)을 명시했습니다."
    };
  }

  try {
    const prompt = `
      당신은 컴퓨팅 사고력 교육 코치입니다.
      학생이 "모호한 문제(조건부)"를 "컴퓨팅 가능한 문제"로 바꾸기 위해 문제 정의를 다시 작성했습니다.
      
      [원래 문제]: ${originalProblem}
      [학생의 재정의]: ${userRefinement}

      학생이 다음 요소들을 잘 포함했는지 판단해주세요:
      1. 입력 데이터(Input)가 구체적인가?
      2. 출력(Output)이 명확한가?
      3. 제약 조건(Constraints)이나 규칙이 포함되었는가?

      응답은 JSON 형식이 아닌 일반 텍스트로, 다음 구조로 짧게(3문장 이내) 답변하세요:
      판단: (성공 또는 실패)
      이유: (학생의 작성 내용에 대한 칭찬 또는 부족한 점)
      조언: (어떻게 고치면 더 완벽한지)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
    });

    const text = response.text || '';
    const isSuccess = text.includes('성공') || text.includes('좋습니다') || text.includes('훌륭');

    return {
      success: isSuccess,
      feedback: text,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      feedback: "AI 코치와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
    };
  }
};

export const getDiscussionTopic = async (): Promise<string> => {
    if (!apiKey) return "AI 연결 불가: 기본 토픽 - 자율주행차의 윤리적 딜레마를 알고리즘으로 어떻게 정의할까요?";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-latest',
            contents: "컴퓨팅 사고력과 관련된 흥미로운 토론 주제를 하나만 짧게 제안해줘. (예: 알고리즘의 공정성, AI의 창작물 저작권 등)",
        });
        return response.text || "토론 주제 생성 실패";
    } catch (e) {
        return "토론 주제를 불러오는데 실패했습니다.";
    }
}
