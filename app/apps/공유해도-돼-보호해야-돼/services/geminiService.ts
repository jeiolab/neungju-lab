import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get model based on complexity
const getModel = () => {
    // Using flash for faster responses on interactive elements
    return 'gemini-3-flash-preview'; 
};

export const gradeSubjectiveAnswer = async (question: string, userAnswer: string): Promise<{ isCorrect: boolean; feedback: string }> => {
  if (!apiKey) {
    console.warn("API Key not found, returning mock response");
    return { isCorrect: true, feedback: "API 키가 없어 모의 채점합니다. 논리적입니다!" };
  }

  try {
    const prompt = `
      You are a strict but helpful high school teacher specializing in Information Privacy.
      Evaluate the student's answer to the following question.

      Question: "${question}"
      Student Answer: "${userAnswer}"

      Output JSON format:
      {
        "isCorrect": boolean,
        "feedback": "string (Korean, 2 sentences max, explain why correct or incorrect)"
      }
    `;

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
          },
          required: ["isCorrect", "feedback"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result;

  } catch (error) {
    console.error("Gemini Grading Error:", error);
    return { isCorrect: false, feedback: "채점 중 오류가 발생했습니다. 다시 시도해주세요." };
  }
};

export const generateAdvancedScenario = async (): Promise<{ scenario: string; task: string }> => {
  if (!apiKey) {
      return { 
          scenario: "API 키가 없습니다. (기본 시나리오) 학교 축제 영상을 편집 중인데 배경에 지나가는 행인의 얼굴이 나왔습니다.",
          task: "이 상황에서 고려해야 할 초상권 침해 요소와 해결 방안을 제시하세요."
      };
  }

  try {
    const prompt = `
      Create a challenging, real-life scenario for a high school student regarding information privacy vs. sharing.
      Focus on ambiguous situations like social media, school projects, or club activities.
      
      Output JSON format:
      {
        "scenario": "string (Korean, descriptive context)",
        "task": "string (Korean, specific question asking for a solution or judgment)"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            task: { type: Type.STRING },
          },
          required: ["scenario", "task"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Scenario Gen Error:", error);
    return { scenario: "오류가 발생했습니다.", task: "다시 시도해주세요." };
  }
};
