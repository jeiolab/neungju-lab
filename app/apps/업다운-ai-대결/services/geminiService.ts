import { GoogleGenAI } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

// Helper to create a model instance
const getModel = () => {
  // Using gemini-3-flash-preview as requested for text tasks
  return 'gemini-3-flash-preview';
};

export const checkAnswer = async (question: string, userAnswer: string): Promise<string> => {
  if (!apiKey) return "API 키가 설정되지 않았습니다.";
  
  try {
    const prompt = `
      당신은 이진 탐색 알고리즘을 가르치는 친절한 컴퓨터 과학 튜터입니다.
      학생이 받은 질문: "${question}"
      학생의 답변: "${userAnswer}"
      
      답변을 평가해주세요. 
      1. 정확성: 맞았는지 틀렸는지 판별해주세요.
      2. 설명: 이유를 간단히 설명해주세요 (최대 2문장).
      3. 어조: 격려하는 말투로 한국어로 답변해주세요.
    `;

    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "현재 AI 튜터와 연결할 수 없습니다.";
  }
};

export const getDiscussionFeedback = async (topic: string, thought: string): Promise<string> => {
    if (!apiKey) return "API 키가 설정되지 않았습니다.";
    
    try {
      const prompt = `
        주제: "${topic}" (이진 탐색 또는 정렬 관련).
        사용자의 생각: "${thought}".
        
        다음과 같이 답변해주세요:
        1. 사용자의 아이디어를 인정합니다.
        2. 컴퓨터 과학 개념(해시 맵, 트리, 인덱싱 등)과 연결하여 설명을 확장합니다.
        3. 이해를 돕기 위한 추가 질문을 던집니다.
        100단어 이내로 한국어로 답변해주세요.
      `;
  
      const response = await ai.models.generateContent({
        model: getModel(),
        contents: prompt,
      });
  
      return response.text || "응답이 생성되지 않았습니다.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "AI 서비스 연결 오류가 발생했습니다.";
    }
  };