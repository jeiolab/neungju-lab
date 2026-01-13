import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSecurityNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Search for the latest cybersecurity news headlines from the last 24-48 hours (or very recent). Return 3 key news items in Korean. Include the source URL if available in the JSON.',
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              date: { type: Type.STRING },
              impactLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
              url: { type: Type.STRING },
            },
            required: ['headline', 'summary', 'date', 'impactLevel'],
          },
        },
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as NewsItem[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate news", error);
    return [
      {
        headline: "시뮬레이션 모드: API 연결 불가",
        summary: "실시간 데이터를 가져올 수 없습니다. 인터넷 연결이나 API 키를 확인해주세요.",
        date: new Date().toISOString().split('T')[0],
        impactLevel: 'Low'
      }
    ];
  }
};

export const analyzeEssay = async (essay: string): Promise<{ score: number; feedback: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate the following short essay on "Why do we need White Hat Hackers?". The essay is likely in Korean.
      Essay: "${essay}"
      
      Provide a JSON response with a score (0-100) and a brief, encouraging feedback paragraph in Korean explaining key points they missed or got right.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
          },
          required: ['score', 'feedback'],
        },
      },
    });
    
    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Essay analysis failed", error);
    return { score: 0, feedback: "시스템 오프라인. 현재 에세이를 평가할 수 없습니다." };
  }
};