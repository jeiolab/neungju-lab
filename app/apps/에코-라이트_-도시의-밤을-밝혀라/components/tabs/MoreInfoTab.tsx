import React from 'react';
import { Card } from '../ui/Card';
import { Eye, Wifi, BatteryCharging } from 'lucide-react';

export const MoreInfoTab: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      <Card title="보행자 인식 디밍(Dimming)">
        <div className="flex justify-center my-4">
            <Eye size={48} className="text-sky-500" />
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          항상 100% 밝기로 켜두는 대신, 평소에는 30% 밝기로 유지하다가 보행자가 감지되면 100%로 밝히는 기술입니다. 
          이를 통해 전력을 최대 <strong>70%</strong>까지 절감할 수 있습니다.
        </p>
      </Card>

      <Card title="IoT 네트워크 관제">
        <div className="flex justify-center my-4">
            <Wifi size={48} className="text-purple-500" />
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          LoRa, Zigbee 등의 저전력 장거리 통신 기술을 사용하여 수천 개의 가로등을 중앙 센터에서 실시간으로 감시합니다.
          고장 난 가로등을 시민 신고보다 먼저 파악할 수 있습니다.
        </p>
      </Card>

      <Card title="태양광 하이브리드">
        <div className="flex justify-center my-4">
            <BatteryCharging size={48} className="text-green-500" />
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          낮 동안 태양광 패널로 배터리를 충전하고 밤에 그 전력을 사용하는 친환경 가로등입니다. 
          장마철에는 부족한 전력을 전력망에서 가져오는 하이브리드 방식이 주로 쓰입니다.
        </p>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-slate-100 to-indigo-50 border-indigo-200">
        <h3 className="text-xl font-bold text-indigo-900 mb-2">실제 적용 사례: 서울시 스마트 폴</h3>
        <p className="text-indigo-700 text-sm">
          단순한 가로등이 아닙니다. 가로등 기능뿐만 아니라 CCTV, 공공 와이파이, S-Dot(도시 데이터 센서), 
          전기차 충전기능까지 결합된 '도시의 신경망' 역할을 수행하고 있습니다.
        </p>
      </Card>
    </div>
  );
};