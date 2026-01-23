import React, { useState } from 'react';
import { Category } from '../types';
import { Camera, Music, Video, ArrowRight } from 'lucide-react';

const Theory: React.FC = () => {
  const [interest, setInterest] = useState<Category | null>(null);

  const renderCard = (title: string, tag: string, desc: string, isLossy: boolean) => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-bold ${isLossy ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
          {isLossy ? '손실' : '무손실'}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-2 font-medium text-indigo-600">{tag}</p>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">어떤 분야에 관심이 있나요?</h2>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setInterest(Category.IMAGE)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 w-24 transition-all ${interest === Category.IMAGE ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm font-bold">이미지</span>
          </button>
          <button 
            onClick={() => setInterest(Category.AUDIO)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 w-24 transition-all ${interest === Category.AUDIO ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <Music className="w-6 h-6" />
            <span className="text-sm font-bold">오디오</span>
          </button>
          <button 
            onClick={() => setInterest(Category.VIDEO)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 w-24 transition-all ${interest === Category.VIDEO ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <Video className="w-6 h-6" />
            <span className="text-sm font-bold">비디오</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {(!interest || interest === Category.IMAGE) && (
          <>
            {renderCard('JPEG (JPG)', '사진 표준', '디카, 웹 사진의 표준. 압축률이 높지만 저장할 때마다 화질이 조금씩 떨어짐. 투명 배경 불가.', true)}
            {renderCard('PNG', '웹 그래픽', '투명 배경 지원. 글자나 로고처럼 경계가 뚜렷한 이미지에 적합. 용량이 JPEG보다 큼.', false)}
            {renderCard('GIF', '움짤', '256가지 색상만 사용 가능. 짧은 애니메이션에 사용되나 화질은 좋지 않음.', false)}
            {renderCard('SVG', '벡터', '수학적 공식으로 그림. 아무리 확대해도 깨지지 않음. 아이콘, 로고에 최적.', false)}
          </>
        )}
        {(!interest || interest === Category.AUDIO) && (
          <>
            {renderCard('MP3', '국민 오디오', '사람이 못 듣는 소리를 제거해 용량을 1/10로 줄임. 대중적.', true)}
            {renderCard('FLAC', '고음질', '원본 오디오를 손실 없이 압축. 용량은 크지만 음질 저하가 전혀 없음.', false)}
            {renderCard('AAC', '스트리밍', 'MP3보다 더 효율적인 압축 방식. 유튜브, 애플 뮤직 등에서 주로 사용.', true)}
          </>
        )}
        {(!interest || interest === Category.VIDEO) && (
          <>
            {renderCard('MP4 (H.264)', '호환성 킹', '가장 널리 쓰이는 비디오 포맷. 화질 대비 용량이 우수함.', true)}
            {renderCard('WebM', '웹 전용', '구글이 만든 웹 친화적 포맷. 브라우저에서 가볍게 돌아감.', true)}
            {renderCard('AVI', '옛날 표준', '윈도우 기본 포맷이었으나 압축 효율이 낮아 요즘은 덜 쓰임.', false)}
          </>
        )}
      </div>
    </div>
  );
};

export default Theory;
