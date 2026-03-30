import React from 'react';
import { Wifi, Bluetooth, Radio } from 'lucide-react';

const TabLearnMore: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">📡 통신 방식 비교</h2>
      <p className="text-slate-600 mb-8">스마트 홈 기기들은 어떤 언어로 대화할까요? 상황에 맞는 통신 방식을 선택하는 것이 중요합니다.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Wi-Fi */}
        <div className="bg-white rounded-xl shadow-md border-t-4 border-blue-500 p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Wifi className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-xl mb-2">Wi-Fi</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>✅ <strong>장점:</strong> 속도가 매우 빠르고, 멀리까지 갑니다.</li>
            <li>⚠️ <strong>단점:</strong> 전기를 많이 먹습니다. (배터리 기기에 부적합)</li>
            <li>🏠 <strong>용도:</strong> CCTV, AI 스피커, 대용량 데이터 전송</li>
          </ul>
        </div>

        {/* Bluetooth */}
        <div className="bg-white rounded-xl shadow-md border-t-4 border-blue-400 p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Bluetooth className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-bold text-xl mb-2">Bluetooth LE</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>✅ <strong>장점:</strong> 전기를 아주 적게 먹습니다. 스마트폰과 연결이 쉽습니다.</li>
            <li>⚠️ <strong>단점:</strong> 연결 거리가 짧습니다.</li>
            <li>🏠 <strong>용도:</strong> 웨어러블 기기, 스마트 도어락</li>
          </ul>
        </div>

        {/* Zigbee/Z-Wave */}
        <div className="bg-white rounded-xl shadow-md border-t-4 border-purple-500 p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Radio className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-xl mb-2">Zigbee / Matter</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>✅ <strong>장점:</strong> 기기끼리 서로서로 연결(Mesh)하여 범위를 넓힐 수 있습니다.</li>
            <li>⚠️ <strong>단점:</strong> 전용 게이트웨이(허브)가 필요할 수 있습니다.</li>
            <li>🏠 <strong>용도:</strong> 스마트 전구, 센서류 대량 연결</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TabLearnMore;