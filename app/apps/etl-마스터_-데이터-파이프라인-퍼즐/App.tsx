import React, { useState } from 'react';
import { AppTab } from './types';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { BookOpen, Gamepad2, Building2, HelpCircle, BrainCircuit, BoxSelect } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SIMULATION);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.THEORY:
        return <TheoryView />;
      case AppTab.SIMULATION:
        return <SimulationTab />;
      case AppTab.REAL_WORLD:
        return <RealWorldView />;
      case AppTab.QUIZ:
        return <QuizTab />;
      case AppTab.REFLECTION:
        return <ReflectionTab />;
      default:
        return <SimulationTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
           <div className="bg-brand-600 p-2 rounded-lg text-white">
             <BoxSelect className="w-6 h-6" />
           </div>
           <div>
             <h1 className="text-xl font-bold text-slate-900 tracking-tight">ETL 마스터</h1>
             <p className="text-xs text-slate-500 font-mono">데이터 파이프라인 시뮬레이터 v1.0</p>
           </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="hidden md:flex bg-slate-100 p-1 rounded-lg">
          <TabButton 
            active={activeTab === AppTab.THEORY} 
            onClick={() => setActiveTab(AppTab.THEORY)} 
            icon={<BookOpen className="w-4 h-4"/>} 
            label="이론 학습" 
          />
          <TabButton 
            active={activeTab === AppTab.SIMULATION} 
            onClick={() => setActiveTab(AppTab.SIMULATION)} 
            icon={<Gamepad2 className="w-4 h-4"/>} 
            label="시뮬레이션" 
          />
          <TabButton 
            active={activeTab === AppTab.REAL_WORLD} 
            onClick={() => setActiveTab(AppTab.REAL_WORLD)} 
            icon={<Building2 className="w-4 h-4"/>} 
            label="실제 사례" 
          />
          <TabButton 
            active={activeTab === AppTab.QUIZ} 
            onClick={() => setActiveTab(AppTab.QUIZ)} 
            icon={<HelpCircle className="w-4 h-4"/>} 
            label="퀴즈" 
          />
           <TabButton 
            active={activeTab === AppTab.REFLECTION} 
            onClick={() => setActiveTab(AppTab.REFLECTION)} 
            icon={<BrainCircuit className="w-4 h-4"/>} 
            label="생각하기" 
          />
        </nav>
      </header>
      
      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto p-2 bg-white border-b border-slate-200 gap-2 scrollbar-hide">
          <TabButton active={activeTab === AppTab.THEORY} onClick={() => setActiveTab(AppTab.THEORY)} icon={<BookOpen className="w-4 h-4"/>} label="이론" />
          <TabButton active={activeTab === AppTab.SIMULATION} onClick={() => setActiveTab(AppTab.SIMULATION)} icon={<Gamepad2 className="w-4 h-4"/>} label="실습" />
          <TabButton active={activeTab === AppTab.REAL_WORLD} onClick={() => setActiveTab(AppTab.REAL_WORLD)} icon={<Building2 className="w-4 h-4"/>} label="사례" />
          <TabButton active={activeTab === AppTab.QUIZ} onClick={() => setActiveTab(AppTab.QUIZ)} icon={<HelpCircle className="w-4 h-4"/>} label="퀴즈" />
          <TabButton active={activeTab === AppTab.REFLECTION} onClick={() => setActiveTab(AppTab.REFLECTION)} icon={<BrainCircuit className="w-4 h-4"/>} label="생각" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-slate-50/50">
        <div className="h-full container mx-auto py-6 px-4 md:px-8">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

