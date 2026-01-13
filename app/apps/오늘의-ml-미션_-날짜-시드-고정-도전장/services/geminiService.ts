import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, MLType } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY || '';

// Helper to create AI instance only when needed to utilize latest key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (topic: MLType, dateSeed: number): Promise<QuizQuestion[]> => {
  try {
    const ai = getAI();
    const prompt = `
      주제: ${topic}
      오늘의 시드: ${dateSeed}
      
      위 주제에 대해 초보자부터 중급자 수준의 퀴즈 10문제를 생성해줘.
      JSON 형식으로 반환해야 해.
      난이도는 'easy' 3문제, 'medium' 4문제, 'hard' 3문제로 구성해.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview', // Using flash for speed
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING } 
              },
              answer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
            },
            required: ["id", "question", "options", "answer", "explanation", "difficulty"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Quiz Generation Failed:", error);
    // Fallback quiz if API fails (Simplified for reliability)
    return Array(10).fill(null).map((_, i) => ({
      id: i,
      question: `API 연결 문제로 기본 퀴즈가 제공됩니다. ${topic}의 핵심은?`,
      options: ["데이터", "알고리즘", "컴퓨팅 파워", "모두 다"],
      answer: 3,
      explanation: "머신러닝은 데이터, 알고리즘, 자원이 모두 중요합니다.",
      difficulty: i < 3 ? 'easy' : i < 7 ? 'medium' : 'hard'
    }));
  }
};

export const evaluateDesignMission = async (
  topic: MLType, 
  userInputs: { data: string; label: string; eval: string }
): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `
      사용자가 ${topic} 주제에 대해 다음과 같은 머신러닝 설계를 제출했어.
      - 데이터: ${userInputs.data}
      - 목표(레이블/결과): ${userInputs.label}
      - 평가 방법: ${userInputs.eval}

      이 설계가 논리적인지, 해당 머신러닝 유형에 맞는지 평가해줘.
      3줄 이내로 핵심적인 피드백을 제공해. 격려하면서도 수정할 점이 있다면 명확히 알려줘.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    return "API 연결이 원활하지 않아 로컬 피드백을 드립니다: 전체적으로 훌륭한 시도입니다! 데이터와 목표의 연관성을 다시 한 번 점검해보세요.";
  }
};

export const generateReflectionQuestions = async (topic: MLType): Promise<string[]> => {
  try {
    const ai = getAI();
    const prompt = `
      주제: ${topic}
      이 주제에 대해 사용자가 깊게 생각해볼 만한 '생각해볼 문제' 3가지를 만들어줘.
      정답이 딱 떨어지기보다 응용이나 윤리적 문제, 혹은 한계점에 대한 질문이어야 해.
      JSON 문자열 배열로 반환해줘.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview',
      contents: prompt,
      config: {
         responseMimeType: "application/json",
         responseSchema: {
           type: Type.ARRAY,
           items: { type: Type.STRING }
         }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    return ["데이터의 편향은 어떻게 해결할 수 있을까요?", "이 모델이 실패할 수 있는 케이스는?", "현실 세계 적용 시 비용 문제는?"];
  } catch (e) {
    return ["데이터 편향 문제에 대해 생각해보세요.", "모델의 과적합을 막으려면?", "실제 서비스 적용 시 주의할 점은?"];
  }
};
