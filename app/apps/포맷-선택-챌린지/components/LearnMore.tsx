import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calculator, HardDrive } from 'lucide-react';

const LearnMore: React.FC = () => {
  const [photoCount, setPhotoCount] = useState(100);
  const [songCount, setSongCount] = useState(50);

  // Assumptions:
  // Raw Photo: 25MB, JPEG: 3MB
  // WAV/FLAC: 40MB, MP3: 4MB
  
  const data = [
    {
      name: '이미지 저장',
      Lossless: (photoCount * 25) / 1024, // GB
      Lossy: (photoCount * 3) / 1024, // GB
    },
    {
      name: '음악 저장',
      Lossless: (songCount * 40) / 1024, // GB
      Lossy: (songCount * 4) / 1024, // GB
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <Calculator className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">내 폰 저장공간 절약 계산기</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">사진 장수: {photoCount}장</label>
              <input 
                type="range" min="10" max="1000" step="10" 
                value={photoCount} onChange={(e) => setPhotoCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">음악 곡수: {songCount}곡</label>
              <input 
                type="range" min="10" max="500" step="10" 
                value={songCount} onChange={(e) => setSongCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
              <p>※ 가정치 기준</p>
              <p>• 무손실 사진(RAW) 25MB vs JPEG 3MB</p>
              <p>• 무손실 음원(WAV) 40MB vs MP3 4MB</p>
            </div>
          </div>

          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" unit="GB" stroke="#64748b" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={80} />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} GB`, '용량']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="Lossless" name="무손실(원본)" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={20} />
                  <Bar dataKey="Lossy" name="손실(압축)" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: '왜 JPEG가 흔한가요?', content: '인간의 눈은 밝기 변화에는 민감하지만, 색상 변화에는 둔감합니다. JPEG는 이 원리를 이용해 사람이 잘 못 느끼는 색상 정보를 대폭 줄여 용량을 1/10로 만듭니다.' },
          { title: 'PNG는 언제 쓰나요?', content: '로고, 아이콘, 텍스트가 있는 이미지처럼 경계선이 뚜렷해야 할 때 씁니다. 또한 "투명 배경"이 필요할 때 필수적입니다. JPEG는 투명도를 지원하지 않습니다.' },
          { title: 'FLAC vs MP3', content: 'FLAC은 지퍼로 파일을 압축하듯 데이터 손실 없이 크기만 줄입니다. MP3는 소리 중 잘 들리지 않는 주파수를 영구적으로 삭제합니다. 고급 스피커가 아니면 구분하기 힘듭니다.' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow border-t-4 border-indigo-500">
            <h3 className="font-bold text-lg mb-3">{card.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{card.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnMore;
