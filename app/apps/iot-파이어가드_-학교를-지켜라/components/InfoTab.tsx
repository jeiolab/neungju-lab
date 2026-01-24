import React from 'react';
import { SensorInfo } from '../types';
import { Zap, Sun, ThermometerSun } from 'lucide-react';

const sensors: SensorInfo[] = [
  {
    name: '정온식 감지기',
    type: '정온식',
    description: '일정한 온도(예: 70°C) 이상이 되면 내부의 바이메탈이 휘어지며 접점이 붙어 화재를 알립니다.',
    usage: '주로 주방, 보일러실 등 열이 많이 발생하는 곳에 설치합니다.',
    icon: 'ThermometerSun'
  },
  {
    name: '차동식 감지기',
    type: '차동식',
    description: '온도가 급격하게 상승할 때(예: 1분에 10°C 이상 상승) 공기가 팽창하는 원리를 이용해 작동합니다.',
    usage: '거실, 사무실, 교실 등 평소 온도 변화가 적은 곳에 설치합니다.',
    icon: 'Zap'
  },
  {
    name: '광전식 감지기',
    type: '광전식',
    description: '연기 입자에 의해 빛이 산란되는 것을 감지합니다. 연기가 먼저 발생하는 화재에 효과적입니다.',
    usage: '복도, 계단, 침실 등 연기가 퍼지기 쉬운 곳에 설치합니다.',
    icon: 'Sun'
  }
];

const InfoTab: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
       <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
         어떤 센서를 써야 할까요?
       </h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {sensors.map((sensor, idx) => (
           <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
             <div className={`h-32 flex items-center justify-center ${
               idx === 0 ? 'bg-orange-100' : idx === 1 ? 'bg-blue-100' : 'bg-purple-100'
             }`}>
                {idx === 0 && <ThermometerSun className="w-16 h-16 text-orange-500 group-hover:scale-110 transition-transform" />}
                {idx === 1 && <Zap className="w-16 h-16 text-blue-500 group-hover:scale-110 transition-transform" />}
                {idx === 2 && <Sun className="w-16 h-16 text-purple-500 group-hover:scale-110 transition-transform" />}
             </div>
             <div className="p-6">
               <div className="flex items-center gap-2 mb-3">
                 <span className={`text-xs font-bold px-2 py-1 rounded text-white ${
                    idx === 0 ? 'bg-orange-500' : idx === 1 ? 'bg-blue-500' : 'bg-purple-500'
                 }`}>
                   {sensor.type}
                 </span>
                 <h3 className="text-xl font-bold text-slate-800">{sensor.name}</h3>
               </div>
               <p className="text-slate-600 text-sm mb-4 leading-relaxed h-20">
                 {sensor.description}
               </p>
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <p className="text-xs font-semibold text-slate-500 mb-1">추천 설치 장소</p>
                 <p className="text-sm font-medium text-slate-800">{sensor.usage}</p>
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

export default InfoTab;
