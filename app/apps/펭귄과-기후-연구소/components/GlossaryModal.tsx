import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { GLOSSARY } from '../constants';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="bg-sky-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-bold">연구 용어 사전</h2>
          </div>
          <button onClick={onClose} className="hover:bg-sky-700 p-1 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {GLOSSARY.map((item, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <h3 className="font-bold text-sky-900 text-lg mb-1">{item.term}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
          데이터 생태학자 필드 가이드 v1.0 • 남극 연구 기지
        </div>
      </div>
    </div>
  );
};

export default GlossaryModal;