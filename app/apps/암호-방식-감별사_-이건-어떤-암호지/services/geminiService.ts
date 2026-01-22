import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const evaluateReasoning = async (
  scenarioTitle: string,
  userCategory: string,
  correctCategory: string,
  userReason: string,
  keywords: string[]
): Promise<{ isCorrect: boolean; feedback: string; bonus: boolean }> => {
  // Fallback if no API key or empty reason
  if (!ai || !userReason.trim()) {
    const isCorrectCategory = userCategory === correctCategory;
    if (!isCorrectCategory) {
      return { isCorrect: false, feedback: "분류가 올바르지 않습니다.", bonus: false };
    }
    
    // Simple keyword matching for fallback
    const matched = keywords.some(k => userReason.includes(k));
    return {
      isCorrect: true,
      feedback: matched 
        ? "훌륭합니다! 핵심 키워드가 포함되어 있습니다." 
        : "정답입니다. 조금 더 구체적인 근거(예: 키의 공유 여부, 복구 불가능 등)를 들어보세요.",
      bonus: matched
    };
  }

  try {
    const prompt = `
      You are a cryptography teacher. A student is analyzing a scenario titled "${scenarioTitle}".
      The correct category is "${correctCategory}".
      The student classified it as "${userCategory}" and provided the reasoning: "${userReason}".
      
      Evaluate the student's response.
      1. Is the classification correct? (Implied yes if categories match, but check logic).
      2. Is the reasoning accurate and relevant?
      
      Respond in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoningValid: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            hasGoodKeywords: { type: Type.BOOLEAN }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // If category was wrong in the first place (caller handles category check usually, but let's be safe)
    if (userCategory !== correctCategory) {
       return { isCorrect: false, feedback: "분류가 틀렸습니다. 다시 생각해보세요.", bonus: false };
    }

    return {
      isCorrect: true,
      feedback: result.feedback || "분류가 정확합니다.",
      bonus: result.reasoningValid && result.hasGoodKeywords
    };

  } catch (error) {
    console.error("Gemini eval failed", error);
    // Fallback on error
    return { isCorrect: userCategory === correctCategory, feedback: "시스템 오류로 기본 피드백을 제공합니다.", bonus: false };
  }
};

export const generateThinkingProblem = async (currentLevel: string): Promise<string> => {
    if (!ai) return "암호화 방식이 깨진다면 우리 생활은 어떻게 변할까요?";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a short, thought-provoking critical thinking question about cryptography for a student at level "${currentLevel}". 
            Focus on real-world implications, ethics, or future technology (Quantum). 
            Output in Korean.`
        });
        return response.text || "암호 기술의 미래에 대해 생각해보세요.";
    } catch (e) {
        return "보안과 편의성 사이의 균형은 어떻게 맞춰야 할까요?";
    }
}
