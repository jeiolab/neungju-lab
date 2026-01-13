import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateCoachResponse = async (userMessage: string, history: string[] = []): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct prompt with context
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n이전 대화:\n${history.join('\n')}\n\n사용자 질문: ${userMessage}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Fast response for chat
      }
    });

    return response.text || "죄송합니다. 답변을 생성하는 데 문제가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const analyzeDataInsight = async (dataSummary: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음 성적 데이터를 분석하고 특이사항이나 교육적 조언을 한 문단으로 짧게 해줘:\n${dataSummary}`,
    });
    return response.text || "분석 실패";
  } catch (e) {
    return "분석 서비스를 사용할 수 없습니다.";
  }
};