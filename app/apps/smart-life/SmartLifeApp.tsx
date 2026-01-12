'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Navigation from './components/Navigation';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import DiscussionTab from './components/DiscussionTab';
import { Tab } from './types';

const SmartLifeApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONCEPT);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CONCEPT:
        return <ConceptTab />;
      case Tab.SIMULATION:
        return <SimulationTab />;
      case Tab.DEEP_DIVE:
        return <DeepDiveTab />;
      case Tab.QUIZ:
        return <QuizTab />;
      case Tab.DISCUSSION:
        return <DiscussionTab />;
      default:
        return <ConceptTab />;
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-0 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">스마트 라이프</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">디지털 기술이 일상생활에 미치는 긍정적 영향을 체험하는 고등학교 교육용 웹 앱</p>
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            
            <header className="bg-white border-b border-slate-200 py-8 md:py-12 mb-6">
              <div className="max-w-5xl mx-auto px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  스마트 라이프: <span className="text-blue-600">나의 하루</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto break-keep">
                  디지털 기술이 우리 삶을 어떻게 바꾸고 있는지 직접 체험하고, 
                  긍정적인 영향과 함께 생각해야 할 점을 알아봐요.
                </p>
              </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 pb-20">
              {renderContent()}
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SmartLifeApp;

