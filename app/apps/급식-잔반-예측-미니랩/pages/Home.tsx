'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Trophy, Star, TrendingUp } from 'lucide-react';
import { getStats, updateStreak } from '../utils/storageUtils';
import { UserStats } from '../types';

const Home: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    updateStreak();
    setStats(getStats());
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">오늘의 데이터 실험을 시작해볼까요?</h2>
        <p className="text-indigo-100 mb-6">
          급식 잔반, 매점 판매량 데이터를 분석하고 AI 모델을 직접 만들어보세요.
          데이터 사이언티스트가 되어 학교의 문제를 해결할 수 있습니다.
        </p>
        <div className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-3 rounded-xl">
          실험 시작하기
          <ArrowRight className="w-4 h-4" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase">내 배지</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {stats.badges.length > 0 ? stats.badges.length : '0'} <span className="text-sm font-normal text-slate-500">개</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {stats.badges.length === 0 ? "첫 배지를 획득해보세요!" : "훌륭합니다!"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold uppercase">퀴즈 점수</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {stats.quizScore} <span className="text-sm font-normal text-slate-500">점</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">이론 마스터에 도전하세요.</p>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          학습 로드맵
        </h3>
        <div className="space-y-2">
          <div className="block bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800">1. 개념 익히기</h4>
                <p className="text-xs text-slate-500">회귀분석과 데이터 파이프라인 이해하기</p>
              </div>
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">기초</div>
            </div>
          </div>
          <div className="block bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800">2. 잔반 예측 실험실</h4>
                <p className="text-xs text-slate-500">노이즈와 과적합 직접 체험하기</p>
              </div>
              <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">핵심</div>
            </div>
          </div>
          <div className="block bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800">3. 연구 노트 작성</h4>
                <p className="text-xs text-slate-500">실험 결과를 정리하고 가설 검증하기</p>
              </div>
              <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">심화</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;