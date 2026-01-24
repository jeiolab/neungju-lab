import React, { useState } from 'react';
import { EXPLORE_DATA, CONCEPTS } from '../constants';
import { Shuffle, ArrowDown } from 'lucide-react';

export const TabExplore: React.FC = () => {
  const [items, setItems] = useState(EXPLORE_DATA);
  const [matched, setMatched] = useState<{[key: string]: string}>({}); // itemId -> stepTitle

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e: React.DragEvent, stepTitle: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    setMatched(prev => ({ ...prev, [id]: stepTitle }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetGame = () => {
    setMatched({});
  };

  // Check if correctly matched (simplified logic for demo)
  // Logic: e2->Step1, e3->Step2, e4->Step3, e5->Step4
  const checkMatch = (itemId: string, stepTitle: string) => {
     if (itemId === 'e2' && stepTitle.includes('수집')) return true;
     if (itemId === 'e3' && stepTitle.includes('전송')) return true;
     if (itemId === 'e4' && stepTitle.includes('저장')) return true;
     if (itemId === 'e5' && stepTitle.includes('활용')) return true;
     return false;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">생활 속 IoT 데이터의 여행</h2>
        <p className="text-slate-600">아래 아이템을 올바른 단계 카드로 드래그해보세요!</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-300">
        {items.map(item => {
            if (matched[item.id]) return null;
            return (
                <div 
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className="bg-white px-4 py-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 font-medium transition-colors"
                >
                    {item.name}
                </div>
            )
        })}
        {Object.keys(matched).length === items.length - 1 && ( // -1 because e1 is dummy source
             <div className="text-slate-400 italic">모든 아이템을 배치했습니다!</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {CONCEPTS.map(c => (
            <div 
                key={c.step}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, c.title)}
                className="bg-white p-4 rounded-xl border border-slate-200 min-h-[160px] flex flex-col items-center text-center shadow-sm"
            >
                <div className="mb-2 p-2 bg-slate-50 rounded-full">{c.icon}</div>
                <h3 className="font-bold text-sm text-slate-700 mb-4">{c.title}</h3>
                
                <div className="w-full space-y-2">
                    {Object.entries(matched).map(([id, title]) => {
                        if (title === c.title) {
                            const item = items.find(i => i.id === id);
                            const isCorrect = checkMatch(id, title);
                            return (
                                <div key={id} className={`text-xs px-2 py-1 rounded border ${isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                    {item?.name} {isCorrect ? '✅' : '❓'}
                                </div>
                            )
                        }
                        return null;
                    })}
                </div>
            </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button onClick={resetGame} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <Shuffle className="w-4 h-4" /> 다시 하기
        </button>
      </div>
    </div>
  );
};