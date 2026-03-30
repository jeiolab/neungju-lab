import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import DiscussionTab from './components/DiscussionTab';
import { Tab } from './types';

const App: React.FC = () => {
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <header className="bg-white border-b border-gray-200 py-8 md:py-12 mb-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            스마트 라이프: <span className="text-indigo-600">나의 하루</span>
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
  );
};

export default App;