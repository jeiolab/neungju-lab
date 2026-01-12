import { GoogleGenAI } from "@google/genai";

const apiKey = typeof window === 'undefined' ? process.env.API_KEY : (process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_API_KEY || '');
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getFutureDiaryFeedback = async (diaryEntry: string) => {
  if (!ai) {
    return "API 키가 설정되지 않아 미래 일기를 분석할 수 없습니다. 관리자에게 문의하세요.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a career counselor from 10 years in the future (Future Time Machine AI).
        The user is a high school student writing about their dream job and how it might change in 10 years.
        
        User's Diary Entry:
        "${diaryEntry}"
        
        Task:
        1. Analyze their vision of the future job.
        2. Provide encouraging feedback.
        3. Suggest one specific skill they should prepare for based on current trends (AI, automation, etc.).
        4. Keep the tone inspiring, futuristic, and friendly.
        5. Respond in Korean.
        6. Keep it under 200 words.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "미래와의 통신 상태가 불안정합니다. 잠시 후 다시 시도해주세요. (API 키를 확인해주세요)";
  }
};
