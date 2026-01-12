'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Navbar from './components/Navbar';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabLearnMore from './components/TabLearnMore';
import TabQuiz from './components/TabQuiz';
import TabDiscussion from './components/TabDiscussion';
import { TabType } from './types';

const CopyrightSharingWorldApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('simulation');

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
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">저작권과 공유의 세계</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">저작권, 크리에이티브 커먼즈 라이선스(CCL), 공정 이용을 시뮬레이션과 퀴즈를 통해 학습하는 인터랙티브 교육 플랫폼입니다.</p>
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
            
            <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full">
              {currentTab === 'theory' && <TabTheory />}
              {currentTab === 'simulation' && <TabSimulation />}
              {currentTab === 'learnMore' && <TabLearnMore />}
              {currentTab === 'quiz' && <TabQuiz />}
              {currentTab === 'discussion' && <TabDiscussion />}
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CopyrightSharingWorldApp;

