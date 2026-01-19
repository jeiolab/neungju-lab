import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuizQuestions = async (difficulty: string): Promise<any[]> => {
  const ai = getAiClient();
  const prompt = `
    Create 5 multiple-choice questions about the Machine Learning Pipeline process.
    Difficulty: ${difficulty} (Easy: basic definitions, Normal: order and purpose, Challenge: nuances and trade-offs).
    
    Focus on these stages: Problem Definition, Data Collection, Preprocessing, Model Training, Evaluation, Improvement.
    
    Return pure JSON with this schema:
    [{
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": number (0-3),
      "explanation": "string (Why the answer is correct)"
    }]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return fallbackQuestions;
  }
};

export const getReflectionFeedback = async (problem: string, plan: string) => {
  const ai = getAiClient();
  const prompt = `
    You are an expert ML Project Manager Coach.
    A student is designing a Machine Learning project for their school.
    
    Problem Statement: "${problem}"
    Their Plan for each stage: "${plan}"
    
    Provide constructive feedback.
    1. Assess if the problem is suitable for ML.
    2. Check if their data collection plan is realistic and ethical.
    3. Suggest one improvement for their pipeline.
    
    Keep the tone encouraging but professional. Max 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Feedback Error:", error);
    return "네트워크 오류로 피드백을 가져올 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};

const fallbackQuestions = [
  {
    question: "머신러닝 프로젝트의 첫 번째 단계는 무엇인가요?",
    options: ["데이터 수집", "문제 정의", "모델 학습", "성능 평가"],
    correctIndex: 1,
    explanation: "무엇을 해결할지 정하지 않으면 데이터를 모을 수 없습니다."
  },
  {
    question: "결측치를 채우거나 이상치를 제거하는 과정은?",
    options: ["성능 평가", "배포", "데이터 전처리", "문제 정의"],
    correctIndex: 2,
    explanation: "데이터를 모델이 학습하기 좋은 상태로 만드는 것이 전처리입니다."
  }
];
