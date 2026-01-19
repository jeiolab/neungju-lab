import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { SAMPLE_ARTICLES } from '../constants';
import { getTargetPositionForArticle } from '../services/clusteringService';
import { LayoutGrid, Sparkles, Shuffle } from 'lucide-react';

const WIDTH = 800;
const HEIGHT = 400; // Fixed container height for desktop, relative for logic

export const NewsGrouper: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isGrouped, setIsGrouped] = useState(false);

  // Initialize randomized positions
  useEffect(() => {
    scramble();
  }, []);

  const scramble = () => {
    setIsGrouped(false);
    const randomized = SAMPLE_ARTICLES.map(art => ({
      ...art,
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10  // 10% to 90%
    }));
    setArticles(randomized);
  };

  const groupArticles = () => {
    setIsGrouped(true);
    // Logic is handled in render styling via CSS transitions for "magic" feel
    // But we need to update state if we wanted to drag them.
    // Here we just toggle the "mode".
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
        <span className="bg-purple-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">2</span>
        실전 사건: 뒤죽박죽 뉴스 분류하기
      </h3>
      <p className="text-slate-600 mb-6 text-sm">
        탐정님! 뉴스들이 모두 섞여 있습니다. 제목의 단어들을 단서로 <strong>군집화(Clustering)</strong>를 수행하여 비슷한 주제끼리 묶어주세요.
      </p>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={scramble}
          className={`px-5 py-2 rounded-full font-medium flex items-center gap-2 transition-all ${
            !isGrouped ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Shuffle size={18} /> 섞기 (초기 상태)
        </button>
        <button
          onClick={groupArticles}
          className={`px-5 py-2 rounded-full font-medium flex items-center gap-2 transition-all ${
            isGrouped ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Sparkles size={18} /> 자동 묶기 (AI 군집화)
        </button>
      </div>

      <div className="relative w-full h-[400px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden">
        {/* Cluster Labels (Visible only when grouped) */}
        <div className={`absolute top-[30%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${isGrouped ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-4xl font-black text-slate-200 uppercase tracking-widest">Sports</span>
        </div>
        <div className={`absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${isGrouped ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-4xl font-black text-slate-200 uppercase tracking-widest">Politics</span>
        </div>
        <div className={`absolute top-[80%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${isGrouped ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-4xl font-black text-slate-200 uppercase tracking-widest">Enter</span>
        </div>

        {/* Articles */}
        {articles.map((art) => {
          // Calculate target based on state
          let targetX = art.x;
          let targetY = art.y;
          let rotation = (Math.random() - 0.5) * 10;

          if (isGrouped) {
             const target = getTargetPositionForArticle(art.category, 100, 100);
             targetX = target.x;
             targetY = target.y;
             rotation = 0;
          }

          let bgColor = 'bg-white';
          if (isGrouped) {
            if (art.category === 'sports') bgColor = 'bg-blue-50 border-blue-200';
            if (art.category === 'politics') bgColor = 'bg-red-50 border-red-200';
            if (art.category === 'entertainment') bgColor = 'bg-yellow-50 border-yellow-200';
          }

          return (
            <div
              key={art.id}
              className={`absolute px-3 py-2 rounded-lg shadow-sm border text-xs font-bold text-slate-700 transition-all duration-1000 ease-in-out cursor-pointer hover:scale-110 hover:z-50 ${bgColor}`}
              style={{
                left: `${targetX}%`,
                top: `${targetY}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                maxWidth: '120px',
                textAlign: 'center',
                zIndex: isGrouped ? 10 : 20
              }}
            >
              {art.title}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-start gap-3 bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
        <LayoutGrid size={20} className="shrink-0 mt-0.5" />
        <div>
          <strong>탐정의 분석:</strong>
          <p className="mt-1">
             AI는 '손흥민', '골', '이닝' 같은 단어가 자주 등장하는 문서끼리 거리가 가깝다고 판단합니다. 
             정답(이것은 스포츠다!)을 알려주지 않아도, 단어의 등장 패턴만으로 기사들이 자연스럽게 뭉치는 것을 볼 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};