import React from 'react';
import { Binary, Network, BookOpen } from 'lucide-react';

export const Theory: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Binary className="w-6 h-6 text-green-600" />
          IPv4와 2진수 (Binary)
        </h2>
        <div className="prose prose-slate max-w-none bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p>
            컴퓨터는 모든 데이터를 <strong>0</strong>과 <strong>1</strong>로만 이해합니다. 
            우리가 흔히 보는 IP 주소(예: <code className="bg-slate-100 px-1 rounded text-green-700">192.168.0.1</code>)는 
            사실 인간이 읽기 쉽게 변환한 것일 뿐, 실제로는 32개의 0과 1로 이루어져 있습니다.
          </p>
          <div className="my-6 p-4 bg-slate-900 text-green-400 font-mono rounded-lg text-center text-lg md:text-xl tracking-widest">
            11000000.10101000.00000000.00000001
          </div>
          <p>
            IP 주소는 8비트(Bit)씩 4개의 덩어리(Octet)로 나뉩니다. 각 덩어리는 <strong>0부터 255</strong>까지의 숫자를 표현할 수 있습니다.
            이것을 이해하기 위해서는 각 비트 자리의 <strong>"가중치(Weight)"</strong>를 알아야 합니다.
          </p>
        </div>
      </section>

      {/* Bit Values Visualization */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800">8비트의 구조</h3>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="mb-6 text-slate-600">
            오른쪽에서 왼쪽으로 갈수록 숫자가 2배씩 커집니다. 스위치가 켜지면(1) 해당 숫자를 더하고, 꺼지면(0) 무시합니다.
          </p>
          <div className="grid grid-cols-8 gap-1 md:gap-2 mb-4">
            {[128, 64, 32, 16, 8, 4, 2, 1].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs md:text-sm text-slate-400 mb-1">2<sup>{7-idx}</sup></div>
                <div className="w-full aspect-square bg-green-50 border border-green-200 rounded flex items-center justify-center font-bold text-green-700 text-sm md:text-lg">
                  {val}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 text-center">
            모든 숫자를 다 더하면? 128 + 64 + ... + 1 = <strong>255</strong>
          </p>
        </div>
      </section>

      {/* Advanced: Subnet Mask */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Network className="w-6 h-6 text-blue-600" />
          [심화] 서브넷 마스크 (Subnet Mask)
        </h2>
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
          <p className="text-slate-700 mb-4">
            서브넷 마스크는 IP 주소에서 <strong>"어디까지가 네트워크 주소이고, 어디까지가 호스트(기기) 주소인지"</strong>를 구분하는 칸막이 역할을 합니다.
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-2">
            <li>
              <span className="font-bold text-slate-900">255.255.255.0</span>의 의미:
              앞의 24비트(3개의 덩어리)는 고정된 네트워크 주소이고, 마지막 8비트만 내 마음대로 기기에 할당할 수 있다는 뜻입니다.
            </li>
            <li>
              이것을 <strong>Prefix 표기법</strong>으로 <code className="bg-blue-100 px-1 rounded text-blue-800">/24</code>라고 씁니다. (1이 24개 있다는 뜻)
            </li>
          </ul>
          
          <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-center">
             <div className="p-3 bg-white rounded border border-blue-200 text-center">
                <div className="text-xs text-slate-400">Binary</div>
                <div className="font-mono text-blue-600">11111111</div>
                <div className="text-sm font-bold mt-1">255</div>
             </div>
             <div className="text-slate-300">.</div>
             <div className="p-3 bg-white rounded border-blue-200 border text-center">
                <div className="text-xs text-slate-400">Binary</div>
                <div className="font-mono text-blue-600">11111111</div>
                <div className="text-sm font-bold mt-1">255</div>
             </div>
             <div className="text-slate-300">.</div>
             <div className="p-3 bg-white rounded border-blue-200 border text-center">
                <div className="text-xs text-slate-400">Binary</div>
                <div className="font-mono text-blue-600">11111111</div>
                <div className="text-sm font-bold mt-1">255</div>
             </div>
             <div className="text-slate-300">.</div>
             <div className="p-3 bg-white rounded border-slate-200 border text-center opacity-50">
                <div className="text-xs text-slate-400">Binary</div>
                <div className="font-mono text-slate-400">00000000</div>
                <div className="text-sm font-bold mt-1">0</div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};