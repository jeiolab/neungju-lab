import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API Key is missing");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const evaluateThought = async (prompt: string, userAnswer: string) => {
    const ai = getClient();
    if (!ai) return "API Key 오류: 환경 변수를 확인해주세요.";

    try {
        const fullPrompt = `
        당신은 친절하고 전문적인 머신러닝 교육 코치입니다.
        학생에게 다음과 같은 생각해볼 문제(질문)를 주었고, 학생이 답변을 제출했습니다.

        질문: "${prompt}"
        학생 답변: "${userAnswer}"

        이 답변에 대해 3줄 이내로 피드백을 주세요.
        1. 칭찬할 점 혹은 잘 이해한 점.
        2. 부족하거나 보완하면 좋을 점, 혹은 추가로 생각해보면 좋을 점.
        3. 격려의 말.
        말투는 "해요체"로 친절하게 해주세요.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: fullPrompt,
        });

        return response.text || "피드백을 생성할 수 없습니다.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "죄송합니다. 현재 AI 코치와 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.";
    }
};