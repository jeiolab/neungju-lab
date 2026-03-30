import React from 'react';
import { BookOpen, Server, Wifi, BatteryCharging } from 'lucide-react';

const EcoLibrary: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-emerald-600" />
          에코 도서관
        </h2>
        <p className="text-gray-600">디지털 습관이 지구에 미치는 영향을 배워보세요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
            <Server size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">보이지 않는 구름, 클라우드</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            '클라우드'는 하늘에 떠 있는 구름이 아닙니다. 거대한 데이터 센터에 있는 수백만 대의 물리적 서버들로 이루어져 있죠.
            이 서버들은 24시간 내내 작동하며 엄청난 양의 전기를 소모하고, 과열을 막기 위해 강력한 냉각 시스템을 필요로 합니다.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
            <Wifi size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">데이터 전송과 에너지</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            동영상을 스트리밍하거나 큰 파일을 다운로드할 때마다, 데이터는 수많은 케이블, 라우터, 안테나를 거쳐 이동합니다.
            이 과정에서도 에너지가 소모됩니다. 4K 화질로 스트리밍하는 것은 HD 화질보다 훨씬 더 많은 에너지를 사용합니다!
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
            <BatteryCharging size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">다크 데이터</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            '다크 데이터'는 수집되고 저장되었지만 다시는 사용되지 않는 데이터(예: 오래된 백업, 흔들린 사진)를 말합니다.
            전체 저장 데이터의 50% 이상이 '다크 데이터'로 추정되며, 매일 조용히 에너지를 낭비하고 있습니다.
          </p>
        </div>

        {/* Card 4 - Actionable */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm border border-green-100">
          <h3 className="text-xl font-bold text-green-800 mb-3">삼양 교과서 팩트 체크</h3>
          <blockquote className="italic text-green-700 mb-4 border-l-4 border-green-400 pl-4">
            "디지털 미니멀리즘은 환경 보호 운동입니다. 우리가 생성하고 저장하는 데이터의 양을 줄이는 것은 기후 변화에 대응하는 직접적인 실천입니다."
          </blockquote>
          <ul className="text-sm text-green-800 space-y-2 list-disc list-inside">
            <li>읽지 않는 뉴스레터 구독 취소하기.</li>
            <li>중복된 사진 삭제하기.</li>
            <li>모바일 데이터 사용 시 스트리밍 화질 낮추기.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EcoLibrary;