import { GoogleGenAI } from "@/lib/genai-browser-shim";

const getClient = () => {
    const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
    if (!apiKey) {
        console.error("API Key not found in environment variables");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const evaluateDesignThinking = async (
    problemType: string,
    userAnswer: string
): Promise<{ feedback: string; score: number }> => {
    const ai = getClient();
    if (!ai) {
        return {
            feedback: "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. (데모 모드: 논리적입니다!)",
            score: 80
        };
    }

    const prompt = `
    당신은 고등학교 정보 교과의 친절한 선생님입니다. 
    학생이 무선 통신 기술(WiFi, Bluetooth, NFC, RFID 등)에 대한 서술형 문제에 답했습니다.
    
    문제 유형: ${problemType}
    학생 답변: ${userAnswer}
    
    다음 형식의 JSON으로만 응답해주세요:
    {
      "feedback": "학생에게 줄 구체적이고 칭찬이 포함된 피드백 (3문장 이내)",
      "score": 0에서 100 사이의 점수 (정수)
    }
    
    평가 기준:
    1. 기술적 용어의 정확성
    2. 트레이드오프(비용, 거리, 속도 등)에 대한 고려
    3. 논리적 타당성
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts', // Using a flash model for speed
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response text");
        
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            feedback: "AI 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            score: 0
        };
    }
};
