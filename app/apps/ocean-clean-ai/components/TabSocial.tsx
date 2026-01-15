import React from 'react';
import { AlertTriangle, Fish, Bot, Globe } from 'lucide-react';

const TabSocial: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">바다가 여러분의 도움을 필요로 합니다</h2>
          <p className="text-blue-50 text-lg leading-relaxed mb-6">
            매년 수백만 톤의 플라스틱이 바다로 유입됩니다. 전통적인 청소 방법은 느리고 위험합니다. 
            우리는 해양 생물과 쓰레기를 자율적으로 구별할 수 있는 지능형 로봇이 필요합니다.
          </p>
          <div className="flex gap-4">
             <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-300" />
                <span className="font-medium">연간 800만 톤</span>
             </div>
             <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                <Globe className="w-6 h-6 text-green-300" />
                <span className="font-medium">지구촌 위기</span>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      </div>

      {/* Role of AI */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">AI의 역할</h3>
          <p className="text-slate-600">
            컴퓨터 비전 모델은 수중 드론의 비디오 피드를 실시간으로 처리할 수 있습니다. 모델을 학습시키면 로봇이 24시간 내내 높은 정확도로 특정 유형의 폐기물(플라스틱 대 유기물 등)을 식별하도록 가르칠 수 있습니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
            <Fish className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">해양 생물 보호</h3>
          <p className="text-slate-600">
            가장 큰 과제는 떠다니는 비닐봉지와 해파리를 구별하는 것입니다. 잘못 훈련된 AI는 실수로 야생 동물에게 해를 끼칠 수 있습니다. 이것이 바로 우리의 미션에 고품질의 다양한 훈련 데이터가 중요한 이유입니다.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-900 text-indigo-100 p-6 rounded-xl flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-white">모델을 만들 준비가 되셨나요?</h4>
          <p className="text-sm opacity-80">'AI 설계실' 탭으로 이동하여 훈련을 시작하세요.</p>
        </div>
        <div className="h-10 w-10 bg-indigo-700 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xl">➔</span>
        </div>
      </div>
    </div>
  );
};

export default TabSocial;