import React from 'react';
import { Layers, Box, Grid3X3 } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-slate-300 space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="text-blue-500" />
          이미지는 숫자의 감옥이다?
        </h2>
        <p className="mb-4 leading-relaxed">
          우리가 컴퓨터 화면에서 보는 화려한 그림들은 사실 거대한 <strong>숫자의 나열</strong>입니다.
          가장 간단한 흑백 이미지는 0(흰색)과 1(검은색)로만 이루어져 있죠.
          이 숫자들을 가로와 세로로 줄지어 놓은 것을 <strong>2차원 배열(2D Array)</strong>이라고 부릅니다.
        </p>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">우리 눈에 보이는 것</div>
            <div className="w-24 h-24 grid grid-cols-3 gap-1 bg-white p-1 rounded">
              <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
              <div className="bg-white"></div><div className="bg-black"></div><div className="bg-white"></div>
              <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-600">↔</div>
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">컴퓨터가 보는 것</div>
            <div className="font-mono text-sm bg-slate-950 p-4 rounded text-left">
              [<br/>
              &nbsp;&nbsp;[1, 0, 1],<br/>
              &nbsp;&nbsp;[0, 1, 0],<br/>
              &nbsp;&nbsp;[1, 0, 1]<br/>
              ]
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Box className="text-green-500" />
          리스트 안의 리스트 (List of Lists)
        </h2>
        <p className="mb-4 leading-relaxed">
          프로그래밍에서 1차원 리스트가 기차처럼 한 줄로 연결된 데이터라면,
          2차원 리스트는 이 기차들을 여러 줄로 쌓아 올린 아파트와 같습니다.
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li><strong>행(Row):</strong> 가로 줄 (아파트의 층수)</li>
          <li><strong>열(Column):</strong> 세로 줄 (아파트의 호수)</li>
          <li>데이터에 접근할 때는 <code>grid[행][열]</code> 순서로 주소를 적습니다.</li>
        </ul>
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
          <p className="font-mono text-blue-200">
            예시: <span className="text-yellow-400">grid[1][2]</span>의 의미는? <br/>
            → 1번 인덱스 행(두 번째 줄)의 2번 인덱스 열(세 번째 칸)
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Grid3X3 className="text-purple-500" />
          더 생각해보기: RGB와 3차원
        </h2>
        <p className="mb-4 leading-relaxed">
          흑백은 0과 1 하나만 있으면 되지만, 컬러 사진은 빨강(R), 초록(G), 파랑(B) 세 가지 빛이 섞여야 합니다.
          그래서 컬러 이미지는 <code>[행][열][색상]</code>의 <strong>3차원 배열</strong>이 됩니다.
        </p>
      </section>
    </div>
  );
};