import React, { useState } from 'react';
import { Tab } from './types';
import CaseRequest from './components/CaseRequest';
import FieldInvestigation from './components/FieldInvestigation';
import InvestigationLog from './components/InvestigationLog';
import DeductionEssay from './components/DeductionEssay';
import CaseClosed from './components/CaseClosed';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CASE_REQUEST);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CASE_REQUEST:
        return <CaseRequest />;
      case Tab.FIELD_INVESTIGATION:
        return <FieldInvestigation />;
      case Tab.INVESTIGATION_LOG:
        return <InvestigationLog />;
      case Tab.DEDUCTION_ESSAY:
        return <DeductionEssay />;
      case Tab.CASE_CLOSED:
        return <CaseClosed />;
      default:
        return <CaseRequest />;
    }
  };

  const tabs = [
    { id: Tab.CASE_REQUEST, label: '📂 사건 의뢰', mobileLabel: '의뢰' },
    { id: Tab.FIELD_INVESTIGATION, label: '🕵️ 현장 조사', mobileLabel: '조사' },
    { id: Tab.INVESTIGATION_LOG, label: '📝 수사 일지', mobileLabel: '일지' },
    { id: Tab.DEDUCTION_ESSAY, label: '🧠 추리 논술', mobileLabel: '추리' },
    { id: Tab.CASE_CLOSED, label: '✅ 사건 종결', mobileLabel: '종결' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h1 className="text-xl font-bold tracking-wider text-white">
              데이터 <span className="text-amber-500">탐정</span> XY
            </h1>
          </div>
          <div className="hidden md:block text-xs text-slate-500 font-mono">
             보안 등급: 1급 기밀 (TOP SECRET)
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }
              `}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content Panel */}
        <div className="min-h-[600px]">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} 데이터 탐정 사무소 (Data Detective Agency). 모든 데이터는 기밀입니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
