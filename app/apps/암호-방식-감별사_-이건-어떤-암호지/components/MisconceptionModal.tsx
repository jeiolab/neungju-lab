import React from 'react';
import { Misconception } from '../types';
import { X, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  misconceptions: Misconception[];
}

const MisconceptionModal: React.FC<Props> = ({ isOpen, onClose, misconceptions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <BookOpen className="w-5 h-5 text-red-500" />
            오개념 도감
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {misconceptions.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p>아직 등록된 오개념이 없습니다.</p>
              <p className="text-sm mt-1">완벽한 감별사이시군요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {misconceptions.map((m) => (
                <div key={m.id} className="p-4 border border-red-100 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-700">{m.scenarioTitle}</span>
                    <span className="text-xs text-slate-400">{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex-1">
                      <span className="block text-xs text-slate-500 mb-1">나의 판단</span>
                      <span className="px-2 py-1 bg-white border border-red-200 text-red-600 rounded font-medium line-through decoration-2">
                        {m.userCategory}
                      </span>
                    </div>
                    <span className="text-slate-300">➜</span>
                    <div className="flex-1">
                      <span className="block text-xs text-slate-500 mb-1">정답</span>
                      <span className="px-2 py-1 bg-green-100 border border-green-200 text-green-700 rounded font-medium">
                        {m.correctCategory}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-slate-50 rounded-b-2xl text-center">
            <button 
                onClick={onClose}
                className="text-slate-500 hover:text-slate-800 font-medium text-sm"
            >
                닫기
            </button>
        </div>
      </div>
    </div>
  );
};

export default MisconceptionModal;