import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const explainAssociation = async (itemA: string, itemB: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      사용자가 장바구니 분석(Market Basket Analysis) 시뮬레이션을 하고 있습니다.
      두 아이템 '${itemA}'와 '${itemB}' 사이에 연관 규칙이 발견되었습니다.
      왜 이 두 상품이 함께 자주 구매될 수 있는지, 마케팅이나 소비자 행동 심리학 관점에서 
      초등학생도 이해할 수 있게 재미있고 짧게(2문장 이내) 설명해주세요.
      한국어로 답변해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "AI가 설명을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "잠시 연결이 불안정하여 설명을 가져올 수 없습니다.";
  }
};

export const generateScenarioQuiz = async (): Promise<{ question: string, options: string[], correctIndex: number, explanation: string }> => {
  try {
    const ai = getClient();
    const prompt = `
      추천 시스템과 연관 규칙(Association Rules)에 관한 4지선다 퀴즈를 하나 만들어주세요.
      실생활 예시(마트, 넷플릭스, 유튜브 등)를 들어주세요.
      
      응답은 반드시 다음 JSON 형식이어야 합니다:
      {
        "question": "질문 내용",
        "options": ["보기1", "보기2", "보기3", "보기4"],
        "correctIndex": 0, (0-3 사이 정수)
        "explanation": "정답 해설"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    // Fallback quiz
    return {
      question: "비 오는 날 파전의 판매량이 급증했습니다. 마트 매니저는 파전 옆에 무엇을 진열하면 좋을까요?",
      options: ["우산", "아이스크림", "막걸리", "선크림"],
      correctIndex: 2,
      explanation: "데이터 분석 결과 비 오는 날에는 파전과 막걸리가 함께 판매되는 '연관 규칙'이 강하게 나타납니다."
    };
  }
};