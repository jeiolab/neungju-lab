import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize specific model for text generation
const getClient = () => {
    if (!apiKey) {
        console.warn("API Key is missing. Please set process.env.API_KEY");
    }
    return new GoogleGenAI({ apiKey });
}

export const generateScenario = async (
  problemTitle: string,
  selectedType: string,
  features: string,
  isCorrect: boolean,
  score: number
): Promise<string> => {
  if (!apiKey) return "API 키가 설정되지 않아 시나리오를 생성할 수 없습니다.";

  const ai = getClient();
  
  const prompt = `
    당신은 친절하고 재치 있는 'AI 학교 선생님'입니다. 
    학생이 "${problemTitle}" 문제를 해결하기 위해 AI 모델을 설계했습니다.
    
    학생의 선택:
    - 기계학습 유형: ${selectedType}
    - 사용 데이터(특징): ${features}
    
    채점 결과:
    - 적합도 점수: ${score}점 / 100점
    - 정답 여부: ${isCorrect ? '적절함' : '부적절함'}

    작성 지침:
    1. 학생의 선택에 따른 가상의 미래 시나리오를 3~4문장으로 재미있게 묘사해주세요.
    2. 점수가 높다면 성공적인 결과를, 낮다면 엉뚱하거나 아쉬운 결과를 유머러스하게 표현해주세요.
    3. 만약 선택이 틀렸다면, 왜 틀렸는지 그리고 어떤 유형이 더 좋았을지 부드럽게 조언해주세요.
    4. 초등학생~중학생이 이해하기 쉬운 용어를 사용하세요.
    5. 이모지를 적절히 사용하여 생동감을 주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "시나리오 생성 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 바쁜가 봐요! 시나리오를 불러오지 못했습니다.";
  }
};

export const generateOpenEndedFeedback = async (
    question: string,
    userAnswer: string
): Promise<string> => {
    if (!apiKey) return "API 키가 없어 피드백을 줄 수 없습니다.";

    const ai = getClient();
    const prompt = `
      질문: "${question}"
      학생의 답변: "${userAnswer}"

      역할: AI 전문가 선생님.
      지침:
      1. 학생의 답변이 논리적인지, 어떤 데이터가 더 필요할지 칭찬과 함께 보완할 점을 3문장 내외로 피드백해주세요.
      2. 긍정적이고 격려하는 어조를 사용하세요.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "피드백 생성 실패";
    } catch (e) {
        return "피드백을 생성하는 도중 오류가 발생했습니다.";
    }
}