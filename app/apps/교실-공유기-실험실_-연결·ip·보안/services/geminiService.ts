import { GoogleGenAI } from "@/lib/genai-browser-shim";

const getAiClient = () => {
    // In a real scenario, ensure (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") is available or handle the error gracefully UI side
    if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
};

export const evaluateActionPlan = async (scenario: string, userPlan: string) => {
    try {
        const ai = getAiClient();
        const prompt = `
        당신은 친절하고 전문적인 네트워크 엔지니어 선생님입니다.
        학생이 다음 네트워크 문제 상황에 대해 해결 계획을 작성했습니다.
        
        상황: "${scenario}"
        학생의 계획: "${userPlan}"
        
        학생의 계획에 대해 다음 형식으로 피드백을 주세요:
        1. 점수 (100점 만점)
        2. 잘한 점 (1문장)
        3. 보완할 점이나 팁 (1문장)
        4. 총평 (짧게)
        
        말투는 학생을 격려하는 "해요체"를 사용하세요.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "AI 코치 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
    }
};