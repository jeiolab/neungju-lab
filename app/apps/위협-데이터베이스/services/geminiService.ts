'use client';

import { NewsItem } from '../types';

export const generateSecurityNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch('/api/gemini/news', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.news || [];
  } catch (error) {
    console.error("Failed to generate news", error);
    return [
      {
        headline: "시뮬레이션 모드: API 연결 불가",
        summary: "실시간 데이터를 가져올 수 없습니다. 인터넷 연결이나 API 키를 확인해주세요.",
        date: new Date().toISOString().split('T')[0],
        impactLevel: 'Low'
      }
    ];
  }
};

export const analyzeEssay = async (essay: string): Promise<{ score: number; feedback: string }> => {
  try {
    const response = await fetch('/api/gemini/essay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ essay }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.score !== undefined ? errorData : { score: 0, feedback: 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
    }

    const data = await response.json();
    return { score: data.score || 0, feedback: data.feedback || '피드백을 생성할 수 없습니다.' };
  } catch (error) {
    console.error("Essay analysis failed", error);
    return { score: 0, feedback: "시스템 오프라인. 현재 에세이를 평가할 수 없습니다." };
  }
};