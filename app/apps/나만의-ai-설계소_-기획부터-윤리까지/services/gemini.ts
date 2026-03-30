import { GoogleGenAI } from "@/lib/genai-browser-shim";

// Ensure API Key is available
const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const generateAIProposal = async (
  topic: string,
  features: string[],
  model: string,
  ethicalChecks: string[]
): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 AI 기획서를 생성할 수 없습니다. (데모 모드)";
  }

  try {
    const prompt = `
      당신은 수석 AI 솔루션 아키텍트입니다. 다음 정보를 바탕으로 전문적인 AI 프로젝트 기획서를 작성해주세요.
      Markdown 형식으로 작성하고, 기술적 타당성과 윤리적 고려사항을 균형 있게 서술하세요.

      1. 프로젝트 주제: ${topic}
      2. 사용 데이터(Features): ${features.join(', ')}
      3. 선택 모델: ${model}
      4. 사용자가 고려한 윤리적 점검 사항: ${ethicalChecks.join(', ')}

      [출력 형식]
      # [프로젝트 제목]
      ## 1. 개요
      ## 2. 데이터 전략 및 모델 설계
      ## 3. 윤리적 리스크 및 완화 방안 (중요)
      ## 4. 기대 효과 및 결론
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "기획서 생성에 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const discussDilemma = async (choice: string, scenario: string): Promise<string> => {
    if (!apiKey) return "API 키 부재로 분석을 제공할 수 없습니다.";

    const prompt = `
    상황: ${scenario}
    사용자의 선택: ${choice}

    AI 윤리 전문가로서 사용자의 선택에 대해 철학적 배경(공리주의, 의무론 등)을 들어 짧게 분석하고, 
    이 선택이 AI 설계에 어떤 윤리적 원칙(투명성, 공정성, 책임성 등)과 연결될 수 있는지 3문장 내외로 설명해주세요.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "분석을 불러올 수 없습니다.";
    } catch (error) {
        return "분석 중 오류 발생.";
    }
}