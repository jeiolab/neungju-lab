import React from 'react';

const Archive: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in text-gray-800">
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
        <h2 className="text-2xl font-bold mb-4 text-indigo-900">필름 보관소: 프레임의 종류</h2>
        <p className="mb-6 text-gray-600">
          동영상 압축은 '변화한 것'만 저장하는 기술입니다. 모든 프레임의 모든 픽셀을 저장하는 대신,
          세 가지 특별한 프레임 종류를 사용하여 용량을 획기적으로 줄입니다.
        </p>

        <div className="space-y-8">
          {/* I-Frame */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-red-50 p-4 rounded-lg">
            <div className="w-full md:w-32 h-32 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
              I-Frame
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-700">인트라 프레임 (기준 프레임)</h3>
              <p className="text-sm text-gray-700">
                JPEG 이미지처럼 완전한 그림 정보를 담고 있습니다. 다른 프레임 없이도 스스로 화면을 보여줄 수 있습니다.
                <strong>가장 용량이 크지만</strong> 화질이 제일 좋고, 동영상 탐색(Seek)의 기준점이 됩니다.
                '키프레임 간격'을 짧게 설정하면 I-Frame이 자주 생성되어 화질이 좋아지지만 용량이 커집니다.
              </p>
            </div>
          </div>

          {/* P-Frame */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-blue-50 p-4 rounded-lg">
            <div className="w-full md:w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0 opacity-80 border-2 border-dashed border-blue-700">
              P-Frame
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-700">예측 프레임 (변화값 저장)</h3>
              <p className="text-sm text-gray-700">
                이전 화면과 비교해서 <strong>달라진 점</strong>만 저장합니다.
                스트리머가 가만히 앉아서 입만 움직인다면, P-Frame은 입의 움직임 데이터만 저장합니다.
                I-Frame보다 용량을 약 50% 이상 절약할 수 있습니다.
              </p>
            </div>
          </div>

          {/* B-Frame */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-green-50 p-4 rounded-lg">
            <div className="w-full md:w-32 h-32 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0 opacity-60 border-2 border-dotted border-green-700">
              B-Frame
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-700">양방향 예측 프레임</h3>
              <p className="text-sm text-gray-700">
                이전 화면뿐만 아니라 <strong>다음 화면</strong>까지 참조해서 이미지를 만들어냅니다.
                가장 압축률이 높지만, 앞뒤 데이터를 모두 계산해야 하므로 컴퓨터가 처리하기 어렵습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-center text-gray-800">GOP (Group of Pictures) 구조 시각화</h3>
          <div className="flex items-center justify-center space-x-2 overflow-x-auto p-4 bg-gray-100 rounded-xl">
            <div className="w-10 h-16 bg-red-500 rounded flex items-center justify-center text-xs text-white font-bold">I</div>
            <div className="w-10 h-16 bg-green-500 rounded flex items-center justify-center text-xs text-white font-bold opacity-60">B</div>
            <div className="w-10 h-16 bg-green-500 rounded flex items-center justify-center text-xs text-white font-bold opacity-60">B</div>
            <div className="w-10 h-16 bg-blue-500 rounded flex items-center justify-center text-xs text-white font-bold opacity-80">P</div>
            <div className="w-10 h-16 bg-green-500 rounded flex items-center justify-center text-xs text-white font-bold opacity-60">B</div>
            <div className="w-10 h-16 bg-green-500 rounded flex items-center justify-center text-xs text-white font-bold opacity-60">B</div>
            <div className="w-10 h-16 bg-blue-500 rounded flex items-center justify-center text-xs text-white font-bold opacity-80">P</div>
            <div className="w-10 h-16 bg-green-500 rounded flex items-center justify-center text-xs text-white font-bold opacity-60">B</div>
            <div className="w-10 h-16 bg-green-500 rounded flex items-center justify-center text-xs text-white font-bold opacity-60">B</div>
            <div className="w-10 h-16 bg-red-500 rounded flex items-center justify-center text-xs text-white font-bold">I</div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">GOP 예시. 빨간색 I-Frame이 나올 때마다 새로운 시퀀스가 시작됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Archive;