import React, { useState } from 'react';
import { BookOpen, Activity, HelpCircle, FileText, Share2 } from 'lucide-react';
import ConceptCard from './components/ConceptCard';
import Simulation from './components/Simulation';
import Quiz from './components/Quiz';
import BadgeDisplay from './components/BadgeDisplay';

type Tab = 'learn' | 'simulate' | 'quiz' | 'reflect';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [badges, setBadges] = useState<string[]>([]);
  
  const unlockBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges(prev => [...prev, badge]);
      // Optional: Add toast notification logic here
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'learn':
        return (
          <div className="max-w-4xl mx-auto mt-8 px-4">
             <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">개념 마스터하기</h2>
              <p className="text-gray-500 mt-2">본격적으로 시작하기 전에 기초를 다집니다.</p>
            </div>
            <ConceptCard onComplete={() => {
              unlockBadge('Learner');
              setActiveTab('simulate');
            }} />
          </div>
        );
      case 'simulate':
        return (
          <div className="max-w-6xl mx-auto mt-8 px-4 pb-12">
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900">k-NN 실험실</h2>
              <p className="text-gray-500 mt-2">'나' 점을 드래그해보세요. 이웃이 어떻게 변하나 관찰하세요.</p>
            </div>
            <Simulation onUnlockBadge={unlockBadge} />
          </div>
        );
      case 'quiz':
        return (
          <div className="max-w-4xl mx-auto mt-8 px-4">
             <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">지식 확인</h2>
              <p className="text-gray-500 mt-2">이해도를 테스트하고 마스터 배지를 획득하세요.</p>
            </div>
            <Quiz onComplete={(score) => {
              if (score >= 3) unlockBadge('Quiz Whiz');
            }} />
          </div>
        );
      case 'reflect':
        return (
          <div className="max-w-3xl mx-auto mt-8 px-4 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-purple-500">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FileText /> 엔지니어처럼 생각하기</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">1. 스팸 필터 문제</h3>
                  <p className="text-gray-600 mt-1 break-keep">
                    k-NN을 스팸 필터에 쓴다고 상상해봅시다. 정상 메일이 우연히 '무료', '돈', '클릭' 같은 단어를 포함해서(예: 경제 뉴스), 주변 이웃이 다 스팸이라면? k-NN은 이걸 스팸으로 분류할 겁니다. 어떻게 고칠까요? (힌트: 거리 가중치?)
                  </p>
                </div>
                
                <hr />

                <div>
                  <h3 className="font-bold text-lg text-gray-800">2. 점심 메뉴 추천기</h3>
                  <p className="text-gray-600 mt-1 break-keep">
                    점심 메뉴를 추천하는 시스템을 설계해봅시다. 어떤 3가지 특성(축)을 쓸까요? 매운맛? 가격? 칼로리? 가격(1000~10000원)과 매운맛(1~5단계)의 차이는 어떻게 정규화할까요?
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-500 italic">"데이터 사이언스는 수학이 아니라, 세상을 이해하는 방법입니다." - AI 코치</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="text-indigo-600" />
            <span className="font-extrabold text-xl tracking-tight text-gray-900">k-NN <span className="text-indigo-600">거리 게임</span></span>
          </div>
          
          <div className="hidden md:flex space-x-1">
            <button 
              onClick={() => setActiveTab('learn')} 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'learn' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              개념 학습
            </button>
            <button 
              onClick={() => setActiveTab('simulate')} 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'simulate' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              시뮬레이션
            </button>
            <button 
              onClick={() => setActiveTab('quiz')} 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'quiz' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              퀴즈
            </button>
             <button 
              onClick={() => setActiveTab('reflect')} 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'reflect' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              심화 탐구
            </button>
          </div>

          <div className="flex items-center">
            {/* Mobile menu button simplified */}
            <div className="md:hidden">
              <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-1 rounded">메뉴</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tab Navigation for Mobile */}
      <div className="md:hidden bg-white border-b border-gray-200 flex justify-around p-2">
         <button onClick={() => setActiveTab('learn')} className={`p-2 rounded-lg ${activeTab === 'learn' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}><BookOpen size={20}/></button>
         <button onClick={() => setActiveTab('simulate')} className={`p-2 rounded-lg ${activeTab === 'simulate' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}><Activity size={20}/></button>
         <button onClick={() => setActiveTab('quiz')} className={`p-2 rounded-lg ${activeTab === 'quiz' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}><HelpCircle size={20}/></button>
      </div>

      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Footer / Badge Drawer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <BadgeDisplay unlockedBadges={badges} />
        </div>
      </div>
    </div>
  );
};

export default App;