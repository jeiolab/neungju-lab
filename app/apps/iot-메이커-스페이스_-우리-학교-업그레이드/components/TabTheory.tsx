import React from 'react';
import { Cpu, Eye, Thermometer, Volume2, Lightbulb, Wifi, Activity } from 'lucide-react';
import { SensorInfo, ActuatorInfo } from '../types';

const sensors: SensorInfo[] = [
  { id: 'temp', name: '온도 센서', description: '주변의 온도를 측정합니다. (예: 에어컨 제어)', icon: 'temp' },
  { id: 'pir', name: '인체 감지(PIR) 센서', description: '사람이나 동물의 움직임을 감지합니다. (예: 자동 조명)', icon: 'pir' },
  { id: 'light', name: '조도 센서', description: '주변의 밝기를 측정합니다. (예: 스마트 가로등)', icon: 'light' },
  { id: 'sound', name: '소리 센서', description: '소리의 크기를 감지합니다. (예: 층간소음 경보)', icon: 'sound' },
  { id: 'pressure', name: '압력 센서', description: '누르는 힘을 감지합니다. (예: 의자 착석 여부)', icon: 'pressure' },
];

const actuators: ActuatorInfo[] = [
  { id: 'led', name: 'LED / 전광판', description: '빛을 내거나 글자를 표시합니다.', icon: 'led' },
  { id: 'speaker', name: '스피커 / 부저', description: '소리나 경고음을 냅니다.', icon: 'speaker' },
  { id: 'motor', name: '서보 모터', description: '물체를 움직이거나 회전시킵니다. (예: 창문 개폐)', icon: 'motor' },
  { id: 'fan', name: '팬 (Fan)', description: '바람을 일으킵니다.', icon: 'fan' },
];

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Cpu className="w-6 h-6 text-indigo-600" />
          피지컬 컴퓨팅이란?
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          디지털 기술을 이용해 물리적인 세상과 소통하는 시스템을 만드는 것입니다.
          <br />
          <strong>입력(센서)</strong> → <strong>처리(컴퓨터/알고리즘)</strong> → <strong>출력(액추에이터)</strong>의 과정을 거칩니다.
        </p>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <h3 className="font-semibold text-indigo-800 mb-2">💡 교과서 속 마이크로비트</h3>
          <p className="text-sm text-indigo-700">
            우리 교과서에 나오는 '마이크로비트'는 작은 컴퓨터입니다. 온도 센서, 빛 센서, 버튼 등이 내장되어 있고, LED 화면으로 결과를 보여줄 수 있죠. 이 앱에서는 마이크로비트처럼 다양한 센서를 조합해 시스템을 설계해봅니다.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" /> 입력 장치 (센서) 도감
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {s.id === 'temp' && <Thermometer size={20} />}
                  {s.id === 'pir' && <Activity size={20} />}
                  {s.id === 'light' && <Eye size={20} />}
                  {s.id === 'sound' && <Volume2 size={20} />}
                  {s.id === 'pressure' && <Activity size={20} />}
                </div>
                <h4 className="font-bold text-slate-700">{s.name}</h4>
              </div>
              <p className="text-sm text-slate-500">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-orange-600" /> 출력 장치 (액추에이터) 도감
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actuators.map((a) => (
            <div key={a.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
               <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  {a.id === 'led' && <Lightbulb size={20} />}
                  {a.id === 'speaker' && <Volume2 size={20} />}
                  {a.id === 'motor' && <Cpu size={20} />}
                  {a.id === 'fan' && <Wifi size={20} />}
                </div>
                <h4 className="font-bold text-slate-700">{a.name}</h4>
              </div>
              <p className="text-sm text-slate-500">{a.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TabTheory;