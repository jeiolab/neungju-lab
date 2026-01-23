import React, { PropsWithChildren } from 'react';

interface NoteCardProps {
  title: string;
  icon: string;
}

const NoteCard = ({ title, children, icon }: PropsWithChildren<NoteCardProps>) => (
  <div className="bg-retro-panel p-6 rounded-lg border-l-4 border-retro-green shadow-lg">
    <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-retro text-lg text-retro-green">{title}</h3>
    </div>
    <div className="font-mono text-sm leading-relaxed text-gray-300">
        {children}
    </div>
  </div>
);

const DevNotes = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-retro text-white mb-8">엔지니어 로그북</h2>

      <NoteCard title="비트맵 (BMP) - 날것의 데이터" icon="📦">
        <p>
          비트맵은 모든 칸을 기억해야 하는 완벽한 그리드라고 생각하면 됩니다. 
          10x10 그리드라면 100개의 픽셀이 있죠. 각 픽셀이 3바이트(RGB)를 차지한다면, 
          파일 크기는 정확히 300바이트입니다. 화질은 좋지만 매우 무겁습니다!
        </p>
      </NoteCard>

      <NoteCard title="런 렝스 부호화 (RLE)" icon="🏃">
        <p>
          RLE는 '무손실' 압축입니다. 화질 손상이 전혀 없죠. 
          '검정, 검정, 검정, 검정'이라고 길게 말하는 대신 '검정 4개'라고 요약하는 방식입니다.
        </p>
        <div className="bg-black p-3 mt-2 rounded font-mono text-green-400 text-xs">
            00000 → 0이 5개 <br/>
            11100 → 1이 3개, 0이 2개
        </div>
        <p className="mt-2 text-xs text-gray-400">
            *단색 영역이 넓은 픽셀 아트에는 최고지만, 복잡한 사진에는 최악입니다!*
        </p>
      </NoteCard>

      <NoteCard title="JPEG - 망각의 예술" icon="🌫️">
        <p>
          JPEG는 '손실' 압축입니다. 인간의 눈이 완벽하지 않다는 점을 이용하죠. 
          픽셀 뭉치(보통 8x8)를 가져와서 '충분히 비슷한' 색상으로 평균을 냅니다. 
          세밀한 색상 정보도 과감히 버립니다.
        </p>
        <p className="mt-2">
            결과: 파일은 매우 작아지지만(1/10 크기!), 확대해보면 뭉개짐이나 노이즈가 보입니다.
        </p>
      </NoteCard>
    </div>
  );
};

export default DevNotes;