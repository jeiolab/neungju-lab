import React, { useState, useEffect } from 'react';
import { BookOpen, PenTool, FlaskConical, HelpCircle, MessageSquare, Award, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';
import ConceptsTab from './components/ConceptsTab';
import WizardTab from './components/WizardTab';
import LearnMoreTab from './components/LearnMoreTab';
import QuizTab from './components/QuizTab';
import DiscussionTab from './components/DiscussionTab';
import { TabType, WizardState } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('concepts');
  const [totalScore, setTotalScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [wizardData, setWizardData] = useState<WizardState | null>(null);

  // Load saved data
  useEffect(() => {
    const savedScores = localStorage.getItem('careerwizard_scores_v1');
    if (savedScores) {
      const parsed = JSON.parse(savedScores);
      setTotalScore(parsed.score || 0);
      setLevel(parsed.level || 1);
      setBadges(parsed.badges || []);
    }
    
    const savedDoc = localStorage.getItem('careerwizard_doc_v1');
    if (savedDoc) {
      setWizardData(JSON.parse(savedDoc));
    }
  }, []);

  // Save scores when updated
  useEffect(() => {
    localStorage.setItem('careerwizard_scores_v1', JSON.stringify({ score: totalScore, level, badges }));
  }, [totalScore, level, badges]);

  const awardBadge = (badgeName: string) => {
    if (!badges.includes(badgeName)) {
      setBadges(prev => [...prev, badgeName]);
      alert(`🎉 축하합니다! 새로운 배지 획득: [${badgeName}]`);
    }
  };

  const updateWizardScore = (score: number, passedEthics: boolean) => {
    // Only update if it's a significant improvement or first time
    setTotalScore(prev => prev + score);
    if (score >= 80) setLevel(prev => Math.min(prev + 1, 5));
    if (passedEthics) awardBadge('윤리 마스터');
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabType; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center p-3 w-full sm:w-auto transition-all duration-200 border-b-4 ${
        activeTab === id
          ? 'border-indigo-600 text-indigo-700 bg-indigo-50 font-bold'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${activeTab === id ? 'stroke-2' : 'stroke-1'}`} />
      <span className="text-xs sm:text-sm whitespace-nowrap">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto bg-white shadow-xl overflow-hidden border-x border-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 sm:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <PenTool size={20} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                진로 에이전트 기획 위저드
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                인공지능과 인간의 협업 설계하기
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">내 레벨</div>
              <div className="text-sm font-bold text-indigo-600">Lv.{level}</div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500">배지</div>
              <div className="flex -space-x-1">
                 {badges.length === 0 ? <span className="text-xs text-gray-300">-</span> : badges.map((b, i) => (
                   <div key={i} title={b} className="w-6 h-6 rounded-full bg-yellow-100 border border-yellow-300 flex items-center justify-center text-xs">🏅</div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex overflow-x-auto no-scrollbar border-t border-gray-100 bg-white">
          <TabButton id="concepts" label="핵심 개념" icon={BookOpen} />
          <TabButton id="wizard" label="기획 위저드" icon={Smartphone} />
          <TabButton id="learn" label="더 알아보기" icon={FlaskConical} />
          <TabButton id="quiz" label="퀴즈" icon={HelpCircle} />
          <TabButton id="discussion" label="생각해보기" icon={MessageSquare} />
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50">
        {activeTab === 'concepts' && <ConceptsTab onNext={() => setActiveTab('wizard')} />}
        {activeTab === 'wizard' && (
          <WizardTab 
            savedData={wizardData} 
            onSave={(data) => {
              setWizardData(data);
              localStorage.setItem('careerwizard_doc_v1', JSON.stringify(data));
            }}
            onComplete={updateWizardScore}
          />
        )}
        {activeTab === 'learn' && <LearnMoreTab />}
        {activeTab === 'quiz' && <QuizTab onScoreUpdate={(s) => setTotalScore(prev => prev + s)} />}
        {activeTab === 'discussion' && <DiscussionTab />}
      </main>
    </div>
  );
};

export default App;