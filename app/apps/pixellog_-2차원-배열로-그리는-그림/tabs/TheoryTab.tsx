import React from 'react';
import { Layers, Box, Grid3X3 } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800 space-y-12">
      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Layers className="text-blue-600" size={32} />
          이미지는 숫자의 감옥이다?
        </h2>
        <p className="mb-6 leading-relaxed text-gray-700 text-lg">
          우리가 컴퓨터 화면에서 보는 화려한 그림들은 사실 거대한 <strong className="text-blue-600">숫자의 나열</strong>입니다.
          가장 간단한 흑백 이미지는 0(흰색)과 1(검은색)로만 이루어져 있죠.
          이 숫자들을 가로와 세로로 줄지어 놓은 것을 <strong className="text-blue-600">2차원 배열(2D Array)</strong>이라고 부릅니다.
        </p>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border-2 border-blue-200 flex flex-col md:flex-row gap-8 items-center justify-center shadow-inner">
          <div className="text-center">
            <div className="text-sm text-gray-600 font-semibold mb-3">우리 눈에 보이는 것</div>
            <div className="w-32 h-32 grid grid-cols-3 gap-1 bg-white p-2 rounded-lg shadow-lg border-2 border-gray-300">
              <div className="bg-gray-900 rounded"></div><div className="bg-white rounded"></div><div className="bg-gray-900 rounded"></div>
              <div className="bg-white rounded"></div><div className="bg-gray-900 rounded"></div><div className="bg-white rounded"></div>
              <div className="bg-gray-900 rounded"></div><div className="bg-white rounded"></div><div className="bg-gray-900 rounded"></div>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">↔</div>
          <div className="text-center">
            <div className="text-sm text-gray-600 font-semibold mb-3">컴퓨터가 보는 것</div>
            <div className="font-mono text-sm bg-gray-900 text-green-400 p-5 rounded-lg text-left shadow-lg border-2 border-gray-700">
              [<br/>
              &nbsp;&nbsp;[1, 0, 1],<br/>
              &nbsp;&nbsp;[0, 1, 0],<br/>
              &nbsp;&nbsp;[1, 0, 1]<br/>
              ]
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Box className="text-green-600" size={32} />
          리스트 안의 리스트 (List of Lists)
        </h2>
        <p className="mb-6 leading-relaxed text-gray-700 text-lg">
          프로그래밍에서 1차원 리스트가 기차처럼 한 줄로 연결된 데이터라면,
          2차원 리스트는 이 기차들을 여러 줄로 쌓아 올린 아파트와 같습니다.
        </p>
        <ul className="list-disc pl-8 space-y-3 marker:text-blue-600 text-gray-700">
          <li className="text-lg"><strong className="text-blue-600">행(Row):</strong> 가로 줄 (아파트의 층수)</li>
          <li className="text-lg"><strong className="text-blue-600">열(Column):</strong> 세로 줄 (아파트의 호수)</li>
          <li className="text-lg">데이터에 접근할 때는 <code className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-mono">grid[행][열]</code> 순서로 주소를 적습니다.</li>
        </ul>
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm">
          <p className="font-mono text-gray-800 text-base">
            예시: <span className="text-blue-600 font-bold">grid[1][2]</span>의 의미는? <br/>
            → 1번 인덱스 행(두 번째 줄)의 2번 인덱스 열(세 번째 칸)
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Grid3X3 className="text-purple-600" size={32} />
          더 생각해보기: RGB와 3차원
        </h2>
        <p className="mb-4 leading-relaxed text-gray-700 text-lg">
          흑백은 0과 1 하나만 있으면 되지만, 컬러 사진은 빨강(R), 초록(G), 파랑(B) 세 가지 빛이 섞여야 합니다.
          그래서 컬러 이미지는 <code className="bg-gray-100 px-2 py-1 rounded text-purple-600 font-mono">[행][열][색상]</code>의 <strong className="text-purple-600">3차원 배열</strong>이 됩니다.
        </p>
      </section>
    </div>
  );
};