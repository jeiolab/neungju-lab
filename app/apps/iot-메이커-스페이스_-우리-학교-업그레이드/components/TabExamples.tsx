import React from 'react';
import { Utensils, CheckCircle, Wind } from 'lucide-react';

const TabExamples: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">🏫 실제 학교 IoT 적용 사례</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div className="h-40 bg-orange-100 flex items-center justify-center">
            <Utensils className="w-16 h-16 text-orange-400" />
          </div>
          <div className="p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-2">스마트 급식 시스템</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              잔반 처리기에 무게 센서를 부착하여 학생들이 버리는 잔반량을 실시간으로 측정합니다. 학급별 데이터를 비교해 '잔반 없는 날' 이벤트를 자동으로 운영할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div className="h-40 bg-blue-100 flex items-center justify-center">
             <CheckCircle className="w-16 h-16 text-blue-400" />
          </div>
          <div className="p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-2">전자 출결 시스템 (RFID/Beacon)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              학생증(RFID/NFC)을 단말기에 태그하거나, 교실에 설치된 비콘(Beacon)이 학생의 스마트폰 신호를 감지하여 자동으로 출석을 체크합니다.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div className="h-40 bg-green-100 flex items-center justify-center">
            <Wind className="w-16 h-16 text-green-400" />
          </div>
          <div className="p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-2">자동 환기 및 공기질 관리</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              미세먼지와 이산화탄소 농도를 센서로 측정합니다. 수치가 나빠지면 자동으로 공기청정기를 켜거나 창문 개폐 모터를 작동시켜 쾌적한 교실을 만듭니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabExamples;