import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { ProjectState } from "../types";
import { DATA_ITEMS } from "../constants";

// Safety check: Ensure API key exists
const API_KEY = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateRiskScenario = async (project: ProjectState): Promise<string> => {
  if (!API_KEY) return "API 키가 설정되지 않아 AI 시나리오를 불러올 수 없습니다.";

  const topic = project.topic;
  const items = project.selectedDataIds
    .map(id => DATA_ITEMS.find(d => d.id === id)?.name)
    .join(", ");
  const scope = project.disclosureScope;

  const prompt = `
    다음은 고등학교 1학년 학생이 설계한 정보 데이터 프로젝트입니다.
    
    - 주제: ${topic}
    - 수집 데이터 항목: ${items}
    - 공개 범위: ${scope}
    
    이 프로젝트에서 발생할 수 있는 '구체적인 프라이버시 침해 위험 시나리오' 2가지를 짧고 명확하게 제시해주세요.
    학생이 이해하기 쉽게, "만약 ~한다면, ~한 문제가 생길 수 있어요" 말투로 작성해주세요.
    답변은 300자 이내로 해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "시나리오 생성 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결 상태를 확인해주세요.";
  }
};

export const evaluateDescription = async (description: string, topic: string): Promise<string> => {
  if (!API_KEY) return "API 키 오류";
  
  const prompt = `
    학생이 프로젝트 데이터 활용 설명으로 다음과 같이 적었습니다.
    주제: ${topic}
    설명: "${description}"
    
    이 설명이 구체적이고 타당한지 1문장으로 피드백해주고, 보완할 점을 1문장으로 제안해주세요.
    (총 2문장, 친절한 말투)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "피드백 생성 실패";
  } catch (error) {
    return "AI 피드백을 가져올 수 없습니다.";
  }
};