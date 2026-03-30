'use client';

import React, { useState } from 'react';
import { Shield, BookOpen, Wrench, ShoppingCart, HelpCircle, PenTool, Coins, User, Menu } from 'lucide-react';
import WorkshopTab from './components/WorkshopTab';
import { ManualTab, MarketTab, QuizTab, ReflectionTab } from './components/TabComponents';
import { Mission, Tool, DataCategory, RawDataField } from './types';

// Mock Data Constants
const MOCK_TOOLS: Tool[] = [
  { id: 'del', name: '삭제', type: 'DELETE', description: '데이터를 완전히 삭제합니다.', utilityCost: 100, safetyGain: 100, icon: 'trash' },
  { id: 'mask_name', name: '이름 마스킹', type: 'MASK', description: '이름의 일부를 *로 가립니다.', utilityCost: 20, safetyGain: 40, icon: 'mask' },
  { id: 'mask_id', name: '주민번호 뒷자리 삭제', type: 'MASK', description: '생년월일만 남깁니다.', utilityCost: 10, safetyGain: 90, icon: 'mask' },
  { id: 'cat_age', name: '나이 범주화(10세)', type: 'CATEGORY', description: '10대, 20대로 표시합니다.', utilityCost: 30, safetyGain: 60, icon: 'list' },
  { id: 'cat_addr', name: '주소 광역화', type: 'CATEGORY', description: '시/도 단위까지만 표시합니다.', utilityCost: 40, safetyGain: 70, icon: 'map' },
  { id: 'agg_income', name: '소득 총계(평균)', type: 'ROUND', description: '개별 값을 평균으로 대체합니다.', utilityCost: 60, safetyGain: 80, icon: 'sigma' },
];

const MOCK_MISSION: Mission = {
  id: 'm1',
  title: '의료 연구용 데이터셋 생성',
  description: '당뇨병 연구를 위해 병원 데이터를 연구소에 제공하려 합니다. 개인을 식별할 수 없으면서도 연령대별 지역별 질병 분포를 알 수 있어야 합니다.',
  requiredSafety: 80,
  requiredUtility: 60,
  context: "Medical Research for Diabetes",
  data: [
    { id: 'd1', name: '이름', value: '김철수', category: DataCategory.IDENTIFIER },
    { id: 'd2', name: '주민등록번호', value: '850101-1234567', category: DataCategory.IDENTIFIER },
    { id: 'd3', name: '주소', value: '서울시 강남구 역삼동 123-45', category: DataCategory.QUASI_IDENTIFIER },
    { id: 'd4', name: '나이', value: '38', category: DataCategory.QUASI_IDENTIFIER },
    { id: 'd5', name: '진단명', value: '제2형 당뇨병', category: DataCategory.SENSITIVE },
    { id: 'd6', name: '최근혈당', value: '145 mg/dL', category: DataCategory.NON_IDENTIFIER }
  ]
};

function App() {
  const [activeTab, setActiveTab] = useState<'manual' | 'workshop' | 'market' | 'quiz' | 'reflect'>('workshop');
  const [coins, setCoins] = useState(100);
  const [processedHistory, setProcessedHistory] = useState<any[]>([]);

  const handleWorkshopSuccess = (earnedCoins: number) => {
    setCoins(prev => prev + earnedCoins);
    // Add dummy history for market
    setProcessedHistory(prev => [...prev, { safetyScore: 85, utilityScore: 65, date: new Date() }]);
  };

  const handleQuizCorrect = () => {
      setCoins(prev => prev + 20);
      alert("정답입니다! 20 코인을 획득했습니다.");
  }

  const navItems = [
    { id: 'manual', label: '가공 매뉴얼', icon: BookOpen },
    { id: 'workshop', label: '공작소', icon: Wrench },
    { id: 'market', label: '데이터 마켓', icon: ShoppingCart },
    { id: 'quiz', label: '퀴즈/검수', icon: HelpCircle },
    { id: 'reflect', label: '생각해보기', icon: PenTool },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden md:block">가명 정보 공작소 <span className="text-emerald-400 text-sm font-normal ml-2">The Anonymizer</span></h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="font-mono font-bold text-yellow-400">{coins} C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                <User className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto overflow-hidden">
        {/* Navigation Sidebar (Bottom on Mobile) */}
        <nav className="md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex md:flex-col order-2 md:order-1 overflow-x-auto md:overflow-visible">
           {navItems.map((item) => (
             <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex-1 md:flex-none flex flex-col md:flex-row items-center md:gap-3 p-3 md:px-6 md:py-4 transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-50 text-emerald-700 border-t-4 md:border-t-0 md:border-r-4 border-emerald-500' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
             >
               <item.icon className={`w-6 h-6 md:w-5 md:h-5 ${activeTab === item.id ? 'stroke-2' : 'stroke-1.5'}`} />
               <span className="text-xs md:text-sm font-medium mt-1 md:mt-0 whitespace-nowrap">{item.label}</span>
             </button>
           ))}
        </nav>

        {/* Dynamic Tab Content */}
        <main className="flex-1 bg-slate-100 overflow-hidden relative order-1 md:order-2">
          {activeTab === 'workshop' && (
            <WorkshopTab 
              mission={MOCK_MISSION} 
              tools={MOCK_TOOLS} 
              onSuccess={handleWorkshopSuccess} 
            />
          )}
          {activeTab === 'manual' && <ManualTab />}
          {activeTab === 'market' && <MarketTab processedHistory={processedHistory} />}
          {activeTab === 'quiz' && <QuizTab onCorrect={handleQuizCorrect} />}
          {activeTab === 'reflect' && <ReflectionTab />}
        </main>
      </div>
    </div>
  );
}

export default App;
