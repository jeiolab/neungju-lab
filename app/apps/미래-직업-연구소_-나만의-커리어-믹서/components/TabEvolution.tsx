import React from 'react';
import { ArrowRight, Brain, Cpu, Users } from 'lucide-react';

const TabEvolution: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
      <header className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">직업의 미래: 사라지는 것이 아니라 '변화'합니다</h2>
        <p className="text-slate-600 text-lg">
          2035년, 우리는 AI와 경쟁하는 것이 아니라 
          <span className="font-bold text-indigo-600"> AI와 한 팀이 되어</span> 일하게 됩니다.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Brain className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">과거의 두려움</h3>
          </div>
          <p className="text-slate-600 mb-4">
            "AI가 내 일자리를 뺏어갈 거야." <br/>
            단순 반복적인 업무는 자동화되고 있습니다. 하지만 이것은 인간이 더 가치 있는 일에 집중할 수 있게 해줍니다.
          </p>
          <ul className="text-sm text-slate-500 list-disc pl-5 space-y-1">
            <li>단순 계산 및 데이터 입력</li>
            <li>기계적인 번역</li>
            <li>정형화된 고객 응대</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 ring-1 ring-indigo-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Cpu className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-indigo-800">미래의 기회</h3>
          </div>
          <p className="text-slate-600 mb-4">
            "AI를 도구로 활용해 더 멋진 결과를 만들자." <br/>
            인간의 고유한 역량(창의성, 공감)에 기술을 더해 전에는 없던 새로운 직업이 탄생합니다.
          </p>
          <ul className="text-sm text-slate-500 list-disc pl-5 space-y-1">
            <li>AI 윤리 컨설턴트</li>
            <li>로봇-인간 협업 코디네이터</li>
            <li>가상 공간 디자이너</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 rounded-3xl mt-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h4 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Users className="w-6 h-6 text-yellow-400" />
              할리우드 작가와 AI의 공존
            </h4>
            <p className="opacity-90 leading-relaxed mb-4">
              2023년 할리우드 작가 파업은 단순한 '거부'가 아니었습니다. 
              결국 작가들은 <strong>"AI를 대본 작성의 보조 도구로 쓰되, 
              창작의 주체는 인간임을 명시"</strong>하는 합의를 이끌어냈습니다.
              이것이 바로 우리가 나아갈 '현명한 공존'의 모델입니다.
            </p>
            <div className="inline-flex items-center gap-2 text-yellow-400 font-medium">
              <span>기술은 거들 뿐, 주인공은 당신입니다</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabEvolution;