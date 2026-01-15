import { GoogleGenAI } from "@google/genai";
import { WizardData } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing. Please set process.env.API_KEY.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSpeechScript = async (data: WizardData): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "API 키 오류로 생성할 수 없습니다.";

  const prompt = `
    다음은 학생의 진로 설계 데이터입니다.
    
    [학생 데이터]
    - 희망 직업: ${data.targetJob}
    - 선택 이유: ${data.jobReason}
    - 필요 역량: ${data.capabilities.filter(c => c.selected).map(c => c.name).join(', ')}
    - 자격 요건: ${data.requirements}
    - 주요 직무: ${data.duties}
    - 장기 목표: ${data.longTermGoal}
    - 탐색 계획: ${data.searchWhere}에서 ${data.searchWhat}을(를) ${data.searchWhen}까지 알아볼 것임.
    - 실패 대비: 실패 시 ${data.failureScenario} 상황이 올 수 있으나, ${data.contingencyPlan}으로 대처.

    이 데이터를 바탕으로 학교 수행평가 발표용 1분 스피치 대본을 작성해주세요.
    말투는 "안녕하십니까, 저는 ~가 되고 싶은 학생입니다."로 시작하는 정중하고 열정적인 톤으로 작성해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "생성된 내용이 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "대본 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const evaluateSimulation = async (scenario: string): Promise<{ score: number; feedback: string }> => {
  const ai = getAIClient();
  if (!ai) return { score: 0, feedback: "API 키 설정 필요" };

  const prompt = `
    학생이 진로 계획의 한 요소를 다음과 같이 변경했습니다: "${scenario}"
    
    이 변경이 현실적으로 얼마나 성공 가능성이 있는지 0~100점 사이의 점수와, 
    3줄 이내의 짧은 피드백(조언)을 JSON 형식으로 주세요.
    
    형식 예시:
    { "score": 75, "feedback": "도전적인 목표지만 구체적인 실행 계획이 동반되어야 합니다. 시간 관리에 유의하세요." }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const text = response.text || "{}";
    const json = JSON.parse(text);
    return {
        score: typeof json.score === 'number' ? json.score : 50,
        feedback: json.feedback || "피드백을 생성할 수 없습니다."
    };
  } catch (error) {
    console.error("Gemini Sim Error:", error);
    return { score: 50, feedback: "분석 중 오류가 발생했습니다." };
  }
};
