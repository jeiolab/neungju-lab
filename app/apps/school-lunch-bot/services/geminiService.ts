import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const askGeminiCoach = async (userQuery: string): Promise<string> => {
  const client = getClient();
  if (!client) return "오류: API 키가 누락되었습니다. 환경 설정을 확인해주세요.";

  try {
    const model = "gemini-3-flash-preview";
    const systemPrompt = `당신은 학생들을 위한 친절한 "로봇 프로세스 자동화(RPA) 코치"입니다.
    반복문(loops), 배열(arrays), 알고리즘, 경로 탐색(pathfinding)과 같은 개념을 아주 쉽게 설명해주세요.
    "학교 급식 로봇"이 급식실 격자 지도에서 음식을 나누어 주는 상황을 예시로 들어주세요.
    답변은 한국어로 작성하고, 격려하며 교육적인 톤을 유지하세요.`;

    const response = await client.models.generateContent({
      model: model,
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "답변을 명확하게 생성하지 못했습니다. 다시 질문해주세요!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 코치에게 물어보는 중 문제가 발생했습니다. 나중에 다시 시도해주세요.";
  }
};