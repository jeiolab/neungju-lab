import React, { useState } from 'react';
import { TabType, WizardState } from './types';
import TabTheory from './components/TabTheory';
import TabWizard from './components/TabWizard';
import TabQuiz from './components/TabQuiz';
import TabThink from './components/TabThink';
import TabLearnMore from './components/TabLearnMore';
import SecurityReport from './components/SecurityReport';
import { BookOpen, Edit3, HelpCircle, PenTool, Layout, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  
  // Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Wizard State
  const [wizardData, setWizardData] = useState<WizardState>({
    step: 1,
    serviceName: '',
    serviceDescription: '',
    collectedData: [],
    threats: [],
    securityTech: {
      passwordStorage: '',
      communication: '',
      personalData: '',
      authentication: '',
    },
    operations: {
      keyManagement: '',
      logging: '',
      retention: '',
    },
    score: 0,
    badges: [],
    isComplete: false,
  });

  const handleWizardComplete = () => {
    // Scroll to top or show celebration
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Wizard is complete and we are in wizard tab, show report
  const showReport = activeTab === 'wizard' && wizardData.isComplete;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              <span>보안 설계 멘토</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
               <button onClick={() => setActiveTab('theory')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'theory' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}>이론 개념</button>
               <button onClick={() => setActiveTab('wizard')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'wizard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}>설계 실습</button>
               <button onClick={() => setActiveTab('quiz')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'quiz' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}>퀴즈</button>
               <button onClick={() => setActiveTab('think')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'think' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}>생각하기</button>
               <button onClick={() => setActiveTab('learn')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'learn' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}>FAQ</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Simplified for this constraints) */}
      <div className="md:hidden bg-white border-b flex justify-around p-2 text-xs no-print sticky top-16 z-40">
           <button onClick={() => setActiveTab('theory')} className={`p-2 flex flex-col items-center ${activeTab === 'theory' ? 'text-indigo-600' : 'text-gray-400'}`}><BookOpen size={20}/>이론</button>
           <button onClick={() => setActiveTab('wizard')} className={`p-2 flex flex-col items-center ${activeTab === 'wizard' ? 'text-indigo-600' : 'text-gray-400'}`}><Edit3 size={20}/>설계</button>
           <button onClick={() => setActiveTab('quiz')} className={`p-2 flex flex-col items-center ${activeTab === 'quiz' ? 'text-indigo-600' : 'text-gray-400'}`}><Layout size={20}/>퀴즈</button>
           <button onClick={() => setActiveTab('think')} className={`p-2 flex flex-col items-center ${activeTab === 'think' ? 'text-indigo-600' : 'text-gray-400'}`}><PenTool size={20}/>탐구</button>
           <button onClick={() => setActiveTab('learn')} className={`p-2 flex flex-col items-center ${activeTab === 'learn' ? 'text-indigo-600' : 'text-gray-400'}`}><HelpCircle size={20}/>FAQ</button>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'theory' && <TabTheory />}
        {activeTab === 'wizard' && (
          showReport ? (
            <SecurityReport data={wizardData} quizScore={quizScore} />
          ) : (
            <TabWizard wizardData={wizardData} setWizardData={setWizardData} onComplete={handleWizardComplete} />
          )
        )}
        {activeTab === 'quiz' && <TabQuiz score={quizScore} setScore={setQuizScore} completed={quizCompleted} setCompleted={setQuizCompleted} />}
        {activeTab === 'think' && <TabThink />}
        {activeTab === 'learn' && <TabLearnMore />}
      </main>
      
      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm mt-12 mb-8 no-print">
         <p>© 2024 보안 설계 멘토. Educational Purpose Only.</p>
         <p className="mt-1">AI 피드백 기능: {process.env.API_KEY ? <span className="text-green-500">활성</span> : <span className="text-gray-400">비활성 (설정 필요)</span>}</p>
      </footer>
    </div>
  );
};

export default App;
