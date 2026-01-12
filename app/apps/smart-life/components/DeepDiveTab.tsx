import React from 'react';
import { ShieldAlert, Smartphone, Eye, Scale } from 'lucide-react';

const DeepDiveTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">편리함의 뒷면</h2>
        <p className="text-gray-600">
          스마트 라이프를 진정으로 즐기기 위해서는<br />
          밝은 면(편리함)뿐만 아니라 어두운 면(문제점)도 함께 고민해야 합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Privacy */}
        <div className="bg-white rounded-2xl shadow-lg border-l-4 border-red-500 overflow-hidden">
          <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <h3 className="text-xl font-bold text-gray-900">개인정보 보호 문제</h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-gray-700 leading-relaxed">
              IoT 기기들은 항상 인터넷에 연결되어 나의 생활 패턴 데이터를 수집합니다. 
              이 데이터가 해킹되거나 유출되면 사생활이 침해될 수 있습니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
              <strong className="text-red-500 block mb-1">💡 생각해보기</strong>
              우리 집 스마트 스피커가 내가 하는 모든 말을 듣고 있다면 어떨까요? 
              비밀번호 설정과 보안 업데이트가 필수적입니다.
            </div>
          </div>
        </div>

        {/* Card 2: Digital Dependence */}
        <div className="bg-white rounded-2xl shadow-lg border-l-4 border-orange-500 overflow-hidden">
          <div className="p-6 bg-orange-50 border-b border-orange-100 flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-900">디지털 의존도 심화</h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-gray-700 leading-relaxed">
              모든 것을 기계가 대신해주면서 스스로 기억하거나 해결하는 능력이 떨어지는 
              &apos;디지털 치매&apos; 현상이 나타날 수 있습니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
              <strong className="text-orange-500 block mb-1">💡 생각해보기</strong>
              스마트폰 배터리가 없을 때 친구 전화번호를 기억할 수 있나요? 
              가끔은 기기 없이 뇌를 쓰는 시간이 필요합니다.
            </div>
          </div>
        </div>
      </div>

      {/* Balance Section */}
      <div className="mt-12 bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-md">
        <Scale className="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <h3 className="text-2xl font-bold mb-4 text-slate-900">균형 잡힌 시각이 중요해요!</h3>
        <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
          기술은 도구일 뿐입니다. 기술의 주인이 되어 편리함을 누리되, 
          그에 따른 책임과 안전도 함께 챙기는 &apos;스마트한 시민&apos;이 되어야 합니다.
        </p>
      </div>
    </div>
  );
};

export default DeepDiveTab;