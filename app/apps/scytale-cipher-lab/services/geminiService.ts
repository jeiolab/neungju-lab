import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSecretMessage = async (): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    // Fallback if no API key (Korean)
    const fallbacks = [
      "트로이 목마 준비",
      "새벽에 공격하라",
      "동쪽 문을 열라",
      "파르테논에서 만나자",
      "올빼미는 밤에 난다",
      "승리는 용감한 자의 것"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short secret message in Korean (max 5 words, no spaces usually preferred for ciphers but use spaces for readability here) suitable for a spy or ancient greek general. No punctuation.",
    });
    
    // Allow Korean characters, uppercase English, and spaces. Remove other punctuation.
    const text = response.text?.trim() || "";
    return text.replace(/[^가-힣A-Za-z\s]/g, '');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "시스템 오류 다시 시도";
  }
};