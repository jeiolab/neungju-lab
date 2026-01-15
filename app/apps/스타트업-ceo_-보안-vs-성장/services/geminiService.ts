'use client';

import { GameStats, Scenario } from '../types';

export const generateDynamicScenario = async (
  week: number,
  stats: GameStats,
  historySummary: string
): Promise<Scenario | null> => {
  try {
    const response = await fetch('/api/gemini/startup/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week, stats, historySummary }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.scenario || null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateEndGameReport = async (
  finalStats: GameStats,
  historyLog: string
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/startup/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalStats, historyLog }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "연결 오류로 리포트를 생성할 수 없습니다.";
    }

    const data = await response.json();
    return data.text || "분석 실패.";
  } catch (error) {
    return "연결 오류로 리포트를 생성할 수 없습니다.";
  }
};
