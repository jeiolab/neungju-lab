import { GoogleGenAI } from "@google/genai";
import { ProjectDraft } from "../types";

const getGeminiInstance = () => {
    const apiKey = process.env.API_KEY || ''; // Typically user might input this if not in env
    // For this demo, we assume the environment variable or a user input mechanism handled in UI
    // In a real browser app, we usually ask user for key or use a proxy. 
    // Here we will handle the "missing key" gracefully in the UI.
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

export const generateAIFeedback = async (project: ProjectDraft): Promise<string> => {
    const ai = getGeminiInstance();
    if (!ai) {
        throw new Error("API Key not configured");
    }

    const prompt = `
    당신은 친절하고 전문적인 '청소년 AI 프로젝트 멘토'입니다. 
    학생이 작성한 다음 머신러닝 프로젝트 기획서를 검토하고 피드백을 주세요.
    
    [기획서 내용]
    - 주제: ${project.topic}
    - SDGs 목표 ID: ${project.sdgId}
    - 문제 정의: (현재) ${project.problemCurrent} -> (목표) ${project.problemGoal}
    - 데이터: 특성(${project.dataFeatures}), 레이블(${project.dataLabels})
    - 데이터 수집 방법: ${project.dataCollectionMethod}
    - 모델 유형: ${project.modelType}
    - 평가 계획: ${project.evalMetrics}
    
    [요청 사항]
    1. 이 프로젝트의 실현 가능성을 평가해주세요.
    2. 데이터 수집 과정에서 발생할 수 있는 윤리적 문제나 편향성 위험을 경고해주세요.
    3. 모델 성능을 높이기 위한 구체적인 팁을 한 가지 주세요.
    4. 말투는 중학생이 이해하기 쉽고 격려하는 톤으로 작성해주세요.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        return response.text || "AI 응답을 생성할 수 없습니다.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("AI 피드백 생성 중 오류가 발생했습니다.");
    }
};

export const suggestDataSources = async (topic: string): Promise<string> => {
    const ai = getGeminiInstance();
    if (!ai) return "API 키가 없어 추천할 수 없습니다. 공공데이터포털(data.go.kr)을 검색해보세요.";

    const prompt = `
    주제: "${topic}"에 대한 머신러닝 프로젝트를 하려는데 데이터가 부족합니다.
    학생들이 접근 가능한 데이터 소스(공공데이터, 캐글, 직접 수집 방법 등) 3가지를 추천해주고,
    데이터를 직접 만들 수 있는 설문조사 문항 예시 2개를 제안해주세요.
    `;

    try {
        const response = await ai.models.generateContent({
             model: "gemini-3-flash-preview",
             contents: prompt,
        });
        return response.text || "추천 정보를 가져올 수 없습니다.";
    } catch (error) {
         return "오류가 발생했습니다. 직접 설문조사를 기획해보세요.";
    }
}
