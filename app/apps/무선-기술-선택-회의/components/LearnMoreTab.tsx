import React from 'react';
import { CAREERS } from '../constants';
import { BookOpen, Briefcase, Share2, Server } from 'lucide-react';

const LearnMoreTab: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* 1. Pairing Concept */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 flex items-center text-white">
          <Share2 className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-bold">페어링(Pairing)이 뭐야?</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4 leading-relaxed">
            블루투스 기기를 처음 연결할 때 <strong>"페어링"</strong>이라는 과정을 거칩니다. 
            이는 마치 처음 만난 사람과 명함을 교환하고 연락처를 저장하는 것과 같습니다.
            보안을 위해 서로 신뢰할 수 있는 기기인지 확인하고, 암호키를 교환하여 저장해두는 과정이죠.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">왜 필요할까?</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>내 이어폰 소리가 옆 사람 폰에 연결되면 안 되니까! (보안)</li>
              <li>다음 연결부터는 자동으로 빠르게 연결하기 위해 (편의성)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. IoT Examples */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-green-600 p-4 flex items-center text-white">
          <Server className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-bold">우리 주변의 IoT (사물인터넷)</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
            <h3 className="font-bold text-lg mb-1">🏠 스마트 홈</h3>
            <p className="text-sm text-gray-600">외출 시 자동으로 꺼지는 전등, 폰으로 조절하는 보일러</p>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
            <h3 className="font-bold text-lg mb-1">🚌 스마트 교통</h3>
            <p className="text-sm text-gray-600">버스 도착 정보 알림, 하이패스 자동 결제</p>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
            <h3 className="font-bold text-lg mb-1">🏥 스마트 헬스케어</h3>
            <p className="text-sm text-gray-600">실시간 심박수 모니터링 워치, 원격 진료 센서</p>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
            <h3 className="font-bold text-lg mb-1">🏭 스마트 팩토리</h3>
            <p className="text-sm text-gray-600">공장 기계 고장 예측, 로봇 간 무선 협업</p>
          </div>
        </div>
      </section>

      {/* 3. Career Connection */}
      <section>
        <div className="flex items-center mb-4">
          <Briefcase className="w-6 h-6 mr-2 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-800">진로 연결</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CAREERS.map((career, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-md border-t-4 border-indigo-500">
              <h3 className="font-bold text-lg mb-2">{career.title}</h3>
              <p className="text-sm text-gray-600 mb-3 min-h-[3rem]">{career.description}</p>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LearnMoreTab;
