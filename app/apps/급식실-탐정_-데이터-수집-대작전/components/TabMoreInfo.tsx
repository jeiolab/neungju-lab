import React from 'react';
import { Wifi, Video, Thermometer, Database } from 'lucide-react';

const TabMoreInfo: React.FC = () => {
  const sensors = [
    {
      title: "PIR 동작 감지 센서",
      desc: "사람이나 동물이 움직일 때 발생하는 적외선 변화를 감지해요. 급식실 입장 인원 카운팅에 쓰여요.",
      icon: <Wifi className="w-10 h-10 text-blue-500" />
    },
    {
      title: "스마트 음식물 처리기",
      desc: "버려지는 잔반의 무게를 자동으로 측정해서 데이터베이스로 전송해요. 메뉴 선호도 분석의 핵심!",
      icon: <Database className="w-10 h-10 text-green-500" />
    },
    {
      title: "IoT 온습도 센서",
      desc: "급식실 내부의 쾌적함을 유지하기 위해 온도와 습도를 실시간으로 체크해요.",
      icon: <Thermometer className="w-10 h-10 text-red-500" />
    },
    {
      title: "지능형 CCTV (AI)",
      desc: "단순 녹화가 아니라, 줄이 얼마나 긴지 AI가 분석해서 '혼잡도' 알림을 보내줄 수 있어요.",
      icon: <Video className="w-10 h-10 text-purple-500" />
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-slate-800">🏫 스마트 스쿨의 비밀 도구들</h2>
         <p className="text-slate-500 mt-2">실제 학교 현장에서 데이터 수집을 위해 사용되는 최신 기술들을 소개합니다.</p>
       </div>

       <div className="grid md:grid-cols-2 gap-6">
         {sensors.map((sensor, idx) => (
           <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 flex items-start gap-4">
             <div className="bg-slate-50 p-3 rounded-xl shrink-0">
               {sensor.icon}
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-800 mb-2">{sensor.title}</h3>
               <p className="text-slate-600 text-sm leading-relaxed">{sensor.desc}</p>
             </div>
           </div>
         ))}
       </div>

       <div className="bg-indigo-900 text-white p-6 rounded-2xl mt-8">
         <h3 className="font-bold text-lg mb-2">💡 데이터 수집의 미래</h3>
         <p className="text-indigo-200 text-sm">
           미래의 학교는 수집된 데이터를 통해 급식 수요를 예측하고, 
           음식물 쓰레기를 줄이며, 가장 맛있는 식단을 자동으로 추천해주는 
           'AI 영양사'가 활동하게 될 것입니다.
         </p>
       </div>
    </div>
  );
};

export default TabMoreInfo;
