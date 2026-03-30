import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const dataCompare = [
  { name: '블루투스', distance: 10, speed: 24, power: 1 },
  { name: '와이파이', distance: 100, speed: 100, power: 8 },
  { name: 'NFC', distance: 1, speed: 1, power: 1 },
  { name: '5G', distance: 500, speed: 200, power: 10 },
];

const dataRadar = [
  { subject: '속도', A: 40, B: 90, fullMark: 100 },
  { subject: '거리', A: 20, B: 80, fullMark: 100 },
  { subject: '보안', A: 90, B: 60, fullMark: 100 },
  { subject: '비용', A: 90, B: 50, fullMark: 100 },
  { subject: '전력효율', A: 90, B: 40, fullMark: 100 },
];

export const TabMoreInfo: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">네트워크 기술 심층 분석</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-indigo-700">기술별 성능 비교 (임의 수치)</h3>
          <p className="text-sm text-slate-500 mb-4">각 기술의 속도(Mbps 단위 환산)와 도달 거리(m)를 비교합니다.</p>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataCompare}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="distance" name="도달 거리 (m)" fill="#8884d8" />
                <Bar dataKey="speed" name="속도 지수" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-indigo-700">블루투스(A) vs 와이파이(B)</h3>
          <p className="text-sm text-slate-500 mb-4">두 기술의 특성을 방사형 차트로 비교해봅시다.</p>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="블루투스" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="와이파이" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-indigo-900 text-white rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4">5G와 사물인터넷(IoT)</h3>
            <p className="mb-4 leading-relaxed text-indigo-100">
              5G는 단순히 속도만 빠른 것이 아닙니다. 
              <span className="font-bold text-yellow-300"> 초저지연</span>(반응 속도가 매우 빠름)과 
              <span className="font-bold text-yellow-300"> 초연결</span>(수많은 기기를 동시에 연결)이 핵심입니다.
            </p>
            <p className="mb-4 text-indigo-100">
              이러한 특성 덕분에 모든 사물이 인터넷에 연결되는 
              <span className="font-bold text-white"> 사물인터넷(IoT)</span> 세상이 가능해집니다.
              냉장고가 스스로 우유를 주문하고, 스마트 워치가 병원에 내 건강 정보를 보내는 미래가 이미 와 있습니다.
            </p>
          </div>
          <div className="w-full md:w-1/3 bg-indigo-800 rounded-xl p-6">
            <h4 className="font-bold text-lg mb-3 border-b border-indigo-600 pb-2">핵심 키워드</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>LTE보다 20배 빠른 속도</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>지연 시간 0.001초 (실시간 제어)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>1km² 당 100만 기기 연결</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
