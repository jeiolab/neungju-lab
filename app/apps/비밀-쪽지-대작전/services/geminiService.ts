import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDiscussionFeedback = async (topic: string, studentAnswer: string): Promise<string> => {
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