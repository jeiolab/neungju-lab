import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Puzzle, HelpCircle, MessageSquare, Lightbulb, Menu, LayoutDashboard } from 'lucide-react';

import { TabId, ProgressState } from './types';
import ProcessMap from './components/ProcessMap';
import SimulationTab from './components/SimulationTab';
import { DICTIONARY_TERMS, QUIZ_QUESTIONS, THINK_TOPICS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('theory');
  const [progress, setProgress] = useState<ProgressState>({ drone: 0, car: 0, vacuum: 0 });

  const handleLevelComplete = (chapter: string) => {
    setProgress(prev => ({
        ...prev,
        [chapter]: 100
    }));
  };

  const navItems = [
    { id: 'theory', label: '프로세스 이론', icon: <BookOpen size={20} /> },
    { id: 'simulation', label: '시뮬레이션 퍼즐', icon: <Puzzle size={20} /> },
    { id: 'dictionary', label: '용어 사전', icon: <HelpCircle size={20} /> },
    { id: 'quiz', label: '퀴즈 & 테스트', icon: <Lightbulb size={20} /> },
    { id: 'think', label: '토론과 생각', icon: <MessageSquare size={20} /> },
  ];

  const totalProgress = Math.round((progress.drone + progress.car + progress.vacuum) / 3);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-20 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-lg">L</div>
            <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-800">LogicLoop</h1>
                <p className="text-xs text-slate-500 font-medium">AI Thinking Lab</p>
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabId)}
                    className={`
                        flex items-center w-full px-4 py-3 gap-3 rounded-xl transition-all duration-200 group
                        ${activeTab === item.id 
                            ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                    `}
                >
                    <div className={`${activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {item.icon}
                    </div>
                    <span className="text-sm">{item.label}</span>
                    {activeTab === item.id && (
                        <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                </button>
            ))}
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Progress</p>
                <span className="text-sm font-bold text-blue-600">{totalProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000 ease-out" style={{ width: `${totalProgress}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Complete scenarios to level up.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-30">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
                <h1 className="font-bold text-lg">LogicLoop</h1>
            </div>
            {/* Simple mobile nav toggle or items could go here */}
            <div className="text-xs font-bold text-blue-600">{totalProgress}% Done</div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    {activeTab === 'theory' && <ProcessMap />}
                    
                    {activeTab === 'simulation' && (
                        <SimulationTab onComplete={handleLevelComplete} progress={progress} />
                    )}

                    {activeTab === 'dictionary' && (
                        <div className="space-y-6">
                            <header className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-800">용어 사전</h2>
                                <p className="text-slate-500 mt-2">인공지능과 로봇 공학의 핵심 용어를 알아봅니다.</p>
                            </header>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {DICTIONARY_TERMS.map((item, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                                            <BookOpen size={20} />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 mb-2">{item.term}</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">{item.def}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div className="space-y-6 max-w-4xl">
                            <header className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-800">빈칸 채우기 퀴즈</h2>
                                <p className="text-slate-500 mt-2">학습한 내용을 테스트해보세요.</p>
                            </header>
                             <div className="grid grid-cols-1 gap-6">
                                {QUIZ_QUESTIONS.map((q, i) => (
                                    <QuizCard key={q.id} question={q} index={i} />
                                ))}
                             </div>
                        </div>
                    )}

                    {activeTab === 'think' && (
                        <div className="space-y-6">
                            <header className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-800">토론과 생각</h2>
                                <p className="text-slate-500 mt-2">정답이 없는 문제에 대해 깊게 고민해봅시다.</p>
                            </header>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {THINK_TOPICS.map((topic, i) => (
                                    <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col">
                                        <div className="flex items-center gap-2 mb-4 text-yellow-400">
                                            <Lightbulb size={20} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Topic {i + 1}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 leading-tight">{topic.title}</h3>
                                        <p className="text-slate-300 leading-relaxed flex-1">{topic.content}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden bg-white border-t border-slate-200 px-6 py-2 flex justify-between">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabId)}
                    className={`p-2 flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    {item.icon}
                    <span className="text-[10px] font-bold">{item.label.split(' ')[0]}</span>
                </button>
            ))}
        </nav>
      </div>
    </div>
  );
};

// Subcomponent for Quiz
const QuizCard: React.FC<{ question: any; index: number }> = ({ question, index }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleSelect = (opt: string) => {
        if (selected) return; 
        setSelected(opt);
        setIsCorrect(opt === question.correctAnswer);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                    {index + 1}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-xl mb-6">{question.question}</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {question.options.map((opt: string) => (
                            <button
                                key={opt}
                                onClick={() => handleSelect(opt)}
                                disabled={!!selected}
                                className={`
                                    p-4 rounded-xl text-left text-base font-medium transition-all border-2
                                    ${selected === opt 
                                        ? (opt === question.correctAnswer 
                                            ? 'bg-green-50 text-green-700 border-green-400' 
                                            : 'bg-red-50 text-red-700 border-red-400')
                                        : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600'}
                                    ${selected && opt === question.correctAnswer && selected !== opt ? 'bg-green-50 text-green-700 border-green-400' : ''}
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    {selected && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                            className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
                        >
                            <p className="font-bold mb-1 flex items-center gap-2">
                                {isCorrect ? <span className="text-xl">🎉</span> : <span className="text-xl">🤔</span>}
                                {isCorrect ? '정답입니다!' : '다시 생각해보세요.'}
                            </p>
                            <p className="text-sm opacity-90">{question.explanation}</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;