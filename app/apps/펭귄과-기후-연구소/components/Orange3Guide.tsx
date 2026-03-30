import React from 'react';
import { FileSpreadsheet, ScatterChart, Network, MousePointerClick } from 'lucide-react';

const Orange3Guide: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-orange-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">오렌지3(Orange3) 가이드</h2>
        <p className="text-gray-600">
          오렌지3는 강력한 시각적 데이터 분석 도구입니다. 복잡한 코딩 대신 '위젯'을 드래그 앤 드롭하여 데이터를 분석할 수 있습니다.
          우리 펭귄 연구소에서 주로 사용하는 핵심 위젯들을 소개합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Widget 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">파일 (File)</h3>
          </div>
          <p className="text-gray-600 text-sm">
            분석의 시작점입니다. 펭귄 데이터(penguin.csv) 같은 파일을 불러옵니다. 어떤 데이터가 특징(Input)이고, 우리가 예측하고 싶은 목표(Target)인지 설정할 수 있습니다.
          </p>
        </div>

        {/* Widget 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <ScatterChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">산점도 (Scatter Plot)</h3>
          </div>
          <p className="text-gray-600 text-sm">
            데이터를 2차원 그래프로 보여줍니다. 부리 길이(X축)와 날개 길이(Y축)의 관계를 한눈에 볼 수 있습니다. 점의 색깔은 주로 펭귄의 종을 나타냅니다.
          </p>
        </div>

        {/* Widget 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">KNN / k-Means</h3>
          </div>
          <p className="text-gray-600 text-sm">
            분석의 핵심 두뇌입니다. KNN은 새로운 점이 찍혔을 때, 가장 가까운 이웃 'k'개를 살펴보고 그 점이 어떤 그룹에 속하는지 판단합니다.
          </p>
        </div>

        {/* Widget 4 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">인터랙티브 시각화</h3>
          </div>
          <p className="text-gray-600 text-sm">
            오렌지3의 그래프는 살아있습니다! 산점도에서 특정 점들을 선택하면, 선택된 데이터만 따로 다음 위젯으로 보내 더 깊이 분석할 수 있습니다.
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100 mt-4">
        <h4 className="font-bold text-orange-800 mb-2">박사님의 팁:</h4>
        <p className="text-orange-700 text-sm">
          분석을 시작하기 전에 항상 <strong>결측치(Missing Values)</strong>가 있는지 확인하세요. 잘못된 데이터가 들어가면 잘못된 결과가 나옵니다!
        </p>
      </div>
    </div>
  );
};

export default Orange3Guide;