import React, { useState } from 'react';
import { Share2, HardDrive, Cloud, Bluetooth } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'local' | 'cloud' | 'bluetooth' | null>(null);

  const renderFeedback = () => {
    switch (selectedMethod) {
      case 'local':
        return (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded animate-fade-in">
            <h4 className="font-bold text-amber-800 flex items-center gap-2">
              <HardDrive size={18} /> USB / 외장하드 공유
            </h4>
            <ul className="mt-2 text-sm text-amber-900 space-y-1">
              <li>👍 <b>장점:</b> 인터넷이 없어도 대용량 파일을 빠르게 옮길 수 있어.</li>
              <li>👎 <b>단점:</b> USB를 잃어버리면 끝장! 바이러스 감염 위험도 높아.</li>
              <li>⚠️ <b>주의:</b> 남의 USB를 꽂을 땐 항상 백신 검사부터!</li>
            </ul>
          </div>
        );
      case 'cloud':
        return (
          <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded animate-fade-in">
            <h4 className="font-bold text-sky-800 flex items-center gap-2">
              <Cloud size={18} /> 클라우드 공유 (Google Drive 등)
            </h4>
            <ul className="mt-2 text-sm text-sky-900 space-y-1">
              <li>👍 <b>장점:</b> 어디서든 접속 가능하고, 여럿이 동시에 수정할 수 있어(협업).</li>
              <li>👎 <b>단점:</b> 인터넷이 끊기면 못 써. 계정이 해킹되면 자료가 다 털려.</li>
              <li>⚠️ <b>주의:</b> 공유 권한 설정(보기/편집)을 꼭 확인해!</li>
            </ul>
          </div>
        );
      case 'bluetooth':
        return (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded animate-fade-in">
            <h4 className="font-bold text-indigo-800 flex items-center gap-2">
              <Bluetooth size={18} /> 블루투스 / AirDrop
            </h4>
            <ul className="mt-2 text-sm text-indigo-900 space-y-1">
              <li>👍 <b>장점:</b> 데이터 요금 없이 가까운 친구에게 사진 보내기 딱 좋아.</li>
              <li>👎 <b>단점:</b> 거리가 멀어지면 끊기고, 모르는 사람이 파일을 보낼 수도 있어.</li>
              <li>⚠️ <b>주의:</b> 안 쓸 땐 꺼두는 게 보안과 배터리에 좋아.</li>
            </ul>
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-slate-400">
            위 버튼을 눌러 공유 방식을 선택해봐!
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">공유 방식 선택기</h2>
        <p className="text-slate-600 mt-2">상황에 맞는 공유 방법을 선택하고, 어떤 점을 주의해야 할지 확인해봐.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedMethod('local')}
          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition hover:shadow-md ${selectedMethod === 'local' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-200 bg-white'}`}
        >
          <HardDrive size={32} className={selectedMethod === 'local' ? 'text-amber-600' : 'text-slate-400'} />
          <span className="font-bold text-slate-700">USB/직접</span>
        </button>
        <button
          onClick={() => setSelectedMethod('cloud')}
          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition hover:shadow-md ${selectedMethod === 'cloud' ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200' : 'border-slate-200 bg-white'}`}
        >
          <Cloud size={32} className={selectedMethod === 'cloud' ? 'text-sky-600' : 'text-slate-400'} />
          <span className="font-bold text-slate-700">클라우드</span>
        </button>
        <button
          onClick={() => setSelectedMethod('bluetooth')}
          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition hover:shadow-md ${selectedMethod === 'bluetooth' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 bg-white'}`}
        >
          <Bluetooth size={32} className={selectedMethod === 'bluetooth' ? 'text-indigo-600' : 'text-slate-400'} />
          <span className="font-bold text-slate-700">근거리 무선</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[160px]">
        {renderFeedback()}
      </div>
    </div>
  );
};

export default SimulationTab;