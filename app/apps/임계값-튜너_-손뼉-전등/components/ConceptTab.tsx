import React from 'react';
import { BookOpen, Activity, ToggleLeft, Watch } from 'lucide-react';

const ConceptTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-slate-800">핵심 개념 익히기</h2>
        <p className="text-slate-500">손뼉 전등을 만들기 위해 꼭 알아야 할 3가지 개념입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Threshold */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
            <Activity size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">1. 임계값 (Threshold)</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            "기준선"입니다. 센서 값이 이 선을 넘을 때만 전등이 반응합니다.
            <br/><br/>
            <span className="bg-blue-50 text-blue-700 px-1 rounded font-medium">너무 낮으면?</span> 시끄러운 소음에도 켜져버려요 (오작동).
            <br/>
            <span className="bg-blue-50 text-blue-700 px-1 rounded font-medium">너무 높으면?</span> 손뼉을 세게 쳐도 켜지지 않아요.
          </p>
        </div>

        {/* Card 2: Toggle */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
            <ToggleLeft size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">2. 토글 (Toggle)</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            상태를 뒤집는 것입니다.
            <br/><br/>
            현재 상태가 0(꺼짐)이면 1(켜짐)로, 1이면 0으로 바꿉니다.
            코드로는 <code className="bg-slate-100 px-1 rounded">light = !light</code>와 같이 표현합니다.
          </p>
        </div>

        {/* Card 3: Debounce */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
            <Watch size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">3. 디바운스 (Debounce)</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            연속 입력을 방지하는 "휴식 시간"입니다.
            <br/><br/>
            손뼉 소리는 찰나의 순간에 여러 번 진동합니다. 디바운스가 없으면 전등이 순식간에 켜졌다 꺼질 수 있습니다.
            <br/>
            <span className="text-purple-600 font-medium">"한 번 켜지면 0.5초 동안은 귀를 막아라!"</span>
          </p>
        </div>
      </div>
      
      <div className="bg-slate-100 p-6 rounded-xl mt-6">
          <h4 className="font-bold flex items-center gap-2 mb-2">
              <BookOpen size={20} /> 학습 팁
          </h4>
          <p className="text-sm text-slate-600">
              시뮬레이션 탭에서 <strong>'소음'</strong> 버튼을 눌러보세요. 소음 값이 임계값을 넘지 않도록 조절하면서, 동시에 손뼉 소리에는 잘 반응하는 
              <span className="text-indigo-600 font-bold"> 황금 비율(Sweet Spot)</span>을 찾는 것이 엔지니어의 역할입니다.
          </p>
      </div>
    </div>
  );
};

export default ConceptTab;