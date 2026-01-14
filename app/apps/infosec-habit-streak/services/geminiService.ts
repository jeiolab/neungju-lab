import { GoogleGenAI } from "@google/genai";
import { maskPII } from "../utils";

const API_KEY = process.env.API_KEY || ''; // Ensure this environment variable is set

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getReflectionFeedback = async (
  missionTitle: string,
  userReflection: string
): Promise<string> => {
  if (!API_KEY) return "AI 피드백을 받으려면 API 키가 필요합니다. (데모 모드: 훌륭한 회고입니다!)";

  const maskedReflection = maskPII(userReflection);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Role: You are a friendly Information Security Tutor for a high school student.
        Task: Provide a 2-sentence encouraging feedback on the student's reflection about a daily security mission.
        Mission: ${missionTitle}
        Student's Reflection: "${maskedReflection}"
        
        Constraint:
        1. Keep it under 100 characters in Korean.
        2. Be positive and emphasize the value of the habit.
        3. Do not include PII in the output.
      `,
    });
    return response.text || "훌륭한 습관입니다! 매일 조금씩 더 안전해지고 있어요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "훌륭한 습관입니다! 매일 조금씩 더 안전해지고 있어요. (AI 연결 실패)";
  }
};

export const getDeepDiveConcept = async (conceptTitle: string): Promise<string> => {
  if (!API_KEY) return "정보 공유는 편의성을 주지만, 정보 보호는 안전을 줍니다. 이 둘의 균형이 핵심입니다.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Explain the concept of "${conceptTitle}" to a high school student in the context of Digital Information Security.
        Provide a short paragraph (max 3 sentences) explaining why balancing "Sharing" and "Protection" is important regarding this concept.
        Language: Korean.
      `,
    });
    return response.text || "정보 보호와 공유의 균형이 중요합니다.";
  } catch (error) {
    return "정보 보호와 공유의 균형이 중요합니다.";
  }
};
