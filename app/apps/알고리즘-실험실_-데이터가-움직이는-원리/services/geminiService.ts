import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing. Please set process.env.API_KEY");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateReflectionResponse = async (question: string, context: string): Promise<string> => {
    try {
        const client = getClient();
        const modelId = "gemini-3-flash-preview";
        
        const systemPrompt = `
        당신은 고등학교 1학년 학생에게 알고리즘을 가르치는 친절하고 비유를 잘 사용하는 'AI 알고리즘 튜터'입니다.
        학생의 질문에 대해 이해하기 쉽게 설명하세요.
        너무 기술적인 용어보다는 일상 생활의 비유(예: 카드 정리, 키 순서대로 줄 서기 등)를 적극 활용하세요.
        답변은 3-4문장으로 간결하지만 핵심을 찌르도록 구성하세요.
        `;

        const response = await client.models.generateContent({
            model: modelId,
            contents: `Context: ${context}\n\nStudent Question: ${question}`,
            config: {
                systemInstruction: systemPrompt,
            }
        });

        return response.text || "죄송합니다. 답변을 생성하는 중에 문제가 발생했습니다.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "현재 AI 튜터와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
    }
};