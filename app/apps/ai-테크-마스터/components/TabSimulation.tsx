import React, { useState } from 'react';
import { SIMULATION_ITEMS } from '../constants';
import { TechCategory } from '../types';
import { Car, Mic, Palette, Mail, ScanFace, Bot, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface TabSimulationProps {
  updateMastery: (category: TechCategory, isCorrect: boolean) => void;
}

const itemIcons: Record<string, React.ElementType> = {
  Car, Mic, Palette, Mail, ScanFace, Bot
};

const TabSimulation: React.FC<TabSimulationProps> = ({ updateMastery }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string>('서비스를 선택하고 알맞은 기술 칩을 클릭하세요.');

  const handleItemClick = (itemId: string) => {
    if (results[itemId] !== undefined) return; // Already solved
    setSelectedItem(itemId);
    setFeedback('이제 아래에서 이 서비스에 사용된 핵심 기술을 선택하세요.');
  };

  const handleTechClick = (category: TechCategory) => {
    if (!selectedItem) {
      setFeedback('먼저 위의 서비스를 선택해주세요!');
      return;
    }

    const item = SIMULATION_ITEMS.find(i => i.id === selectedItem);
    if (!item) return;

    const isCorrect = item.correctCategory === category;
    
    setResults(prev => ({ ...prev, [selectedItem]: isCorrect }));
    updateMastery(category, isCorrect);
    setSelectedItem(null);

    if (isCorrect) {
      setFeedback(`정답입니다! [${item.name}] - ${category} 기술이 활용됩니다.`);
    } else {
      setFeedback('틀렸습니다. 다시 시도해보거나 다른 서비스를 선택해보세요.');
      // Allow retry by removing result after a short delay
      setTimeout(() => {
        setResults(prev => {
          const newResults = { ...prev };
          delete newResults[item.id];
          return newResults;
        });
        setFeedback('다시 도전해보세요!');
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 text-white mb-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <Gamepad2Icon className="mr-2" /> 기술 매칭 랩
        </h2>
        <p className="text-slate-300 mb-4">
          현실 세계의 IT 서비스들이 어떤 AI 기술로 작동하는지 연결해보세요.
        </p>
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-600 text-center font-mono text-sm text-yellow-300">
          System: {feedback}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {SIMULATION_ITEMS.map((item) => {
          const Icon = itemIcons[item.iconName];
          const isSolved = results[item.id] === true;
          const isSelected = selectedItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              disabled={isSolved}
              className={`
                relative p-4 rounded-xl border-2 transition-all text-left group
                ${isSolved 
                  ? 'bg-green-50 border-green-500 cursor-default opacity-70' 
                  : isSelected
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200 shadow-lg scale-105'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${isSolved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                  <Icon size={24} />
                </div>
                {isSolved && <CheckCircle size={20} className="text-green-500" />}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
            </button>
          );
        })}
      </div>

      {/* Tech Chips */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { id: 'VISION', label: '컴퓨터 비전', color: 'blue' },
          { id: 'NLP', label: '자연어 처리', color: 'green' },
          { id: 'GEN_AI', label: '생성형 AI', color: 'purple' }
        ].map((tech) => (
          <button
            key={tech.id}
            onClick={() => handleTechClick(tech.id as TechCategory)}
            className={`
              h-32 rounded-xl flex flex-col items-center justify-center transition-all border-b-4 active:border-b-0 active:translate-y-1
              bg-${tech.color}-500 hover:bg-${tech.color}-600 border-${tech.color}-700 text-white shadow-lg
            `}
          >
            <span className="text-lg font-bold mb-1">{tech.label}</span>
            <span className="text-xs opacity-75">Connect Module</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Gamepad2Icon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
);

export default TabSimulation;