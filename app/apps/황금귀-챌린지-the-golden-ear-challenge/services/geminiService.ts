import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getExpertExplanation = async (topic: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `당신은 세계적인 음향 엔지니어이자 음악 프로듀서 멘토입니다. 
      다음 개념을 연습생 프로듀서에게 명확하고 간결하게(150단어 이내) 설명해주세요.
      소리, 음향학, 또는 디지털 신호 처리와 관련된 비유를 사용하세요.
      반드시 **한국어**로 답변해주세요.
      
      주제: ${topic}
      맥락: ${context}`,
    });
    return response.text || "마스터 엔지니어와의 연결이 실패했습니다. 주파수(네트워크)를 확인하세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "엔지니어가 현재 녹음 세션 중입니다. 나중에 다시 시도해주세요.";
  }
};

export const generateQuizHint = async (question: string, wrongAnswer: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `연습생이 문제에 오답을 제출했습니다. 정답을 직접 알려주지 말고, 음향학적 원리와 관련된 짧고 도움이 되는 힌트를 **한국어**로 제공하세요.
      
      문제: ${question}
      연습생의 오답: ${wrongAnswer}`,
    });
    return response.text || "나이퀴스트-섀넌 샘플링 이론을 다시 생각해보세요.";
  } catch (error) {
    return "디지털 오디오 기초 노트를 복습하세요.";
  }
}