import React from 'react';
import { GalleryItem } from '../types';

const dummyData: GalleryItem[] = [
  { id: 1, title: "학교 축제 홍보 포스터", author: "2학년 김민수", type: "이미지", ccl: "CC BY-NC", imageUrl: "https://picsum.photos/400/500?random=1" },
  { id: 2, title: "환경 보호 캠페인 영상", author: "방송반", type: "영상", ccl: "CC BY-ND", imageUrl: "https://picsum.photos/400/500?random=2" },
  { id: 3, title: "수학 여행 브이로그", author: "1학년 이지은", type: "영상", ccl: "CC BY", imageUrl: "https://picsum.photos/400/500?random=3" },
  { id: 4, title: "과학 탐구 보고서 표지", author: "3학년 박준호", type: "문서", ccl: "CC BY-SA", imageUrl: "https://picsum.photos/400/500?random=4" },
];

const Gallery: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">공유 갤러리</h2>
          <p className="text-slate-500">친구들은 어떻게 CCL을 붙였을까요?</p>
        </div>
        <button className="text-sm text-blue-600 font-medium hover:underline">내 작품 올리기 +</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {dummyData.map((item) => (
          <div key={item.id} className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                {item.ccl}
              </div>
              <div className="absolute bottom-2 left-2 bg-white/90 text-slate-800 text-xs px-2 py-1 rounded font-bold">
                {item.type}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800 truncate mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.author}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-center text-sm text-yellow-800">
        💡 CCL을 붙이면 내 작품이 더 널리, 안전하게 공유될 수 있어요!
      </div>
    </div>
  );
};

export default Gallery;