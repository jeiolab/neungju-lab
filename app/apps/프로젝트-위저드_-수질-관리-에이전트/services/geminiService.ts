import { AgentDesign } from "../types";

export const getAgentDesignFeedback = async (design: AgentDesign): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/water-agent-wizard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design),
    });
    const data = await response.json();
    if (!response.ok) {
      return data.text || "오류: API 키가 없습니다. 설정을 확인해주세요.";
    }
    return data.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "죄송합니다. 현재 AI 선생님과 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const getDailyMission = async (): Promise<string> => {
  return "오늘의 미션: 시뮬레이션 탭을 탐험해보세요.";
};
