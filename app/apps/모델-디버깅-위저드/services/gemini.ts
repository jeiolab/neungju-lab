import { GoogleGenAI } from "@google/genai";
import { SimulationResult, SimulationState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCoachFeedback = async (state: SimulationState, result: SimulationResult): Promise<string> => {
  const prompt = `
    Role: You are a friendly, encouraging AI tutor for a high school student learning Machine Learning.
    Context: The student is using a "Model Debugging Wizard" to adjust a Supervised Learning model.
    
    Current Configuration:
    - Problem: ${state.problemType}
    - Data Size: ${state.dataSize}
    - Noise Level: ${state.noiseLevel}
    - Model Complexity (Tree Depth): ${state.modelComplexity}/10
    
    Simulation Results:
    - Training Score: ${(result.trainScore * 100).toFixed(1)}%
    - Test Score: ${(result.testScore * 100).toFixed(1)}%
    - Status: ${result.status}
    
    Task: Provide a short, 2-sentence feedback in KOREAN. 
    1. Explain WHY this is happening (e.g., "데이터에 비해 트리가 너무 깊습니다").
    2. Suggest a fix (e.g., "복잡도를 낮추거나 데이터를 더 모으세요").
    Keep it simple and educational. Speak in a polite and helpful tone (korean honorifics).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 150,
        temperature: 0.7,
      }
    });
    return response.text || "코치가 생각 중입니다... 설정을 조절해보세요!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 코치가 연결되지 않았지만, 차트를 보고 훈련 점수와 테스트 점수의 균형을 맞춰보세요!";
  }
};

export const getConceptExplanation = async (concept: string): Promise<string> => {
   const prompt = `Explain the concept of "${concept}" to a 15-year-old high school student in 2-3 sentences in KOREAN. Use an analogy if possible.`;
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "설명 로딩 중...";
  } catch (error) {
    return "개념 설명을 가져올 수 없습니다.";
  }
}