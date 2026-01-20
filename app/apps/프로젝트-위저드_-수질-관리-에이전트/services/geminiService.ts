'use client';

import { AgentDesign } from "../types";

export const getAgentDesignFeedback = async (design: AgentDesign): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/project-wizard/agent-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ design }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.feedback || "오류: API 키가 없습니다. 설정을 확인해주세요.";
    }

    const data = await response.json();
    return data.feedback || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "죄송합니다. 현재 AI 선생님과 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const getDailyMission = async (): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/project-wizard/daily-mission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.mission || "오늘의 미션: 센서 목록을 다시 검토해보세요.";
    }

    const data = await response.json();
    return data.mission || "오늘의 미션: 시뮬레이션 탭을 탐험해보세요.";
  } catch (error) {
    return "오늘의 미션: 예외 상황에 대한 논리를 점검해보세요.";
  }
}