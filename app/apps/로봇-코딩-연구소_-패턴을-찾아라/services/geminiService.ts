import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePatternExplanation = async (topic: string): Promise<string> => {
  if (!apiKey) return "API Key가 설정되지 않았습니다.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `초등학생/중학생을 대상으로 '${topic}'에 대해 설명해줘. 
      패턴 인식(Pattern Recognition)의 관점에서, 이것이 왜 중요하고 컴퓨터 과학에서 어떻게 쓰이는지 
      쉽고 재미있게 300자 이내로 설명해줘.`,
    });
    return response.text || "설명을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 서비스를 사용할 수 없습니다.";
  }
};

export const evaluateReflection = async (userInput: string): Promise<string> => {
  if (!apiKey) return "API Key가 설정되지 않았습니다.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `학생이 신호등의 규칙을 모델링한 내용이야: "${userInput}".
      이 모델링의 장점과, 놓친 부분(예: 보행자 신호, 비상 상황, 점멸 신호 등)을 
      '패턴 탐정'이라는 친절한 페르소나로 피드백해줘. 
      마지막에는 격려의 말을 덧붙여줘.`,
    });
    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 서비스를 사용할 수 없습니다.";
  }
};

export const getQuizHint = async (question: string): Promise<string> => {
    if (!apiKey) return "API Key가 설정되지 않았습니다.";
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `다음 패턴 문제에 대한 힌트를 줘 (정답은 말하지 마): "${question}". 
        학생이 스스로 규칙을 발견할 수 있도록 유도해줘.`,
      });
      return response.text || "힌트를 생성할 수 없습니다.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "AI 서비스를 사용할 수 없습니다.";
    }
  };
