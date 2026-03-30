import React from 'react';
import { TECH_DATA } from '../constants';
import { X, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
  onRemove: (id: string) => void;
}

export const Wordbook: React.FC<Props> = ({ isOpen, onClose, savedIds, onRemove }) => {
  if (!isOpen) return null;

  const savedItems = TECH_DATA.filter(tech => savedIds.includes(tech.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-right"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <BookOpen className="text-indigo-600" />
            나만의 단어장
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {savedItems.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">
            <p>저장된 용어가 없습니다.</p>
            <p className="text-sm mt-2">학습하면서 별표를 눌러 추가해보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedItems.map(item => (
              <div key={item.id} className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 relative group">
                <h3 className="font-bold text-lg text-indigo-800 mb-1">{item.name}</h3>
                <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold">특징: </span> {item.features[0]}
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition"
                  title="삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
