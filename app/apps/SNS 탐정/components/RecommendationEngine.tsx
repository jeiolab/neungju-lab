import React from 'react';
import { HistoryItem } from '../types';

interface RecommendationEngineProps {
  history: HistoryItem[];
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ history }) => {
  if (history.length === 0) return null;

  // Simple logic: Count occurrences
  const imageCount = history.filter(h => h.type === 'image').length;
  const textCount = history.filter(h => h.type === 'text').length;
  
  // Detect specific content interests (very simple keyword matching)
  const lovesCats = history.some(h => h.content.includes('고양이') || h.content.includes('Cat'));
  const lovesFood = history.some(h => h.content.includes('식당') || h.content.includes('음식'));

  let recommendation = "";
  let reason = "";

  if (lovesCats) {
    recommendation = "🐱 프리미엄 캣타워 & 츄르 세트";
    reason = "사용자가 '고양이' 관련 비정형 데이터(사진/텍스트)를 많이 분석하셨네요!";
  } else if (lovesFood) {
    recommendation = "🍝 미슐랭 가이드 맛집 리스트 구독권";
    reason = "음식/식당 관련 텍스트 분석 이력이 감지되었습니다.";
  } else if (imageCount > textCount) {
    recommendation = "📸 최신 미러리스 카메라";
    reason = "텍스트보다 이미지 분석을 더 많이 사용하셨습니다. 시각적 데이터를 선호하시네요.";
  } else {
    recommendation = "📚 데이터 분석 전문가 도서";
    reason = "텍스트 분석에 관심이 많으시군요. NLP 관련 도서를 추천합니다.";
  }

  return (
    <div className="fixed bottom-6 right-6 max-w-sm w-full bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden animate-[slideUp_0.5s_ease-out] z-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 flex justify-between items-center">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <span>🎁</span> AI 추천 시스템 (Recommendation)
        </h3>
        <span className="text-blue-200 text-xs">Based on Activity</span>
      </div>
      <div className="p-4">
        <p className="text-slate-800 font-bold mb-1 text-lg">{recommendation}</p>
        <p className="text-slate-500 text-sm">{reason}</p>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-indigo-500 font-medium">
            * 넷플릭스나 유튜브도 사용자의 '비정형 데이터 소비 패턴'을 분석해 이렇게 추천합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
