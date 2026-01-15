import { GoogleGenAI } from "@google/genai";
import { BlockType } from "../types";

const getGeminiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing from environment variables");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const evaluatePipelineWithAI = async (
    scenarioTitle: string,
    scenarioContext: string,
    userSequence: BlockType[],
    correctSequence: BlockType[]
): Promise<{ success: boolean; message: string; title: string }> => {
    
    const client = getGeminiClient();
    if (!client) {
        // Fallback if API key is missing
        return {
            success: false,
            title: "시스템 오류",
            message: "AI 코치와 연결할 수 없습니다. (API Key Missing)"
        };
    }

    // Simple strict equality check first to determine success/fail for the AI's tone
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(correctSequence);

    const prompt = `
    당신은 친절하고 전문적인 'AI 데이터 엔지니어링 코치'입니다.
    학생이 '${scenarioTitle}' 서비스를 만들기 위해 데이터 파이프라인 퍼즐을 조립했습니다.
    
    상황(Context): ${scenarioContext}
    
    학생이 조립한 순서: ${userSequence.join(' -> ')}
    정답 순서: ${correctSequence.join(' -> ')}
    
    결과: ${isCorrect ? "성공" : "실패"}

    지시사항:
    1. 결과가 '성공'이면, 이 파이프라인이 어떻게 작동해서 사람들에게 도움을 주는지 가상의 성과(정확도, 처리 속도 등)를 포함하여 칭찬해 주세요. (2문장 이내)
    2. 결과가 '실패'이면, 학생의 순서에서 가장 먼저 잘못된 부분이나 논리적으로 말이 안 되는 부분(예: 저장하기 전에 분석을 시도함)을 찾아 친절하게 조언해 주세요. 정답을 바로 알려주기보다 힌트를 주세요. (2문장 이내)
    3. 말투는 학생을 격려하는 선생님처럼 하세요.
    `;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return {
            success: isCorrect,
            title: isCorrect ? "🎉 파이프라인 가동 성공!" : "🔧 파이프라인 점검 필요",
            message: response.text || "AI 응답을 불러올 수 없습니다."
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            success: isCorrect,
            title: isCorrect ? "성공 (AI 연결 실패)" : "실패 (AI 연결 실패)",
            message: isCorrect 
                ? "축하합니다! 정답입니다. (AI 상세 피드백을 불러오지 못했습니다)" 
                : "순서가 맞지 않습니다. 다시 한 번 논리적으로 생각해보세요. (AI 상세 피드백을 불러오지 못했습니다)"
        };
    }
};

export const getConceptExplanation = async (concept: string) => {
    const client = getGeminiClient();
    if (!client) return "설명을 불러올 수 없습니다.";

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `초중고 학생이 이해하기 쉽게 '${concept}'에 대해 3줄 요약 설명해줘. 실제 예시를 1개 포함해줘.`,
        });
        return response.text;
    } catch (e) {
        return "일시적인 오류로 설명을 불러올 수 없습니다.";
    }
}
