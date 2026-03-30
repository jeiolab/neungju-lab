import React, { useState } from 'react';
import { ShieldCheck, XCircle } from 'lucide-react';

const LearnMoreTab: React.FC = () => {
  const [dataBits, setDataBits] = useState([1, 0, 1, 1, 0, 1, 0]); // 7 bits
  
  // Calculate Even Parity: The total number of 1s (including parity bit) should be even.
  const onesCount = dataBits.filter(b => b === 1).length;
  const parityBit = onesCount % 2 === 0 ? 0 : 1;

  const toggleBit = (index: number) => {
    const newBits = [...dataBits];
    newBits[index] = newBits[index] === 0 ? 1 : 0;
    setDataBits(newBits);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">오류 검출: 패리티 비트</h2>
        <p className="text-slate-600">패킷이 이동하다가 데이터가 깨졌는지 어떻게 알 수 있을까요?</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">짝수 패리티 (Even Parity) 원리</h3>
            <p className="text-slate-600">
                데이터의 1의 개수를 짝수로 맞춰주는 추가 비트(Parity Bit)를 맨 뒤에 붙입니다.
                수신 측에서 1의 개수를 세어 홀수라면, 전송 중에 오류가 발생했음을 알 수 있습니다.
            </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 bg-slate-50 rounded-xl">
            {/* Data Bits */}
            <div className="flex gap-2">
                {dataBits.map((bit, idx) => (
                    <button
                        key={idx}
                        onClick={() => toggleBit(idx)}
                        className={`w-12 h-16 rounded-lg text-2xl font-bold flex flex-col items-center justify-center transition-all shadow-sm border-b-4 active:border-b-0 active:translate-y-1
                            ${bit === 1 ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-slate-200 text-slate-600 border-slate-300'}
                        `}
                    >
                        {bit}
                        <span className="text-[10px] font-normal text-slate-400">Data</span>
                    </button>
                ))}
            </div>

            <div className="text-4xl text-slate-300">+</div>

            {/* Parity Bit Display */}
            <div className={`w-12 h-16 rounded-lg text-2xl font-bold flex flex-col items-center justify-center border-b-4 bg-orange-100 text-orange-700 border-orange-300`}>
                {parityBit}
                <span className="text-[10px] font-normal text-orange-400">Parity</span>
            </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-lg font-medium text-blue-800">
                현재 1의 개수: <span className="font-bold">{onesCount}</span> (데이터) + <span className="font-bold">{parityBit}</span> (패리티) = <span className="font-bold text-2xl">{onesCount + parityBit}</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
                {(onesCount + parityBit) % 2 === 0 ? (
                    <span className="flex items-center gap-2 text-green-600 font-bold">
                        <ShieldCheck /> 정상: 짝수입니다.
                    </span>
                ) : (
                    <span className="flex items-center gap-2 text-red-600 font-bold">
                        <XCircle /> 오류: 홀수입니다!
                    </span>
                )}
            </div>
        </div>

        <div className="mt-6 text-sm text-slate-500 text-center">
            * 팁: 위의 파란색 데이터 비트를 클릭해서 값을 바꿔보세요. 패리티 비트가 자동으로 변하여 항상 총 개수를 짝수로 맞춥니다.
        </div>
      </div>
    </div>
  );
};

export default LearnMoreTab;
