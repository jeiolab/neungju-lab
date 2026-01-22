import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getDiscussionFeedback = async (topic: string, studentAnswer: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    // Fallback if no API key
    const fallbacks = [
      `좋은 생각이에요! ${topic}에 대해 더 깊이 생각해보면, 보안의 핵심은 항상 예상치 못한 공격에 대비하는 거예요. 🔒`,
      `훌륭해요! ${topic}를 이해하고 있네요. 실제로는 여러 보안 기법을 조합해서 사용하는 게 중요해요! 🛡️`,
      `잘 이해하고 있어요! ${topic}는 단순히 기술만이 아니라 사람의 행동 패턴도 고려해야 해요. 👏`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  try {
    const prompt = `
      당신은 '학교 보안 동아리 부장' 페르소나를 가진 친절하고 유쾌한 튜터입니다.
      고1 학생이 암호학 주제인 "${topic}"에 대해 다음과 같은 의견을 냈습니다: "${studentAnswer}".
      
      이 학생의 답변에 대해 칭찬을 먼저 하고, 보안적인 관점에서 추가로 생각해볼 만한 점이나, 정답에 가까운 내용을 쉽고 재미있게 설명해주세요.
      답변은 3문장 내외로 간결하게 작성해주세요. 이모지를 적절히 사용하여 친근감을 주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "부장님이 잠깐 자리를 비웠나 봐요! 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "통신 보안 문제 발생! 잠시 후 다시 시도해줘. 🚨";
  }
};