// --- Sub Components ---

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
      ${active 
        ? "bg-white text-brand-600 shadow-sm text-brand-700" 
        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const TheoryView = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
     <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">데이터 생명 주기 (Data Lifecycle)</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
           {[
             { title: "수집 (Collection)", desc: "원본 데이터 확보" },
             { title: "정제 (Cleaning)", desc: "노이즈 및 오류 제거" },
             { title: "통합 (Integration)", desc: "여러 소스 병합" },
             { title: "축소 (Reduction)", desc: "핵심 특성 선택" },
             { title: "변환 (Transformation)", desc: "스케일링/인코딩" }
           ].map((step, i) => (
             <div key={i} className="relative group">
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 hover:border-brand-400 transition-colors h-full flex flex-col justify-center items-center">
                   <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold mb-2">
                     {i + 1}
                   </div>
                   <h3 className="font-bold text-slate-800 break-keep">{step.title}</h3>
                   <p className="text-xs text-slate-500 mt-1 break-keep">{step.desc}</p>
                </div>
                {i < 4 && <div className="hidden md:block absolute top-1/2 -right-3 w-4 h-0.5 bg-slate-300 -z-10" />}
             </div>
           ))}
        </div>
     </div>

     <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
           <h2 className="text-2xl font-bold text-slate-900 mb-4">왜 '정규화'가 필요한가요?</h2>
           <p className="text-slate-600 mb-4 leading-relaxed">
             머신러닝 모델은 수학적 거리(Distance)를 계산하여 패턴을 찾습니다. 만약 한 특성(Feature)은 0~1 사이이고, 다른 특성은 0~1,000,000 범위라면, 숫자가 큰 특성이 계산을 지배하게 되어 모델이 편향되고 학습 속도가 느려집니다.
           </p>
           <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
             <p className="text-sm text-amber-900 font-medium">
               <strong>Min-Max 공식:</strong> <br/>
               <code className="bg-white px-2 py-1 rounded border border-amber-200 mt-1 inline-block">
                 X_new = (X - X_min) / (X_max - X_min)
               </code>
             </p>
           </div>
        </div>
        <div className="flex-1 h-64 w-full bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
           {/* Abstract visual */}
           <div className="absolute inset-0 flex items-center justify-around opacity-30">
              <div className="w-8 h-32 bg-slate-400 rounded-t-lg"></div>
              <div className="w-8 h-16 bg-slate-400 rounded-t-lg"></div>
              <div className="w-8 h-64 bg-slate-400 rounded-t-lg"></div>
           </div>
           <div className="z-10 text-center">
              <p className="font-bold text-slate-500">정규화 미적용 시</p>
              <div className="h-0.5 w-12 bg-slate-400 mx-auto my-2"></div>
              <p className="font-bold text-brand-600">큰 값이 모델을 지배함</p>
           </div>
        </div>
     </div>
  </div>
);

const RealWorldView = () => (
  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">실제 세상의 ETL</h2>
        <p className="text-slate-300">테크 기업들은 매일 페타바이트급 데이터를 어떻게 처리할까요?</p>
      </div>

      <CompanyCard 
        name="네이버 (Naver)" 
        color="bg-green-500" 
        stats="검색 로그, 쇼핑 데이터, 지도"
        desc="네이버는 검색 랭킹 갱신을 위해 방대한 로그를 처리합니다. '봇(Bot) 트래픽'을 엄격하게 제거(정제)하고, 사용자의 위치 데이터와 상점 정보를 결합(통합)하여 정확한 맛집 추천을 제공합니다."
      />
      
      <CompanyCard 
        name="카카오 (Kakao)" 
        color="bg-yellow-400 text-black" 
        stats="메신저, 택시, 뱅크"
        desc="카카오 모빌리티는 수백만 대의 택시 GPS 데이터를 수집합니다. GPS 오차를 보정(노이즈 제거)하고, 도착 예정 시간을 예측하기 위해 타임스탬프를 정규화하여 딥러닝 모델에 입력합니다."
      />

      <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 mt-4">
         <h3 className="font-bold text-slate-800 text-lg mb-3">왜 중요할까요?</h3>
         <p className="text-slate-600">
           실무에서 파이프라인 실패는 단순한 오류 메시지가 아닙니다. 다음과 같은 결과를 초래합니다:
         </p>
         <ul className="list-disc list-inside mt-2 text-slate-600 space-y-2">
           <li>추천 상품이 엉뚱하게 나와 매출이 하락합니다.</li>
           <li>택시 도착 예정 시간이 틀려 사용자가 화를 냅니다.</li>
           <li>금융 보고서 숫자가 틀려 법적 문제가 발생합니다.</li>
         </ul>
      </div>
  </div>
);

const CompanyCard = ({ name, color, stats, desc }: { name: string, color: string, stats: string, desc: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
     <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center font-bold text-lg shadow-sm`}>
          {name[0]}
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{name}</h3>
          <p className="text-xs text-slate-500">{stats}</p>
        </div>
     </div>
     <p className="text-sm text-slate-600 leading-relaxed break-keep">
       {desc}
     </p>
  </div>
);

export default App;